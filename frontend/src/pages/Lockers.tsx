import React from 'react'
import { useState, useEffect } from 'react';
import { getLockers } from '../lib/actions';
import type { LockerProps } from '../types/locker';
import { Link } from "react-router-dom";

import LockerCard from '../components/lockerCard'

const Lockers = () => {
    const [lockers, setLockers] = useState<LockerProps[]>([]);

    useEffect(() => {
        const loadLockers = async () => {
            const dados = await getLockers();
            setLockers(dados);
        }

        loadLockers();
        console.log(lockers)
    },[])
  return (
    <>
        <div>Lockers</div>
        <div>
            {lockers.map((lock) => (
                <LockerCard key={lock.id} {...lock}/>
            ))}
        </div>
        <Link to="/">Voltar</Link>
    </>

  )
}

export default Lockers