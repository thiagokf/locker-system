import React from 'react'
import { useState, useEffect } from 'react';
import { getLockers } from '../../lib/actions';
import type { LockerProps } from '../../types/locker';
import { Link } from "react-router-dom";

import classes from './Lockers.module.css'
import LockerCard from '../../components/lockerCard'

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
    <div className={classes.main}>
      <div className={classes.header}>
        <h1 className={classes.title}>Lockers Disponíveis</h1>
      </div>
      <div className={classes.body}>
        <div className={classes.grid}>
          {lockers.length > 0 ? (
            lockers.map((lock) => (
              <LockerCard key={lock.id} {...lock}/>
            ))
          ) : (
            <p className={classes.empty}>Nenhum locker cadastrado</p>
          )}
        </div>
        <Link className={classes.backButton} to="/">← Voltar</Link>
      </div>
    </div>
    </>
  )
}

export default Lockers