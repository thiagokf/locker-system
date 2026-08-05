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
      return
    }
    console.log("Atribuindo a variavel");
    new_locker.localizacao = String(localizacao.current.value);
    console.log("deu boa, fazendo o post pelo axios");
    console.log('Atribuindo a variável:', new_locker);

    try {
      const res = await postLocker(new_locker);
      if (res.status === 200) {
        setSucess(true);
      } else {
        setSucess(false);
      }
      setMensagem(String(res.data));
      if (localizacao.current) localizacao.current.value = "";
    } catch (e) {
      console.error(e);
      setSucess(false);
      setMensagem('Erro ao conectar com o servidor!');
    }
  }

  return (
    <>
    <div className={classes.main}>
      <div className={classes.header}>
        <h1 className={classes.title}>Cadastro de Locker</h1>
      </div>
      <div className={classes.body}>
        <form className={classes.form} onSubmit={cadastrar_locker}>
          <div className={classes.formGroup}>
            <input 
              className={classes.input} 
              placeholder="Localização do locker" 
              type="text" 
              ref={localizacao} 
              />
          <button className={classes.submitButton} type="submit">
            Cadastrar Locker
          </button>
          {sucess !== null && (
              <p className={classes.message} data-success={sucess}>
                {mensagem}
              </p>
            )}
          </div>
        </form>
        <Link className={classes.backButton} to="/">← Voltar</Link>
      </div>
    </div>
    </>
  )
}

export default Locker