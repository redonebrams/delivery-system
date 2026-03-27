// Script de test pour vérifier les comptes existants
// Copiez-collez ce code dans la console du navigateur

console.log("=== VÉRIFICATION DES COMPTES EXISTANTS ===");

// Comptes de test à vérifier
const testAccounts = [
  { email: 'admin@test.com', password: 'admin123', role: 'admin' },
  { email: 'client@test.com', password: 'client123', role: 'client' },
  { email: 'livreur@test.com', password: 'livreur123', role: 'livreur' },
  { email: 'jean@client.com', password: 'password123', role: 'client' },
  { email: 'test@test.com', password: 'test123', role: 'client' }
];

async function checkAccounts() {
  for (const account of testAccounts) {
    try {
      console.log(`\n🔍 Test du compte: ${account.email}`);
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        console.log(`✅ COMPTE VALIDE: ${account.email}`);
        console.log(`   Rôle: ${account.role}`);
        console.log(`   Token: ${data.token.substring(0, 20)}...`);
        
        // Vérifier les données utilisateur
        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log(`   Données utilisateur:`, userData);
        }
      } else {
        console.log(`❌ COMPTE INVALIDE: ${account.email}`);
        console.log(`   Erreur:`, data.message || 'Identifiants incorrects');
      }
    } catch (error) {
      console.log(`💥 ERREUR POUR ${account.email}:`, error.message);
    }
  }
  
  console.log("\n=== CRÉATION D'UN COMPET CLIENT TEST ===");
  
  // Créer un compte client si aucun n'existe
  const newClient = {
    name: "Client Test",
    email: "client@nouveau.com",
    password: "client123",
    phone: "0612345678",
    role: "client"
  };
  
  try {
    const createResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newClient)
    });
    
    const createData = await createResponse.json();
    
    if (createResponse.ok) {
      console.log("✅ NOUVEAU COMPTE CLIENT CRÉÉ:");
      console.log("   Email: client@nouveau.com");
      console.log("   Mot de passe: client123");
      console.log("   Réponse:", createData);
    } else {
      console.log("❌ ERREUR CRÉATION COMPTE:");
      console.log("   Erreur:", createData.message);
    }
  } catch (error) {
    console.log("💥 ERREUR CRÉATION:", error.message);
  }
}

// Lancer le test
checkAccounts();
