import "./Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaBox,
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaPhone,
  FaMapPin,
  FaRocket,
  FaUsers,
  FaShieldAlt
} from 'react-icons/fa';
import TestimonialsList from '../../components/Testimonials/TestimonialsList';
import TestimonialForm from '../../components/Testimonials/TestimonialForm';
import { useState } from 'react';

const Home = () => {
  const [testimonialRefresh, setTestimonialRefresh] = useState(0);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTestimonialSuccess = () => {
    setTestimonialRefresh(prev => prev + 1);
  };

  return (
    <div className="home-page d-flex flex-column min-vh-100">
      <header className="site-header navbar navbar-expand-lg sticky-top">
        <div className="container align-items-center">
          <Link className="navbar-brand d-flex align-items-center gap-3" to="/">
            <img src="/images/Veloxim Delivery.png" alt="Veloxim Delivery" className="brand-logo" />
            <div>
              <span className="brand-name">Veloxim</span>
              <div className="brand-tag">Livraison optimisée, confiance assurée</div>
            </div>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <button type="button" className="nav-link btn-link" onClick={() => scrollToSection('about')}>
                  À propos
                </button>
              </li>
              <li className="nav-item">
                <button type="button" className="nav-link btn-link" onClick={() => scrollToSection('services')}>
                  Services
                </button>
              </li>
              <li className="nav-item">
                <button type="button" className="nav-link btn-link" onClick={() => scrollToSection('testimonials')}>
                  Témoignages
                </button>
              </li>
              <li className="nav-item ms-3">
                <Link to="/login" className="btn btn-primary btn-sm btn-signin">
                  Se connecter
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="flex-grow-1">
        <section className="hero-section">
          <div className="container hero-container">
            <div className="hero-grid">
              <div className="hero-left">
                <div className="eyebrow">Solutions logistiques de nouvelle génération</div>
                <h1 className="hero-title">
                  Livraisons plus rapides. Coûts réduits. Clients satisfaits.
                </h1>
                <p className="hero-copy">
                  Veloxim aligne technologie, optimisation d'itinéraires et opérations locales pour une expérience de livraison premium à l'échelle mondiale.
                </p>

                <div className="hero-cta-row">
                  <Link to="/client/new-order" className="btn btn-primary btn-lg cta-primary">
                    Créer une commande — Commencez maintenant
                  </Link>
                </div>

                <ul className="hero-benefits">
                  <li><strong>Optimisation en temps réel</strong> pour réduire les délais et les coûts.</li>
                  <li><strong>SLA mesurables</strong> et rapports de performance pour votre entreprise.</li>
                  <li><strong>Sécurité & conformité</strong> intégrées sur chaque livraison.</li>
                </ul>
              </div>

              <div className="hero-right">
                <div className="hero-visual">
                  <img src="/images/accuil.png" alt="Visuel d'accueil Veloxim" className="hero-image" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="how-it-works" id="how">
          <div className="container">
            <div className="how-header text-center">
              <span className="section-pill">Comment ça marche</span>
              <h2>Trois étapes simples pour lancer une livraison</h2>
              <p className="section-copy">De la commande au point de livraison — tout est optimisé pour la rapidité et la fiabilité.</p>
            </div>

            <div className="how-grid">
              <article className="how-step">
                <div className="step-icon">1</div>
                <h4>Planifiez la collecte</h4>
                <p>Créez une commande en quelques secondes, spécifiez le lieu et les priorités.</p>
              </article>
              <article className="how-step">
                <div className="step-icon">2</div>
                <h4>Optimisation & dispatch</h4>
                <p>Notre algorithme affecte le meilleur coursier et optimise l’itinéraire.</p>
              </article>
              <article className="how-step">
                <div className="step-icon">3</div>
                <h4>Livraison suivie</h4>
                <p>Suivez en temps réel et recevez des notifications jusqu’à la confirmation.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section-split section-about" id="about">
          <div className="container">
            <div className="row align-items-center gy-5">
              <div className="col-lg-5">
                <div className="section-label">À propos</div>
                <h2>Une solution de livraison pensée pour la croissance</h2>
                <p>
                  Veloxim Delivery combine gestion des commandes, suivi automatisé et communication centralisée pour améliorer l'efficacité de votre flotte de livraison.
                </p>
                <ul className="list-unstyled mt-4">
                  <li><strong>Suivi en direct</strong> avec statut clair à chaque étape.</li>
                  <li><strong>Dashboard intelligent</strong> pour clients, livreurs et administrateurs.</li>
                  <li><strong>Support local</strong> et prise en charge des flux Marocains.</li>
                </ul>
              </div>

              <div className="col-lg-6 offset-lg-1">
                <div className="feature-panel p-5">
                  <div className="panel-tag">Pourquoi Veloxim ?</div>
                  <div className="row g-4 mt-3">
                    <div className="col-md-6">
                      <div className="feature-tile">
                        <FaRocket className="feature-icon" />
                        <div>
                          <h5>Livraisons accélérées</h5>
                          <p>Processus fluide du clic à la livraison.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="feature-tile">
                        <FaShieldAlt className="feature-icon" />
                        <div>
                          <h5>Sécurité & conformité</h5>
                          <p>Des commandes sécurisées à chaque transaction.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="feature-tile">
                        <FaUsers className="feature-icon" />
                        <div>
                          <h5>Collaboration fluide</h5>
                          <p>Coordination clients, livreurs et équipes en temps réel.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="feature-tile">
                        <FaMapMarkerAlt className="feature-icon" />
                        <div>
                          <h5>Couverture locale</h5>
                          <p>Présence terrain pour un service fiable au Maroc.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-split bg-light" id="services">
          <div className="container">
            <div className="text-center mb-5">
              <div className="section-label">Services</div>
              <h2>Une plateforme tout-en-un pour votre logistique</h2>
              <p className="section-text mx-auto mw-700">
                Centralisez vos demandes, suivez chaque expédition et automatisez vos opérations de livraison avec une interface intuitive.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <article className="card feature-card p-5 h-100 text-center">
                  <div className="icon-circle"><FaMapMarkerAlt size={28} /></div>
                  <h3>Ramassage personnalisé</h3>
                  <p>Planifiez des collectes adaptées à votre activité et suivez l’itinéraire en direct.</p>
                </article>
              </div>
              <div className="col-md-4">
                <article className="card feature-card p-5 h-100 text-center">
                  <div className="icon-circle"><FaClock size={28} /></div>
                  <h3>Suivi instantané</h3>
                  <p>Recevez des mises à jour automatiques pour chaque étape de la livraison.</p>
                </article>
              </div>
              <div className="col-md-4">
                <article className="card feature-card p-5 h-100 text-center">
                  <div className="icon-circle"><FaCheckCircle size={28} /></div>
                  <h3>Confirmation intelligente</h3>
                  <p>Alertes automatiques et rapports complets pour des retours sans erreur.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section-testimonials bg-light" id="testimonials">
          <div className="container">
            <div className="text-center mb-5">
              <div className="section-label">Témoignages</div>
              <h2>Ils nous font confiance</h2>
              <p className="section-text mx-auto mw-700">
                Découvrez ce que nos clients pensent de Veloxim Delivery
              </p>
            </div>

            {/* Testimonials Display */}
            <div className="mb-5">
              <TestimonialsList refreshTrigger={testimonialRefresh} />
            </div>

            {/* Testimonial Form */}
            <TestimonialForm onSuccess={handleTestimonialSuccess} />
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-panel p-5 text-center">
              <h2>Prêt à passer à la vitesse supérieure ?</h2>
              <p>Rejoignez Veloxim Delivery et démarrez une nouvelle ère de livraison intelligente.</p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-3">
                <Link to="/client/new-order" className="btn btn-primary btn-lg">
                  Créer ma première commande
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-custom mt-auto">
        <div className="container py-5">
          <div className="row gy-4">
            <div className="col-md-4">
              <h3>Veloxim Delivery</h3>
              <p>Plateforme moderne de gestion des livraisons au Maroc, dédiée à la rapidité, à la transparence et à l’excellence client.</p>
            </div>
            <div className="col-md-4">
              <h4>Liens rapides</h4>
              <div className="footer-links">
                <button type="button" className="link-button" onClick={() => scrollToSection('about')}>À propos</button>
                <button type="button" className="link-button" onClick={() => scrollToSection('services')}>Services</button>
                <button type="button" className="link-button" onClick={() => scrollToSection('statistics')}>Chiffres clés</button>
                <button type="button" className="link-button" onClick={() => scrollToSection('testimonials')}>Témoignages</button>
              </div>
            </div>
            <div className="col-md-4">
              <h4>Contact</h4>
              <p className="footer-contact"><FaEnvelope /> contact@veloxim.ma</p>
              <p className="footer-contact"><FaPhone /> 06 05 04 03 02</p>
              <p className="footer-contact"><FaMapPin /> Marrakech, Maroc</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom text-center py-3">
          <p className="mb-0">© 2026 Veloxim Delivery. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
