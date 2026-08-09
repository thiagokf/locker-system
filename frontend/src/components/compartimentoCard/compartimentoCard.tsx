import React from 'react'
import type { CompartimentoProps } from '../../types/compartimento'
import classes from './compartimentoCard.module.css';

const CompartimentoCard = ({ id, locker_id, tamanho, status }: CompartimentoProps) => {
  return (
    <div className={classes.card}>
      <div className={classes.content}>
        <div className={classes.info}>
          <h3 className={classes.id}>Compartimento #{id}</h3>
          <p className={classes.localizacao}>Locker: {locker_id}</p>
          <p className={classes.tamanho}>Tamanho: {tamanho}</p>
          <p className={classes.status}>Status: {status}</p>
        </div>
      </div>
    </div>
  )
}

export default CompartimentoCard