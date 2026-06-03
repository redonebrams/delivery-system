import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img 
            src="/images/Veloxim Delivery.png" 
            alt="Veloxim Delivery" 
            className="img-fluid" 
            style={{ height: '60px' }}
          />
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#appNavbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="appNavbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">À propos de nous</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#services">Nos services</a>
            </li>
          </ul>
          <div className="ms-3">
            <Link to="/login" className="btn btn-outline-primary me-2">Se connecter</Link>
            <Link to="/register" className="btn btn-primary">S'inscrire</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
