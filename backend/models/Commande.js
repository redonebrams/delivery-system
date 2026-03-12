const pool = require('../config/database');

class Commande {
  static async create(data) {
    const [result] = await pool.query(
      `INSERT INTO commandes 
       (client_id,livreur_id,type_commande,nom_retrait,telephone_retrait,adresse_retrait,
        nom_livraison,telephone_livraison,adresse_livraison,distance_km,instructions_speciales,
        prix_livraison,mode_paiement,statut) 
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.client_id,data.livreur_id,data.type_commande,
        data.nom_retrait,data.telephone_retrait,data.adresse_retrait,
        data.nom_livraison,data.telephone_livraison,data.adresse_livraison,
        data.distance_km,data.instructions_speciales,
        data.prix_livraison,data.mode_paiement,data.statut
      ]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM commandes WHERE id=?',[id]);
    return rows[0];
  }

  static async updateStatut(id, statut) {
    await pool.query('UPDATE commandes SET statut=? WHERE id=?',[statut,id]);
  }

  static async assignLivreur(id, livreur_id) {
    await pool.query('UPDATE commandes SET livreur_id=?, assigned_at=NOW() WHERE id=?',[livreur_id,id]);
  }
}

module.exports = Commande;
