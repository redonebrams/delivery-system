const pool = require('../config/database');

class Livreur {
  static async create({ user_id, type_vehicule }) {
    const [result] = await pool.query(
      `INSERT INTO livreurs (user_id,type_vehicule) VALUES (?,?)`,
      [user_id,type_vehicule]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM livreurs WHERE id=?',[id]);
    return rows[0];
  }

  static async updateStatut(id, statut) {
    await pool.query('UPDATE livreurs SET statut=? WHERE id=?',[statut,id]);
  }
}

module.exports = Livreur;
