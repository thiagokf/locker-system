import React from 'react'
import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { postCompartimento } from '../../lib/actions';
import type { CompartimentoProps } from '../../types/compartimento';

const Compartimento = () => {
    const [sucess, setSucess] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string>();
    const { id } = useParams<{ id: string }>()
    const new_compartimento = {} as CompartimentoProps;

    const tamanho = useRef<HTMLInputElement>(null);

    console.log(id)
    async function cadastrar_compartimento(e: React.FormEvent) {
        e.preventDefault();
        setSucess(false)

        if (!tamanho.current || !tamanho.current.value) {
            setMessage("Id ou localização invalida")
            return
        }
        new_compartimento.locker_id = Number(id);
        new_compartimento.tamanho = tamanho.current.value;

        try {
            const res = await postCompartimento(new_compartimento);

            setSucess(true);
            setMessage(String(res?.data ?? ""));
            if (tamanho.current) tamanho.current.value = "";

        } catch (err: any) {
            setSucess(false);
            setMessage(err?.message ?? String(err ?? "Erro ao cadastrar"));
        }
    } 
  return (
    <>
    <div>Compartimento</div>
    <form onSubmit={cadastrar_compartimento}>
        <input type="text" placeholder="Tamanho do compartimento" ref={tamanho}/>
        <button type="submit">Cadastrar</button>
    </form>
    <Link to={'/lockers'}>Voltar</Link>
    </>
  )
}

export default Compartimento