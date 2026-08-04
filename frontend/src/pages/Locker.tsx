import React from 'react'
import { useState, useRef } from 'react';
import { postLocker } from '../lib/actions';
import type { Locker } from '../types/locker';
import type { ReactFormState } from 'react-dom/client';

const Locker = () => {
  const [sucess, setSucess] = useState<boolean | null>(null);
  const [mensagem, setMensagem] = useState<String>("");
  let new_locker = {} as Locker;

  // Tipar o useRef pro type Script saber o que vai guardar
  const id = useRef<HTMLInputElement>(null);
  const localizacao = useRef<HTMLInputElement>(null);

  // função de post do locker quando cadastrado
  async function cadastrar_locker(e: React.FormEvent){
    e.preventDefault();
    setSucess(null);
    if (!id.current || !localizacao.current || !id.current.value || !localizacao.current.value) {
      setMensagem("Id ou localização invalida")
      console.log("Id ou localização invalida");
      return
    }
    console.log("Atribuindo a variavel");
    new_locker.id = Number(id.current.value);
    new_locker.loc = String(localizacao.current.value);
    console.log("deu boa, fazendo o post pelo axios");
    console.log('Atribuindo a variável:', new_locker);

    try {
      await postLocker(new_locker);
      console.log('Deu boa!');
      setSucess(true);
      setMensagem('Deu boa!');
    } catch (e) {
      console.error(e);
      setSucess(false);
      setMensagem('Deu boga!');
    }
  }

  return (
        <>
      <form onSubmit={cadastrar_locker}>
        <h1>Cadastro de locker</h1>
        <input placeholder="id" type="number" ref={id} />
        <input placeholder="localização" type="text" ref={localizacao} />
        <button type="submit"> cadastrar </button>
        <p>{mensagem}</p>
      </form>
      {sucess === true ? "Cadastro Feito!" : sucess === false ? "Erro ao cadastrar" : null}
    </>
  )
}

export default Locker