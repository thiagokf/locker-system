import { useState, useEffect } from 'react';
import { getLogs } from '../../lib/actions';
import type { LogsProps } from '../../types/logs';
import styles from './Logs.module.css';
import { Link } from 'react-router-dom';


const Logs = () => {
    const [ logs, setLogs ] = useState<LogsProps[]>([]);

    useEffect(()=> {
        const pegaLogs = async() => {
            const dados = await getLogs();
            setLogs(dados ?? []);
        }
        pegaLogs();
    }, []);

console.log(logs);
(logs.forEach((log) => (
  console.log("id_entrega:" + log.entrega_id)
)))
  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Logs</h1>
      </header>
      <div className={styles.body}>

        {logs.length > 0 ? (
          <ul className={styles.list}>
            {logs.map((log) => (
              <li key={log.id} className={styles.item}>
                <div className={styles.row}>
                  <span className={styles.label}>ID:</span>
                  <span className={styles.value}>{log.id}</span>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Entrega:</span>
                  <span className={styles.value}>{log.entrega_id}</span>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>ação:</span>
                  <span className={styles.value}>{log.acao}</span>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Compartimento:</span>
                  <span className={styles.compartment}>{log.compartimento_id}</span>
                </div>
                <div className={styles.time}>{log.data_registro ? new Date(log.data_registro).toLocaleString() : ''}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>Nenhum log registrado ainda</div>
        )}
        <Link to={"/"} className={styles.backButton}>Voltar</Link>
      </div>
    </div>
  )
}

export default Logs