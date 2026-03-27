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

  static async getAll() {
    const [rows] = await pool.query(`
      SELECT c.*, u.nom as client_nom, u.prenom as client_prenom, u.email as client_email,
             l.id as livreur_id, ul.nom as livreur_nom, ul.prenom as livreur_prenom
      FROM commandes c
      LEFT JOIN users u ON c.client_id = u.id
      LEFT JOIN livreurs l ON c.livreur_id = l.user_id
      LEFT JOIN users ul ON l.user_id = ul.id
      ORDER BY c.created_at DESC
    `);
    return rows;
  }

  static async findByClient(client_id) {
    const [rows] = await pool.query(`
      SELECT * FROM commandes WHERE client_id=? ORDER BY created_at DESC
    `, [client_id]);
    return rows;
  }

  static async findByLivreur(livreur_id) {
    const [rows] = await pool.query(`
      SELECT c.*, u.nom as client_nom, u.prenom as client_prenom, u.email as client_email
      FROM commandes c
      LEFT JOIN users u ON c.client_id = u.id
      WHERE c.livreur_id = ? ORDER BY c.created_at DESC
    `, [livreur_id]);
    return rows;
  }

  static async update(id, data) {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      updates.push(`${key}=?`);
      values.push(value);
    }
    values.push(id);
    await pool.query(`UPDATE commandes SET ${updates.join(',')} WHERE id=?`, values);
  }

  static async remove(id) {
    await pool.query('DELETE FROM commandes WHERE id=?', [id]);
  }
}

module.exports = Commande;
