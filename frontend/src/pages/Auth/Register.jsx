import React, { useState } from "react";
import { register } from "../../services/authService";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Inscription réussie !");
    } catch (error) {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Inscription Client</h2>

      <div>
        <label>Nom complet</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Téléphone</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Mot de passe</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default Register;
