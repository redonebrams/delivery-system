// Test d'inscription et connexion - Copiez ce code dans la console du navigateur

// 1. Créer un compte client test
const testClient = {
  name: "Jean Client",
  email: "client@test.com",
  password: "password123",
  phone: "0612345678",
  role: "client"
};

console.log("=== CRÉATION COMPTE CLIENT TEST ===");
console.log("Données:", testClient);

fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testClient)
})
.then(response => {
  console.log("Register response status:", response.status);
  return response.json();
})
.then(data => {
  console.log("Register response:", data);
  
  // 2. Essayer de se connecter avec le compte créé
  console.log("\n=== TEST CONNEXION ===");
  return fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: testClient.email,
      password: testClient.password
    })
  });
})
.then(response => {
  console.log("Login response status:", response.status);
  return response.json();
})
.then(data => {
  console.log("Login response:", data);
  
  // 3. Si connexion réussie, tester /auth/me
  if (data.token) {
    console.log("\n=== TEST /AUTH/ME ===");
    return fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${data.token}`
      }
    });
  }
})
.then(response => {
  if (response) {
    console.log("/auth/me response status:", response.status);
    return response.json();
  }
})
.then(data => {
  if (data) {
    console.log("/auth/me response:", data);
  }
})
.catch(error => {
  console.error("Error:", error);
});
