const pool = require('../config/database');

class StatutHistorique {
  static async add({ commande_id, ancien_statut, nouveau_statut, changed_by }) {
    const [result] = await pool.query(
      `INSERT INTO statut_historique (commande_id,ancien_statut,nouveau_statut,changed_by) 
       VALUES (?,?,?,?)`,
      [commande_id,ancien_statut,nouveau_statut,changed_by]
    );
    return result.insertId;
  }

  static async findByCommande(commande_id) {
    const [rows] = await pool.query(
      'SELECT * FROM statut_historique WHERE commande_id=? ORDER BY changed_at DESC',
      [commande_id]
    );
    return rows;
  }
}

module.exports = StatutHistorique;
