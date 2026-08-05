import React from 'react';
import type { LockerProps } from '../types/locker';
import classes from './lockerCard.module.css';

const LockerCard = ({id, localizacao}: LockerProps) => {
  return (
    <div className={classes.card}>
      <div className={classes.content}>
        <div className={classes.info}>
          <h3 className={classes.id}>ID: {id}</h3>
          <p className={classes.localizacao}>{localizacao}</p>
        </div>
      </div>
      <div className={classes.actions}>
        <button className={`${classes.button} ${classes.view}`} title="Ver compartimentos">Ver compartimentos</button> 
        <button className={`${classes.button} ${classes.add}`} title="Adicionar item">Adicionar compartimento</button>
        <button className={`${classes.button} ${classes.delete}`} title="Deletar locker">Deletar locker</button>
      </div>
    </div>
  )
}

export default LockerCard