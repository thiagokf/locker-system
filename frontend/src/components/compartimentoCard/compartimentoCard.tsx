import type { CompartimentoProps } from '../../types/compartimento'
import { deleteComp } from '../../lib/actions';
import classes from './compartimentoCard.module.css';

interface CompCardProps extends CompartimentoProps {
  onDelete?: (id: number) => void;
}

const CompartimentoCard = ({ id, locker_id, tamanho, status, onDelete }: CompCardProps) => {

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir compartimento? ")) {
      try {
        const res = await deleteComp(id);
        
        if (res?.status === 200){
          onDelete?.(id)
        }
        alert(res?.data);
      }
      catch (error){
        console.error("Erro ao excluir compartimento", error)
        alert("erro ao excluir compartimento")
      }
    }
  }
  return (
    <div className={classes.card}>
      <div className={classes.content}>
        <div className={classes.info}>
          <h3 className={classes.id}>Compartimento #{id}</h3>
          <p className={classes.localizacao}>Locker: {locker_id}</p>
          <p className={classes.tamanho}>Tamanho: {tamanho}</p>
          <p className={classes.status}>Status: {status}</p>
        </div>
        <button className={`${classes.button} ${classes.delete}`} onClick={handleDelete}>Deletar</button>
      </div>
    </div>
  )
}

export default CompartimentoCard