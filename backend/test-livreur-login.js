const pool = require('./config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testLivreur() {
  console.log('\n🔍 === VÉRIFICATION DES LIVREURS EN BD ===\n');

  try {
    // 1. Afficher tous les livreurs
    console.log('📋 Livreurs existants:');
    const [livreurs] = await pool.query(`
      SELECT u.id, u.email, u.nom, u.prenom, u.role, u.is_active, l.type_vehicule
      FROM users u
      LEFT JOIN livreurs l ON u.id = l.user_id
      WHERE u.role = 'livreur'
    `);

    if (livreurs.length === 0) {
      console.log('   ❌ Aucun livreur trouvé!');
    } else {
      console.log(`\n   ✅ ${livreurs.length} livreur(s) trouvé(s):\n`);
      for (const livr of livreurs) {
        const status = livr.is_active ? '✅ Actif' : '❌ Inactif';
        console.log(`   - ${livr.email}`);
        console.log(`     Nom: ${livr.nom} ${livr.prenom}`);
        console.log(`     Véhicule: ${livr.type_vehicule || 'N/A'}`);
        console.log(`     Statut: ${status}\n`);
      }
    }

    // 2. Créer un livreur de test
    console.log('\n📝 Création d\'un livreur de test...\n');
    
    const testEmail = 'livreur.test@deliveryapp.com';
    const testPassword = 'Test123456';
    const passwordHash = await bcrypt.hash(testPassword, 10);

    // Vérifier si ce livreur existe déjà
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [testEmail]);
    
    let userId;
    if (existing.length > 0) {
      console.log(`   ⏭️  Livreur de test déjà existant (ID: ${existing[0].id})`);
      userId = existing[0].id;
    } else {
      // Créer l'utilisateur
      const [userResult] = await pool.query(`
        INSERT INTO users (email, password_hash, role, nom, prenom, telephone, is_active)
        VALUES (?, ?, 'livreur', 'Test', 'Livreur', '0612345678', 1)
      `, [testEmail, passwordHash]);

      userId = userResult.insertId;
      console.log(`   ✅ Utilisateur créé avec ID: ${userId}`);

      // Créer le livreur
      const [livreurResult] = await pool.query(`
        INSERT INTO livreurs (user_id, type_vehicule, statut, total_livraisons)
        VALUES (?, 'moto', 'disponible', 0)
      `, [userId]);

      const livreurId = livreurResult.insertId;
      console.log(`   ✅ Livreur créé avec ID: ${livreurId}`);
    }

    console.log(`\n✅ Livreur de test prêt!\n`);
    console.log('📧 Identifiants pour tester:\n');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Mot de passe: ${testPassword}\n`);
    console.log('🧪 Test avec POSTMAN:\n');
    console.log(`   URL: POST http://localhost:5000/api/livreurs/login`);
    console.log(`   Content-Type: application/json`);
    console.log(`   Body:\n   {\n     "email": "${testEmail}",\n     "password": "${testPassword}"\n   }\n`);
    console.log('✅ Réponse attendue: Token JWT + données utilisateur\n');

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    console.error('\n✓ Vérifier que:');
    console.error('  - MariaDB/MySQL est en cours d\'exécution');
    console.error('  - Les paramètres .env sont corrects');
    console.error('  - La base de données "delivery_db" existe');
  } finally {
    process.exit(0);
  }
}

testLivreur();
