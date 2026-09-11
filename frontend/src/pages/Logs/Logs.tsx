import { useState, useEffect } from 'react';
import { getLogs } from '../../lib/actions';
import type { LogsProps } from '../../types/logs';
import styles from './Logs.module.css';
import { Link } from 'react-router-dom';

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const isToday = (date: Date) => {
  const t = today();
  return date.getTime() === t.getTime();
};

const formatLabel = (date: Date) => {
  if (isToday(date)) return 'Hoje';
  const yesterday = today();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getTime() === yesterday.getTime()) return 'Ontem';
  return date.toLocaleDateString('pt-BR');
};

const Logs = () => {
  const [logs, setLogs] = useState<LogsProps[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(today());

  useEffect(() => {
    const pegaLogs = async () => {
      const dados = await getLogs(selectedDay);
      setLogs(dados ?? []);
    };
    pegaLogs();
  }, [selectedDay]);

  const goBack = () => {
    const prev = new Date(selectedDay);
    prev.setDate(prev.getDate() - 1);
    setSelectedDay(prev);
  };

  const goForward = () => {
    const next = new Date(selectedDay);
    next.setDate(next.getDate() + 1);
    if (next <= today()) setSelectedDay(next);
  };

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Logs</h1>
      </header>
      <div className={styles.body}>

        <div className={styles.dateNav}>
          <button className={styles.navBtn} onClick={goBack}>&#8592;</button>
          <span className={styles.dateLabel}>{formatLabel(selectedDay)}</span>
          {!isToday(selectedDay) && (
            <button className={styles.navBtn} onClick={goForward}>&#8594;</button>
          )}
        </div>

        {logs.length > 0 ? (
          <ul className={styles.list}>
            {logs.map((log) => (
              <li key={log.id} className={styles.item}>
                <div className={styles.cardTop}>
                  <span className={styles.logId}>#{log.id}</span>
                  <span className={`${styles.acaoBadge} ${log.acao === 'Entrega' ? styles.acaoEntrega : styles.acaoRetirada}`}>
                    {log.acao}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.field}>
                    <span className={styles.label}>Entrega</span>
                    <span className={styles.value}>#{log.entrega_id}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Locker</span>
                    <span className={styles.value}>{log.locker_loc}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.label}>Compartimento</span>
                    <span className={styles.value}>#{log.compartimento_id}</span>
                  </div>
                </div>
                <div className={styles.time}>
                  {log.data_registro ? new Date(log.data_registro).toLocaleString('pt-BR') : '—'}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>Nenhum log registrado neste dia</div>
        )}
        <Link to={"/"} className={styles.backButton}>Voltar</Link>
      </div>
    </div>
  );
};

export default Logs;
