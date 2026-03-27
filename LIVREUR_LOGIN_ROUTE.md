# 🔐 GUIDE: Route de Connexion Dédiée pour Livreurs

## ✅ Changements Apportés

### 1️⃣ **Route Added**: `POST /api/livreurs/login`
**Fichier**: `backend/routes/livreurRoutes.js`
```javascript
router.post('/login', livreurController.login);
```

### 2️⃣ **Méthode Controller**: `livreurController.login()`
**Fichier**: `backend/controllers/livreurController.js`
- Accepte: `{email, password}`
- Valide que l'utilisateur est un livreur
- Vérifie que le compte est actif
- Retourne: `{token, user}`

### 3️⃣ **Structure de la Réponse**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "livreur@example.com",
      "nom": "Dupont",
      "prenom": "Jean",
      "telephone": "0612345678",
      "role": "livreur",
      "photo": null
    }
  },
  "message": "Connexion réussie"
}
```

---

## 🧪 TESTS - Comment Utiliser Avec POSTMAN

### ✅ Test 1: Connexion Réussie (Livreur Actif)

**URL**: `POST http://localhost:5000/api/livreurs/login`

**Headers**:
```
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "email": "livreur@example.com",
  "password": "password123"
}
```

**Résultat Attendu**: 
```
Status: 200
Response: {
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": {...}
  },
  "message": "Connexion réussie"
}
```

---

### ❌ Test 2: Email Inexistant

**URL**: `POST http://localhost:5000/api/livreurs/login`

**Body**:
```json
{
  "email": "nonexiste@example.com",
  "password": "password123"
}
```

**Résultat Attendu**:
```
Status: 404
Response: {
  "success": false,
  "data": null,
  "message": "Livreur non trouvé"
}
```

---

### ❌ Test 3: Mot de Passe Incorrect

**URL**: `POST http://localhost:5000/api/livreurs/login`

**Body**:
```json
{
  "email": "livreur@example.com",
  "password": "mauvaispassword"
}
```

**Résultat Attendu**:
```
Status: 401
Response: {
  "success": false,
  "data": null,
  "message": "Mot de passe incorrect"
}
```

---

### ❌ Test 4: Compte Inactif

**URL**: `POST http://localhost:5000/api/livreurs/login`

**Body**: (avec email d'un livreur inactif)
```json
{
  "email": "livreur_inactif@example.com",
  "password": "password123"
}
```

**Résultat Attendu**:
```
Status: 403
Response: {
  "success": false,
  "data": null,
  "message": "Compte désactivé. Contactez l'administrateur"
}
```

---

### ❌ Test 5: Accès avec Compte Admin (Rejeté)

**URL**: `POST http://localhost:5000/api/livreurs/login`

**Body**: (avec email d'un admin)
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Résultat Attendu**:
```
Status: 403
Response: {
  "success": false,
  "data": null,
  "message": "Accès réservé aux livreurs"
}
```

---

## 🔄 Flux de Connexion Complet

```
1. Frontend/Postman envoie:
   POST /api/livreurs/login
   {email, password}
        ↓
2. Backend livreurController.login():
   - Valide email/password présents ✓
   - Cherche l'utilisateur par email ✓
   - Vérifie role === 'livreur' ✓
   - Vérifie is_active === 1 ✓
   - Vérifie bcrypt.compare(password) ✓
   - Génère JWT token ✓
        ↓
3. Retourne:
   {token, user, message: "Connexion réussie"}
        ↓
4. Frontend/Client:
   - Stocke token dans localStorage ✓
   - Met en place Authorization header ✓
   - Redirige vers /livreur/dashboard ✓
```

---

## 📝 DIFFÉRENCES: Login Général vs Login Livreur

| Aspect | `/api/auth/login` | `/api/livreurs/login` |
|--------|-------------------|-----------------------|
| **Route** | Générale | Dédiée livreurs |
| **Accepte rôles** | Admin, Livreur, Client | Livreur SEULEMENT |
| **Validation** | Moins stricte | Stricte (role='livreur') |
| **Cas d'usage** | Tous les rôles | Livreurs uniquement |
| **Frontend** | Tous les pages login | Page login livreurs |

---

## 🚀 Intégration Frontend

Si tu veux utiliser cette route au frontend, crée un nouveau service:

**`frontend/src/services/livreurAuthService.js`**:
```javascript
import api from "./api";

export const loginLivreur = async (credentials) => {
  const response = await api.post("/livreurs/login", credentials);
  
  // Stocker le token
  if (response?.data?.token) {
    localStorage.setItem("token", response.data.token);
  }
  
  return response.data;
};
```

**Puis dans le component Login**:
```javascript
const response = await loginLivreur({email, password});
const token = response.data.token;
const user = response.data.user;
```

---

## ✅ STATUT DE VÉRIFICATION

| Item | Status |
|------|--------|
| ✅ Route créée | OK |
| ✅ Méthode controller | OK |
| ✅ Validation des données | OK |
| ✅ Vérification role | OK |
| ✅ Vérification is_active | OK |
| ✅ Vérification mot de passe | OK |
| ✅ Génération JWT | OK |
| ✅ Packages installés | OK |
| ✅ Pas d'erreurs de syntaxe | OK |

