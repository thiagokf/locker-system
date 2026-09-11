import React from 'react'
import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postCompartimento } from '../../lib/actions';
import type { CompartimentoProps } from '../../types/compartimento';
import classes from './Compartimento.module.css';

const Compartimento = () => {
    const [sucess, setSucess] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string>();
    const { id } = useParams<{ id: string }>()
    const new_compartimento = {} as CompartimentoProps;

    const tamanho = useRef<HTMLInputElement>(null);

    async function cadastrar_compartimento(e: React.FormEvent) {
        e.preventDefault();
        setSucess(false)

        if (!tamanho.current || !tamanho.current.value) {
          return
        }
        const tamanhoNormalizado = (tamanho.current.value).toUpperCase();
        console.log(tamanhoNormalizado);
        if (tamanhoNormalizado != "P" && tamanhoNormalizado != "M" && tamanhoNormalizado != "G" && tamanhoNormalizado != "XG") {
            setMessage("Valor Invalido");
            setSucess(false);
            return
        }
        new_compartimento.locker_id = Number(id);
        new_compartimento.tamanho = tamanhoNormalizado;

        try {
            const res = await postCompartimento(new_compartimento);

            setSucess(true);
            setMessage(String(res?.data.message ?? ""));
            if (tamanho.current) tamanho.current.value = "";

        } catch (err: any) {
            setSucess(false);
            setMessage(err?.message ?? String(err ?? "Erro ao cadastrar"));
        }
    } 
  return (
    <div className={classes.main}>
      <div className={classes.header}>
        <h1 className={classes.title}>Cadastrar Compartimento</h1>
      </div>
      <div className={classes.body}>
        <form className={classes.form} onSubmit={cadastrar_compartimento}>
          <input className={classes.input} type="text" placeholder="Tamanho do compartimento (P, M, G ou XG)" ref={tamanho}/>
          <button className={classes.submitButton} type="submit">Cadastrar</button>
          {sucess !== null && (
            <p className={classes.message} data-success={sucess}>{message}</p>
          )}
        </form>
        <Link className={classes.backButton} to={'/lockers'}>← Voltar</Link>
      </div>
    </div>
  )
}

export default Compartimento