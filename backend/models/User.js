const pool = require('../config/database');

class User {
  static async create({ email, password_hash, role, nom, prenom, telephone, photo }) {
    const [result] = await pool.query(
      `INSERT INTO users (email,password_hash,role,nom,prenom,telephone,photo) 
       VALUES (?,?,?,?,?,?,?)`,
      [email,password_hash,role,nom,prenom,telephone,photo]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?',[email]);
    return rows[0];
  }

  // 🔥 Nouvelle méthode: Trouver utilisateur actif par email
  static async findActiveByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email=? AND is_active=1',[email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?',[id]);
    return rows[0];
  }

  static async findByRole(role) {
    const [rows] = await pool.query('SELECT * FROM users WHERE role=?', [role]);
    return rows;
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT id, nom, prenom, email, telephone, role FROM users');
    return rows;
  }

  static async update(id, data) {
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (['email', 'nom', 'prenom', 'telephone', 'photo', 'role'].includes(key)) {
        updates.push(`${key}=?`);
        values.push(value);
      }
    }
    if (updates.length === 0) return;
    values.push(id);
    await pool.query(`UPDATE users SET ${updates.join(',')} WHERE id=?`, values);
  }

  static async remove(id) {
    await pool.query('DELETE FROM users WHERE id=?', [id]);
  }
}

module.exports = User;
