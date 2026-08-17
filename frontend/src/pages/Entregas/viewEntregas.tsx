import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { EntregaProps } from "../../types/entrega";
import { getEntregas } from "../../lib/actions";
import classes from './viewEntregas.module.css';

const viewEntregas = () => {
  const [entregas, setEntregas] = useState<EntregaProps[]>([]);

  useEffect(() => {
    const pegaEntregas = async () => {
      const dados = await getEntregas();
      setEntregas(dados ?? []);
    };

    pegaEntregas();
  }, []);

  return (
    <main className={classes.main}>
      <div className={classes.header}>
        <Link to="/" className={classes.backButton}>
          Voltar
        </Link>
        <h1 className={classes.title}>Entregas</h1>
      </div>

      <div className={classes.body}>
        {entregas?.length > 0 ? (
          <div className={classes.grid}>
            {entregas.map((entrega) => (
              <article key={entrega.id} className={classes.card}>
                <div className={classes.idWrap}>
                  <h2 className={classes.id}>Entrega #{entrega.id}</h2>
                  <span className={classes.badge}>{entrega.status}</span>
                </div>

                <div className={classes.info}>
                  <p><span className={classes.label}>Locker:</span> {entrega.locker_id}</p>
                  <p><span className={classes.label}>Compartimento:</span> {entrega.compartimento_id}</p>
                  <p><span className={classes.label}>Tamanho:</span> {entrega.tamanho_produto}</p>
                  <p><span className={classes.label}>Código:</span> {entrega.codigo_retirada}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className={classes.empty}>Nenhuma entrega registrada.</p>
        )}
      </div>
    </main>
  );
};

export default viewEntregas