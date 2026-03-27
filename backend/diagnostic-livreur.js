const pool = require('./config/database');
require('dotenv').config();

async function diagnose() {
  console.log('\n🔍 === DIAGNOSTIC SYSTÈME DE CONNEXION DES LIVREURS ===\n');

  try {
    // 1. Vérifier la connexion BD
    console.log('1️⃣  Test de connexion à la base de données...');
    const connection = await pool.getConnection();
    console.log('   ✅ Connexion réussie');
    connection.release();

    // 2. Vérifier les variables d'environnement
    console.log('\n2️⃣  Vérification des variables d\'environnement...');
    const envVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'JWT_SECRET'];
    for (const envVar of envVars) {
      const value = process.env[envVar];
      if (value) {
        console.log(`   ✅ ${envVar}: Configuré`);
      } else {
        console.log(`   ❌ ${envVar}: MANQUANT!`);
      }
    }

    // 3. Compter les utilisateurs par rôle
    console.log('\n3️⃣  Nombre d\'utilisateurs par rôle...');
    const [roleStats] = await pool.query(`
      SELECT role, COUNT(*) as count, 
             SUM(is_active) as actifs,
             SUM(NOT is_active) as inactifs
      FROM users 
      GROUP BY role
    `);
    
    if (roleStats.length === 0) {
      console.log('   ⚠️  Aucun utilisateur dans la BD!');
    } else {
      for (const stat of roleStats) {
        console.log(`
   📊 ${stat.role.toUpperCase()}:
      - Total: ${stat.count}
      - Actifs: ${stat.actifs || 0}
      - Inactifs: ${stat.inactifs || 0}
        `);
      }
    }

    // 4. Détails des livreurs inactifs
    console.log('\n4️⃣  Livreurs INACTIFS (is_active = 0)...');
    const [inactiveUsers] = await pool.query(`
      SELECT id, email, nom, prenom, is_active, created_at
      FROM users 
      WHERE role = 'livreur' AND is_active = 0
    `);

    if (inactiveUsers.length === 0) {
      console.log('   ✅ Aucun livreur inactif');
    } else {
      console.log(`   ⚠️  ${inactiveUsers.length} livreur(s) INACTIF(S):`);
      for (const user of inactiveUsers) {
        console.log(`
   🚫 ${user.nom} ${user.prenom}
      - Email: ${user.email}
      - ID: ${user.id}
      - Créé: ${user.created_at}
        `);
      }
    }

    // 5. Livreurs actifs
    console.log('\n5️⃣  Livreurs ACTIFS (is_active = 1)...');
    const [activeUsers] = await pool.query(`
      SELECT u.id, u.email, u.nom, u.prenom, u.created_at,
             l.id as livreur_id, l.type_vehicule, l.statut
      FROM users u
      LEFT JOIN livreurs l ON u.id = l.user_id
      WHERE u.role = 'livreur' AND u.is_active = 1
    `);

    if (activeUsers.length === 0) {
      console.log('   ⚠️  Aucun livreur ACTIF!');
    } else {
      console.log(`   ✅ ${activeUsers.length} livreur(s) ACTIF(S):`);
      for (const user of activeUsers) {
        const livreurStatus = user.livreur_id ? '✅ Enregistré' : '❌ PAS ENREGISTRÉ';
        console.log(`
   👤 ${user.nom} ${user.prenom}
      - Email: ${user.email}
      - Statut livreur: ${livreurStatus}
      - Type véhicule: ${user.type_vehicule || 'N/A'}
      - Statut: ${user.statut || 'N/A'}
      - Créé: ${user.created_at}
        `);
      }
    }

    // 6. Orphans: Utilisateurs livreur sans enregistrement dans livreurs table
    console.log('\n6️⃣  Vérification des ORPHANS (usagers sans livreur)...');
    const [orphans] = await pool.query(`
      SELECT u.id, u.email, u.nom, u.prenom
      FROM users u
      LEFT JOIN livreurs l ON u.id = l.user_id
      WHERE u.role = 'livreur' AND l.id IS NULL AND u.is_active = 1
    `);

    if (orphans.length === 0) {
      console.log('   ✅ Aucun orphan trouvé');
    } else {
      console.log(`   ⚠️  ${orphans.length} usager(s) livreur SANS enregistrement dans livreurs:`);
      for (const orphan of orphans) {
        console.log(`      - ${orphan.nom} ${orphan.prenom} (${orphan.email})`);
      }
    }

    // 7. Test de mot de passe
    console.log('\n7️⃣  Test de mot de passe pour les livreurs actifs...');
    const bcrypt = require('bcryptjs');
    
    if (activeUsers.length > 0) {
      const testUser = activeUsers[0];
      
      // Nous ne pouvons pas tester directement car nous ne connaissons pas le mot de passe
      console.log(`   ℹ️  Pour tester les mots de passe, créez un nouveau compte de test`);
      console.log(`   Utilisateur de test: ${testUser.email}`);
    }

    // 8. Résumé
    console.log('\n📋 === RÉSUMÉ ===\n');
    console.log('Actions recommandées:');
    
    if (roleStats.filter(s => s.role === 'livreur').length === 0) {
      console.log('1. ❌ CRÉER DES COMPTES DE LIVREURS');
    } else {
      const livreursStats = roleStats.find(s => s.role === 'livreur');
      if (livreursStats.inactifs > 0) {
        console.log(`1. ⚠️  ACTIVER ${livreursStats.inactifs} LIVREUR(S) INACTIF(S)`);
        console.log('   Commande SQL: UPDATE users SET is_active = 1 WHERE role = "livreur" AND is_active = 0;');
      }
      if (orphans.length > 0) {
        console.log(`2. ⚠️  CRÉER ${orphans.length} ENREGISTREMENT(S) MANQUANT(S) DANS livreurs`);
      }
    }

    if (!process.env.JWT_SECRET) {
      console.log('2. ❌ CONFIGURER JWT_SECRET dans .env');
    }

    console.log('\n✅ Diagnostic terminé!\n');

  } catch (error) {
    console.error('\n❌ ERREUR DIAGNOSTIC:', error.message);
    console.error('Vérifiez:');
    console.error('- Que MariaDB/MySQL est en cours d\'exécution');
    console.error('- Que les variables .env sont correctes');
    console.error('- Que la base de données existe');
  } finally {
    process.exit(0);
  }
}

diagnose();
