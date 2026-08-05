import React from 'react'
import { Link } from 'react-router-dom';
import classes from './Home.module.css'

const Home = () => {
  return (
    <>
    <div className={classes.main}>
      <div className={classes.header}>
        <h1 className={classes.title}>Locker System</h1>
      </div>
      <div className={classes.body}>
        <Link className={classes.option} to="/locker">Cadastrar locker</Link>
        <Link className={classes.option} to="/lockers">Visualizar Lockers</Link>
      </div>
    </div>
    </>
  )
}

export default Home