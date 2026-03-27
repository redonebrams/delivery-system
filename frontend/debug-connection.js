// Test de connexion API - Collez ce code dans la console du navigateur
// pour diagnostiquer les problèmes de connexion

console.log("=== CONNEXION TEST ===");

// 1. Vérifier si le backend est accessible
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'testpassword'
  })
})
.then(response => {
  console.log("Backend response status:", response.status);
  console.log("Backend response headers:", response.headers);
  return response.json();
})
.then(data => {
  console.log("Backend response data:", data);
})
.catch(error => {
  console.error("Backend connection error:", error);
  console.log("=== POSSIBLE CAUSES ===");
  console.log("1. Backend not running on port 5000");
  console.log("2. CORS issues");
  console.log("3. Network problems");
});

// 2. Vérifier l'état actuel du localStorage
console.log("Current localStorage:");
console.log("Token:", localStorage.getItem('token'));
console.log("User:", localStorage.getItem('user'));

// 3. Test de l'endpoint /auth/me
const token = localStorage.getItem('token');
if (token) {
  fetch('http://localhost:5000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    console.log("/auth/me response status:", response.status);
    return response.json();
  })
  .then(data => {
    console.log("/auth/me response data:", data);
  })
  .catch(error => {
    console.error("/auth/me error:", error);
  });
}
