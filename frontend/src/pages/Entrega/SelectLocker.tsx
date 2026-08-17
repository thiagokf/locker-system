import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getLockers } from '../../lib/actions';
import classes from './SelectLocker.module.css';

import type { LockerProps } from '../../types/locker';

const SelectLocker = () => {
  const [lockers, setLockers] = useState<LockerProps[]>([]);
  const navigate = useNavigate();

  const handleSelectLocker = (lockerId: number) => {
    const valor = window.prompt('Qual o tamanho da entrega? (P,M,G ou XG)');

    if (!valor) {
      window.alert('Valor Invalido');
      return;
    }

    const tamanhoSelecionado = valor.toUpperCase();

    if (
      tamanhoSelecionado !== 'P' &&
      tamanhoSelecionado !== 'M' &&
      tamanhoSelecionado !== 'G' &&
      tamanhoSelecionado !== 'XG'
    ) {
      window.alert('Valor Invalido');
      return;
    }

    navigate(`/entrega/selectCompartimento/${lockerId}/${tamanhoSelecionado}/LIVRE`);
  };

  useEffect(() => {
    const loadLockers = async () => {
      const dados = await getLockers();
      setLockers(dados);
    };

    loadLockers();
  }, []);

  return (
    <main className={classes.main}>
      <div className={classes.header}>
        <Link to="/" className={classes.backButton}>
          Voltar
        </Link>
        <h1 className={classes.title}>Selecione um locker</h1>
      </div>

      <div className={classes.body}>
        {lockers?.length > 0 ? (
          <div className={classes.grid}>
            {lockers.map((lock) => (
              <button
                key={lock.id}
                type="button"
                className={classes.cardButton}
                onClick={() => handleSelectLocker(lock.id)}
              >
                <span className={classes.label}>Locker</span>
                <p className={classes.lockerId}>#{lock.id}</p>
                <p className={classes.location}>{lock.localizacao}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className={classes.empty}>Nenhum locker cadastrado ainda.</p>
        )}
      </div>
    </main>
  );
};

export default SelectLocker