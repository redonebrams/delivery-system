// Test complet des endpoints backend pour identifier les problèmes
// Copiez-collez ce code dans la console du navigateur

console.log("=== DIAGNOSTIC COMPLET FRONTEND/BACKEND ===");

// 1. Test de l'endpoint de login
async function testLoginEndpoint() {
  console.log("\n🔍 TEST 1: Endpoint /auth/login");
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });
    
    console.log("Status:", response.status);
    console.log("Headers:", [...response.headers.entries()]);
    
    const data = await response.json();
    console.log("Response data:", data);
    console.log("Response structure:", {
      hasSuccess: 'success' in data,
      hasData: 'data' in data,
      hasToken: 'token' in data,
      hasMessage: 'message' in data
    });
    
    return data;
  } catch (error) {
    console.error("❌ Erreur login:", error);
    return null;
  }
}

// 2. Test de l'endpoint register
async function testRegisterEndpoint() {
  console.log("\n🔍 TEST 2: Endpoint /auth/register");
  
  try {
    const newUser = {
      name: "Test User",
      email: "newuser@test.com",
      password: "password123",
      phone: "0612345678",
      role: "client"
    };
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    
    console.log("Status:", response.status);
    
    const data = await response.json();
    console.log("Response data:", data);
    
    return data;
  } catch (error) {
    console.error("❌ Erreur register:", error);
    return null;
  }
}

// 3. Test de l'endpoint /auth/me avec token
async function testAuthMeEndpoint(token) {
  console.log("\n🔍 TEST 3: Endpoint /auth/me");
  
  if (!token) {
    console.log("❌ Pas de token disponible");
    return null;
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    console.log("Status:", response.status);
    console.log("Headers:", [...response.headers.entries()]);
    
    const data = await response.json();
    console.log("Response data:", data);
    console.log("User structure:", {
      hasId: 'id' in data,
      hasEmail: 'email' in data,
      hasRole: 'role' in data,
      hasName: 'name' in data
    });
    
    return data;
  } catch (error) {
    console.error("❌ Erreur /auth/me:", error);
    return null;
  }
}

// 4. Test du format de réponse attendu par le frontend
function analyzeResponseFormat() {
  console.log("\n🔍 TEST 4: Analyse format de réponse");
  
  console.log("Format attendu par extractData():");
  console.log("- Option 1: {success: true, data: {token: '...'}, message: '...'}");
  console.log("- Option 2: {token: '...', user: {...}}");
  console.log("- Option 3: {token: '...'}");
  
  console.log("\nProblèmes possibles:");
  console.log("1. Backend ne renvoie pas le format attendu");
  console.log("2. Token non trouvé par extractData()");
  console.log("3. User data non trouvé par extractData()");
  console.log("4. Headers CORS manquants");
  console.log("5. Erreur 404/500 sur les endpoints");
}

// 5. Vérification CORS
async function testCORS() {
  console.log("\n🔍 TEST 5: Vérification CORS");
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'OPTIONS'
    });
    
    console.log("OPTIONS Status:", response.status);
    console.log("CORS Headers:", {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    });
  } catch (error) {
    console.error("❌ Erreur CORS:", error);
  }
}

// Exécuter tous les tests
async function runFullDiagnostic() {
  console.log("DÉBUT DU DIAGNOSTIC COMPLET");
  
  // Test 1: Login avec compte inexistant
  const loginResult = await testLoginEndpoint();
  
  // Test 2: Créer un nouveau compte
  const registerResult = await testRegisterEndpoint();
  
  // Test 3: Si création réussie, tester le login
  if (registerResult && (registerResult.token || registerResult.data?.token)) {
    const token = registerResult.token || registerResult.data?.token;
    console.log("\n✅ Compte créé, test du login...");
    
    // Login avec le nouveau compte
    const newLoginResult = await testLoginEndpoint();
    
    if (newLoginResult && (newLoginResult.token || newLoginResult.data?.token)) {
      const finalToken = newLoginResult.token || newLoginResult.data?.token;
      await testAuthMeEndpoint(finalToken);
    }
  }
  
  // Tests CORS et format
  await testCORS();
  analyzeResponseFormat();
  
  console.log("\n=== FIN DU DIAGNOSTIC ===");
}

// Lancer le diagnostic complet
runFullDiagnostic();
