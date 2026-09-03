import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { EntregaProps } from "../../types/entrega";
import { getEntregas, retirarEntrega } from "../../lib/actions";

import classes from './viewEntregas.module.css';

const viewEntregas = () => {
    const [entregas, setEntregas] = useState<EntregaProps[]>([]);
    
    const pegaEntregas = async () => {
      const dados = await getEntregas();
      setEntregas(dados ?? []);
    };

  const handleRetirar = async (entrega: EntregaProps) => {
    const codigo = window.prompt("Digite o código de retirada da entrega")

    if (!codigo || codigo != entrega.codigo_retirada){
        window.alert("Código invalido");
        return;
    }

    const res = await retirarEntrega(entrega.codigo_retirada);

    if (!res) {
        window.alert("erro ao retirar entrega");
        return;
    }
    window.alert("Entrega retirada com sucesso");
    pegaEntregas();
    return;
  }

  useEffect(() => {
    
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
                  <p><span className={classes.label}>Tamanho:</span> {entrega.tamanho_pedido}</p>
                  <p><span className={classes.label}>Senha:</span> {entrega.codigo_retirada}</p>
                </div>
                <button onClick={() => handleRetirar(entrega)}> Retirar Pedido </button>
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