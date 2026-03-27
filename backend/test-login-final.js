const http = require('http');
const jwt = require('jsonwebtoken');

console.log('\n🧪 === TEST DE CONNEXION LIVREUR ===\n');

const testData = {
  email: 'livreur.test@deliveryapp.com',
  password: 'Test123456'
};

const jsonData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/livreurs/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': jsonData.length
  }
};

console.log(`📧 Email: ${testData.email}`);
console.log(`🔑 Mot de passe: ${testData.password}`);
console.log(`\n📡 Envoi requête à: http://localhost:5000/api/livreurs/login\n`);

const req = http.request(options, (res) => {
  console.log(`📊 HTTP Status: ${res.statusCode}`);
  console.log(`📋 Content-Type: ${res.headers['content-type']}\n`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      console.log('📨 Réponse du serveur:');
      console.log('━'.repeat(60));
      console.log(JSON.stringify(response, null, 2));
      console.log('━'.repeat(60));

      if (response.success && response.data && response.data.token) {
        console.log('\n✅ CONNEXION RÉUSSIE!\n');
        
        // Décoder le JWT
        try {
          const decoded = jwt.decode(response.data.token);
          console.log('🔐 Détails du Token JWT:');
          console.log('   ID: ' + decoded.id);
          console.log('   Rôle: ' + decoded.role);
          console.log('   Expiré dans: 24h');
          console.log('');
        } catch (e) {
          console.log('⚠️  Impossible de décoder le token:', e.message);
        }

        // Afficher les données utilisateur
        if (response.data.user) {
          console.log('👤 Données utilisateur:');
          console.log('   ID: ' + response.data.user.id);
          console.log('   Email: ' + response.data.user.email);
          console.log('   Nom: ' + response.data.user.nom + ' ' + response.data.user.prenom);
          console.log('   Rôle: ' + response.data.user.role);
          console.log('   Téléphone: ' + response.data.user.telephone);
          console.log('');
        }

        console.log('💡 Prochaines étapes:');
        console.log('   1. Copier le token dans Postman header: Authorization: Bearer [TOKEN]');
        console.log('   2. Tester les routes protégées avec le token');
        console.log('   3. Intégrer le login au frontend\n');

      } else if (response.success === false) {
        console.log('\n❌ ERREUR À LA CONNEXION:\n');
        console.log('Message: ' + response.message);
        console.log('');
        console.log('Solution possible:');
        
        if (response.message === 'Livreur non trouvé') {
          console.log('  → Le livreur n\'existe pas en BD');
          console.log('  → Exécuter: node test-livreur-login.js');
        } else if (response.message === 'Mot de passe incorrect') {
          console.log('  → Le mot de passe est faux');
          console.log('  → Vérifier le mot de passe');
        } else if (response.message === 'Compte désactivé') {
          console.log('  → Le compte est inactif');
          console.log('  → Mettre à jour is_active = 1 en BD');
        } else if (response.message === 'Accès réservé aux livreurs') {
          console.log('  → L\'utilisateur n\'est pas un livreur');
          console.log('  → Créer un compte livreur valide');
        }
        console.log('');
      }
    } catch (e) {
      console.log('❌ Erreur parsing JSON:', e.message);
      console.log('Réponse brute:', data);
      console.log('\n💡 Le serveur n\'a pas répondu correctement');
      console.log('   Vérifier que: npm start est lancé dans le dossier backend\n');
    }
  });
});

req.on('error', (e) => {
  console.log('❌ ERREUR RÉSEAU:\n');
  console.log('Message: ' + e.message);
  console.log('');
  console.log('Solution:');
  console.log('  1. Vérifier que le backend est lancé: npm start');
  console.log('  2. Terminal backend doit afficher: "Serveur démarré sur le port 5000"');
  console.log('  3. Vérifier que le .env est configuré correctement\n');
});

console.log('⏳ Attente de la réponse...\n');
req.write(jsonData);
req.end();
