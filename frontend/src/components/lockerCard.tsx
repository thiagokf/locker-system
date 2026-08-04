import React from 'react';
import type { LockerProps } from '../types/locker';

const LockerCard = ({id, localizacao}: LockerProps) => {
  return (
    <div>
        <h1>{id}</h1>
        <h2>{localizacao}</h2>
    </div>
  )
}

export default LockerCard