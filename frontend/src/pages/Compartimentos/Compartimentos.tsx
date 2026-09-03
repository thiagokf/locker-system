import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCompartimentos } from '../../lib/actions';
import CompartimentoCard from '../../components/compartimentoCard/compartimentoCard';
import classes from './Compartimentos.module.css';

import type { CompartimentoProps } from '../../types/compartimento';

const Compartimentos = () => {
    const { id, localizacao } = useParams<{ id: string, localizacao: string }>();
    const [comps, setComps] = useState<CompartimentoProps[]>([]);

    useEffect(() => {
        const loadComps = async () => {
            const dados = await getCompartimentos(String(id));
            setComps(dados)
        }
        loadComps()
    }, [id])

    const handleDeleteComp = (id: number) => {
        setComps(comps.filter(comps => comps.id !== id));
    }

    return (
        <div className={classes.main}>
            <div className={classes.header}>
                <h1 className={classes.title}>Compartimentos compser {localizacao}</h1>
                <Link className={classes.backButton} to='/lockers'>← Voltar</Link>
            </div>
            <div className={classes.body}>
                {comps?.length > 0 ? (
                    <div className={classes.grid}>
                        {comps.map((comp) => (
                            <CompartimentoCard key={comp.id} {...comp} onDelete={handleDeleteComp}/>
                        ))}
                    </div>
                ) : (
                    <p className={classes.empty}>Sem compartimentos alocados</p>
                )}
            </div>
        </div>
    )
}

export default Compartimentos