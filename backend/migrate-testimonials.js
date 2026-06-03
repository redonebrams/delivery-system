// Migration script to create or update testimonials table
const pool = require('./config/database');

const createOrUpdateTestimonialsTable = async () => {
  try {
    console.log('🔄 Migration: Creating or updating testimonials table...');

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY user_id (user_id),
        CONSTRAINT testimonials_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    const [columns] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'status'`
    );

    if (columns.length === 0) {
      console.log('🔧 Ajout de la colonne status à testimonials...');
      await pool.execute(`
        ALTER TABLE testimonials
        ADD COLUMN status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending'
      `);

      console.log('🔧 Migration: Mise à jour des données existantes à partir de is_approved...');
      await pool.execute(`
        UPDATE testimonials
        SET status = CASE
          WHEN is_approved = 1 THEN 'approved'
          ELSE 'pending'
        END
      `);
    }

    const [tables] = await pool.execute(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials'`
    );

    if (tables.length > 0) {
      console.log('✅ Table verification: testimonials table exists in database');
    }

    console.log('✅ Migration terminée avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
};

createOrUpdateTestimonialsTable();
