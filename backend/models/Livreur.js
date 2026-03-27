const pool = require('../config/database');

class Livreur {
  static async create({ user_id, type_vehicule }) {
    const [result] = await pool.query(
      `INSERT INTO livreurs (user_id,type_vehicule) VALUES (?,?)`,
      [user_id,type_vehicule]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.query(`
      SELECT l.*, u.nom, u.prenom, u.email, u.telephone 
      FROM livreurs l 
      JOIN users u ON l.user_id = u.id
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT l.*, u.nom, u.prenom, u.email, u.telephone 
      FROM livreurs l 
      JOIN users u ON l.user_id = u.id 
      WHERE l.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByUserId(user_id) {
    const [rows] = await pool.query(`
      SELECT l.*, u.nom, u.prenom, u.email, u.telephone 
      FROM livreurs l 
      JOIN users u ON l.user_id = u.id 
      WHERE l.user_id = ?
    `, [user_id]);
    return rows[0];
  }

  static async updateStatut(id, statut) {
    await pool.query('UPDATE livreurs SET statut=? WHERE id=?',[statut,id]);
  }

  static async update(id, data) {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (['type_vehicule', 'statut', 'total_livraisons'].includes(key)) {
        updates.push(`${key}=?`);
        values.push(value);
      }
    }
    if (updates.length === 0) return;
    values.push(id);
    await pool.query(`UPDATE livreurs SET ${updates.join(',')} WHERE id=?`, values);
  }

  static async remove(id) {
    await pool.query('DELETE FROM livreurs WHERE id=?', [id]);
  }
}

module.exports = Livreur;
