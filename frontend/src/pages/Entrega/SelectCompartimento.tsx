import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getCompStatus } from "../../lib/actions";
import { postEntrega } from "../../lib/actions";
import type { CompartimentoProps } from "../../types/compartimento";
import type { EntregaProps } from "../../types/entrega";
import CompartimentoCard from "../../components/compartimentoCard/compartimentoCard";
import classes from './SelectCompartimento.module.css';

const SelectCompartimento = () => {
  const [comps, setComps] = useState<CompartimentoProps[]>([]);
  const { id, status, tamanho } = useParams<{ id: string; status: string; tamanho: string }>();

  const pegaComps = async () => {
    if (!id || !status || !tamanho) {
      return;
    }

    const dados = await getCompStatus(id, status, tamanho);
    setComps(dados);
    console.log("dados")
    console.log(dados)
  };
  
  useEffect(() => {
    pegaComps();
  }, [id, status]);
  console.log("comps")
  console.log(comps)

  const fazerEntrega = async (comp?: CompartimentoProps) => {
    let new_entrega = {} as EntregaProps;

    if (!comp || !tamanho) {
      console.log("valores faltando");
      return "error";
    }

    new_entrega.locker_id = comp.locker_id;
    new_entrega.compartimento_id = comp.id;
    new_entrega.tamanho_produto = tamanho;

    const res = await postEntrega(new_entrega);

    if (!res) {
      console.log("Erro ao fazer post da entrega");
      return "error";
    }
    console.log("deu boa");
    pegaComps();
    return "Deu boa";
  };

  return (
    <main className={classes.main}>
      <div className={classes.header}>
        <Link to="/entrega/selectLocker" className={classes.backButton}>
          Voltar
        </Link>
        <h1 className={classes.title}>Selecione um compartimento</h1>
      </div>

      <div className={classes.body}>
        {comps?.length > 0 ? (
          <div className={classes.grid}>
            {comps.map((comp) => (
              <button
                key={comp.id}
                type="button"
                className={classes.cardButton}
                onClick={() => fazerEntrega(comp)}
              >
                <CompartimentoCard {...comp} />
              </button>
            ))}
          </div>
        ) : (
          <p className={classes.empty}>Nenhum compartimento disponível neste locker.</p>
        )}
      </div>
    </main>
  );
};

export default SelectCompartimento