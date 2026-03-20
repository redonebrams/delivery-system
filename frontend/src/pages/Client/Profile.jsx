import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Pas connecté</p>;

  return (
    <div>
      <h2>Profil Client</h2>
      <p>Nom : {user.name}</p>
      <p>Email : {user.email}</p>
      <p>Téléphone : {user.phone}</p>
      <p>Date d'inscription : {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default Profile;
