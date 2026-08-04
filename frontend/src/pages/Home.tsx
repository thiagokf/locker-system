import React from 'react'
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <>
        <h1 className='title'>Locker System</h1>
        <div>
        <Link to="/locker">Cadastrar locker</Link>
        </div>
    </>
  )
}

export default Home