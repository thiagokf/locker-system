import React from 'react'
import { useState, useRef } from 'react';
import { postLocker } from '../../lib/actions';
import { Link } from 'react-router-dom'
import type { LockerProps } from '../../types/locker';

import classes from './Locker.module.css'

const Locker = () => {
  const [sucess, setSucess] = useState<boolean | null>(null);
  const [mensagem, setMensagem] = useState<String>("");
  let new_locker = {} as LockerProps;

  // Tipar o useRef pro type Script saber o que vai guardar

  const localizacao = useRef<HTMLInputElement>(null);

  // função de post do locker quando cadastrado
  async function cadastrar_locker(e: React.FormEvent){
    e.preventDefault();
    setSucess(null);
    if (!localizacao.current || !localizacao.current.value) {
      setMensagem("Id ou localização invalida")
      console.log("Id ou localização invalida");
      return
    }
    console.log("Atribuindo a variavel");
    new_locker.localizacao = String(localizacao.current.value);
    console.log("deu boa, fazendo o post pelo axios");
    console.log('Atribuindo a variável:', new_locker);

    try {
      const res = await postLocker(new_locker);
      if (res.ok){
        setSucess(true);
      } else {
        setSucess(false);
      }
      setMensagem(String(res));
    } catch (e) {
      console.error(e);
      setSucess(false);
      setMensagem('Deu boga!');
    }
  }

  return (
    <>
    <div className={classes.main}>

      <form className={classes.form} onSubmit={cadastrar_locker}>
        <h1>Cadastro de locker</h1>
        <input placeholder="localização" type="text" ref={localizacao} />
        <button type="submit"> cadastrar </button>
        <p>{mensagem}</p>
      <Link to="/">Voltar</Link>
      </form>
      {sucess === true ? "Cadastro Feito!" : sucess === false ? "Erro ao cadastrar" : null}
    </div>
    </>
  )
}

export default Locker