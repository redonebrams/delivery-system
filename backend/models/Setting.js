const pool = require('../config/database');

class Setting {
  static async set(cle,valeur,description) {
    await pool.query(
      `INSERT INTO settings (cle,valeur,description) VALUES (?,?,?) 
       ON DUPLICATE KEY UPDATE valeur=VALUES(valeur), description=VALUES(description)`,
      [cle,valeur,description]
    );
  }

  static async get(cle) {
    const [rows] = await pool.query('SELECT * FROM settings WHERE cle=?',[cle]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM settings');
    return rows;
  }
}

module.exports = Setting;
