const pool = require('../config/database');

class Testimonial {
  // Get all approved testimonials with user info
  static async getApproved() {
    const [rows] = await pool.query(
      `SELECT t.id, t.rating, t.comment, t.created_at, u.nom, u.prenom, u.photo
       FROM testimonials t
       JOIN users u ON t.user_id = u.id
       WHERE t.status = 'approved'
       ORDER BY t.created_at DESC`
    );
    return rows;
  }

  // Get all testimonials (admin)
  static async getAll() {
    const [rows] = await pool.query(
      `SELECT t.id, t.rating, t.comment, t.status, t.created_at, t.updated_at, u.nom, u.prenom, u.email, u.photo
       FROM testimonials t
       JOIN users u ON t.user_id = u.id
       ORDER BY t.created_at DESC`
    );
    return rows;
  }

  // Get testimonial by ID
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT t.id, t.user_id, t.rating, t.comment, t.status, t.created_at, t.updated_at, u.nom, u.prenom, u.email, u.photo
       FROM testimonials t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  // Get testimonials by user
  static async getByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT id, rating, comment, status, created_at, updated_at
       FROM testimonials
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }

  // Create new testimonial
  static async create(userId, rating, comment) {
    const [result] = await pool.query(
      `INSERT INTO testimonials (user_id, rating, comment, status)
       VALUES (?, ?, ?, 'pending')`,
      [userId, rating, comment]
    );
    return result.insertId;
  }

  // Update testimonial
  static async update(id, { rating, comment, status }) {
    await pool.query(
      `UPDATE testimonials SET rating = ?, comment = ?, status = ? WHERE id = ?`,
      [rating, comment, status, id]
    );
  }

  // Approve testimonial
  static async approve(id) {
    await pool.query(
      `UPDATE testimonials SET status = 'approved' WHERE id = ?`,
      [id]
    );
  }

  // Reject testimonial
  static async reject(id) {
    await pool.query(
      `UPDATE testimonials SET status = 'rejected' WHERE id = ?`,
      [id]
    );
  }

  // Delete testimonial
  static async delete(id) {
    await pool.query(
      `DELETE FROM testimonials WHERE id = ?`,
      [id]
    );
  }

  // Get average rating
  static async getAverageRating() {
    const [rows] = await pool.query(
      `SELECT AVG(rating) as average_rating, COUNT(*) as total_count
       FROM testimonials
       WHERE status = 'approved'`
    );
    return rows.length > 0
      ? {
          averageRating: parseFloat(rows[0].average_rating) || 0,
          totalCount: rows[0].total_count || 0
        }
      : { averageRating: 0, totalCount: 0 };
  }

  // Get testimonials count by status
  static async getCountByStatus(status) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM testimonials WHERE status = ?`,
      [status]
    );
    return rows[0].count;
  }
}

module.exports = Testimonial;
