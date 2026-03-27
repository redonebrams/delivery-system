# 🚀 GUIDE: Tester la Route de Login des Livreurs

## ✅ Livreur de Test Créé

**Compte créé avec succès:**

| Propriété | Valeur |
|-----------|--------|
| **Email** | `livreur.test@deliveryapp.com` |
| **Mot de passe** | `Test123456` |
| **Rôle** | `livreur` |
| **Statut** | ✅ Actif |
| **ID Utilisateur** | 7 |
| **ID Livreur** | 5 |

---

## 🧪 TEST 1: AVEC POSTMAN

### Configuration POSTMAN

**Méthode**: `POST`

**URL**: `http://localhost:5000/api/livreurs/login`

**Headers**:
```
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "email": "livreur.test@deliveryapp.com",
  "password": "Test123456"
}
```

### Résultat Attendu (Status 200)

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6ImxpdnJldXIiLCJpYXQiOjE3NDI2NDUwMDAsImV4cCI6MTc0MjczMTQwMH0...",
    "user": {
      "id": 7,
      "email": "livreur.test@deliveryapp.com",
      "nom": "Test",
      "prenom": "Livreur",
      "telephone": "0612345678",
      "role": "livreur",
      "photo": null
    }
  },
  "message": "Connexion réussie"
}
```

---

## 🧪 TEST 2: AVEC cURL (Terminal)

**Windows PowerShell:**
```powershell
$body = @{
    email = "livreur.test@deliveryapp.com"
    password = "Test123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/livreurs/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**LinuxBash:**
```bash
curl -X POST http://localhost:5000/api/livreurs/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "livreur.test@deliveryapp.com",
    "password": "Test123456"
  }'
```

---

## 🧪 TEST 3: SCRIPT NODE.JS

Sauvegarde ce code dans `backend/test-login-direct.js`:

```javascript
const http = require('http');
const jwt = require('jsonwebtoken');

function testLogin() {
  const data = JSON.stringify({
    email: 'livreur.test@deliveryapp.com',
    password: 'Test123456'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/livreurs/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`\n📊 Status: ${res.statusCode}\n`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        console.log('📨 Response:');
        console.log(JSON.stringify(response, null, 2));

        if (response.data && response.data.token) {
          console.log('\n🔐 Token JWT Décodé:');
          const decoded = jwt.decode(response.data.token);
          console.log(JSON.stringify(decoded, null, 2));
        }
      } catch (e) {
        console.error('Erreur parsing:', e.message);
        console.log('Raw response:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur requête:', error.message);
  });

  console.log('📝 Envoi requête de login...\n');
  req.write(data);
  req.end();
}

testLogin();
```

**Exécuter le test:**
```bash
cd backend
node test-login-direct.js
```

---

## 🔄 FLUX DE CONNEXION (Correctif appliqué)

```
1. ✅ AVANT: Erreur 404 "Cannot POST /api/livreurs/login"
   → La route n'existait pas du tout
   
2. ✅ Correction: Route ajoutée dans livreurRoutes.js
   → router.post('/login', livreurController.login)
   
3. ✅ MAINTENANT: Erreur 404 "Livreur non trouvé"
   → La route fonctionne, mais l'email n'existe pas
   
4. ✅ Solution: Livreur de test créé
   → Email: livreur.test@deliveryapp.com
   → Mot de passe: Test123456
   
5. ✅ RÉSULTAT ATTENDU: Connexion réussie + Token JWT
   → { success: true, data: {token, user} }
```

---

## 📋 CHECKLIST DE VÉRIFICATION

Avant de tester, vérifie:

- [ ] Backend est en cours d'exécution (`npm start` dans le dossier backend)
- [ ] Base de données MariaDB/MySQL est active
- [ ] Fichier `.env` configuré correctement (DB_HOST, DB_USER, etc.)
- [ ] Livreur de test créé avec le script `test-livreur-login.js`
- [ ] Postman/cURL prêt avec les identifiants corrects

---

## 🐛 DÉPANNAGE

### Si tu reçois toujours "Livreur non trouvé"

1. Vérifier que le livreur existe en BD:
```bash
node test-livreur-login.js
```

2. Vérifier manuellement en BD:
```sql
SELECT * FROM users WHERE email = 'livreur.test@deliveryapp.com';
```

### Si tu reçois "Mot de passe incorrect"

1. La route fonctionne ✅
2. Mais le mot de passe est incorrect
3. Solution: Créer un nouveau livreur avec `test-livreur-login.js`

### Si tu reçois "Compte désactivé"

1. Vérifier `is_active = 1`:
```sql
SELECT is_active FROM users WHERE email = 'livreur.test@deliveryapp.com';
```

2. Si `is_active = 0`, activer:
```sql
UPDATE users SET is_active = 1 WHERE email = 'livreur.test@deliveryapp.com';
```

---

## ✅ PROCHAINES ÉTAPES

Après le test réussi:

1. ✅ Vérifier que le token JWT est retourné
2. ✅ Vérifier que `user` contient les bonnes données
3. ✅ Tester l'intégration frontend (si applicable)
4. ✅ Utiliser le token pour d'autres appels API:
```bash
Authorization: Bearer [TOKEN_JWT_REÇU]
```

---

## 📞 RÉSUMÉ

| Élément | Status |
|---------|--------|
| Route de login créée | ✅ POST /api/livreurs/login |
| Controller login implémenté | ✅ livreurController.login() |
| Validation email/password | ✅ OK |
| Vérification rôle | ✅ OK |
| Vérification is_active | ✅ OK |
| Vérification mot de passe | ✅ OK (bcrypt) |
| Génération JWT | ✅ OK (24h expiration) |
| Livreur de test créé | ✅ livreur.test@deliveryapp.com |
| **Prêt à tester** | ✅ **OUI** |

