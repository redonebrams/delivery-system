import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <img src="./images/Veloxim Delivery.png" alt="Logo" className="logo-image" />
        </div>
        <div className="nav-links">
          <a href="#about">À propos de nous</a>
          <a href="#services">Nos services</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="login-btn">
            Se connecter
          </Link>
        </div>
      </nav>

      {/* HERO / DESCRIPTION */}
      <main className="content">
        <section className="hero">
          <div className="hero-content">
            <h1>Bienvenue sur DeliveryApp</h1>
            <p>
              <strong>Veloxim Delivery</strong> est une plateforme web moderne de gestion de livraison multi-services conçue pour digitaliser et optimiser l'ensemble du processus logistique, de la création des commandes jusqu'à leur livraison finale. Veloxim Delivery vise à améliorer l'efficacité, la traçabilité et l'expérience utilisateur dans le secteur de la livraison.
            </p>
          </div>
          <img src="./images/accuil.png" alt="Illustration de livraison" className="hero-image" />
        </section>
        <div className="hero-action">
          <Link to="/client/new-order" className="btn-primary">
            Créer une commande
          </Link>
        </div>

        <section className="section" id="about">
          <h2>À propos de nous</h2>
          <p>
            Face à la croissance rapide du secteur de la livraison au Maroc, de nombreuses entreprises continuent d'utiliser des méthodes traditionnelles inefficaces, comme les appels téléphoniques ou les fichiers Excel. Notre solution a été conçue pour répondre à ces défis en digitalisant entièrement le processus de gestion des livraisons. Grâce à notre plateforme, toutes les informations sont centralisées en un seul endroit, permettant une meilleure communication entre clients, livreurs et administrateurs. Nous facilitons le suivi des commandes, améliorons l'allocation des ressources et offrons une visibilité complète sur chaque étape de la livraison.
          </p>
        </section>

        <section className="section" id="services">
          <h2>Nos services</h2>
          <div className="grid">
            <div className="card">
              <strong>Ramassage intelligent</strong><br/>
              Nous récupérons vos colis directement à votre emplacement afin de vous faire gagner du temps et simplifier votre logistique.
            </div>
            <div className="card">
              <strong>Suivi en temps réel</strong><br/>
              Visualisez l'état de vos livraisons à chaque étape avec un système de tracking clair et efficace.
            </div>
            <div className="card">
              <strong>Confirmation & gestion</strong><br/>
              Confirmation des commandes et gestion des retours pour une expérience client optimale.
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          {/* LOGO + DESCRIPTION */}
          <div className="footer-section">
            <h3>Veloxim Delivery</h3>
            <p>
              Plateforme moderne de gestion des livraisons au Maroc. Rapide, fiable et sécurisée pour tous vos besoins logistiques.
            </p>
          </div>

          {/* LIENS */}
          <div className="footer-section">
            <h4>Navigation</h4>
            <a href="#about">À propos</a>
            <a href="#services">Services</a>
           
          </div>

          {/* CONTACT */}
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email : contact@veloxim.ma</p>
            <p>Tél : 06 05 04 03 02</p>
            <p>Marrakech, Maroc</p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <p>© 2026 Veloxim Delivery - Tous droits réservés</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;

