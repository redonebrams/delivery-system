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

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?',[id]);
    return rows[0];
  }
}

module.exports = User;
