import React from 'react';
import  "../styles/Header.css";
import '../styles/normalize.css';
function Header() {
  return (
    <header>
      <div className='header-content'>
        <a href="/home">
          <h1 className='logo'>FastFolio</h1>
        </a>
        <nav>
          <a className='login' href='#'>
            <i className="fa-solid fa-user"></i>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
