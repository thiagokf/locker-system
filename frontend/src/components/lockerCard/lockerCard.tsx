import { Link } from 'react-router-dom';
import type { LockerProps } from '../../types/locker';
import classes from './lockerCard.module.css';
import { deleteLocker } from '../../lib/actions';

interface LockerCardProps extends LockerProps {
  onDelete?: (id: number) => void;
}

const LockerCard = ({id, localizacao, onDelete}: LockerCardProps) => {
  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja deletar o locker "${localizacao}"?`)) {
      try {
        const response = await deleteLocker(id);
        if (response?.status === 200 || response?.status === 204) {
          onDelete?.(id);
        } else if (response?.status == 400) {
          alert('Locker possui compartimento ocupado');
        } else {
          console.log(response.status)
          console.log(response.data)
          alert('Erro do servidor ao deletar locker');
        }
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar lockeraaa');
      }
    }
  }

  return (
    <div className={classes.card}>
      <div className={classes.content}>
        <div className={classes.info}>
          <h3 className={classes.id}>ID: {id}</h3>
          <p className={classes.localizacao}>{localizacao}</p>
        </div>
      </div>
      <div className={classes.actions}>
        <Link className={`${classes.button} ${classes.view}`} to={`/${id}/${localizacao}/compartimentos`} title="Ver compartimentos">Ver compartimentos</Link> 
        <Link className={`${classes.button} ${classes.add}`} to={`/${id}/compartimento`} title="Adicionar item">Adicionar compartimento</Link>
        <button className={`${classes.button} ${classes.delete}`} onClick={handleDelete} title="Deletar locker">Deletar locker</button>
      </div>
    </div>
  )
}

export default LockerCard