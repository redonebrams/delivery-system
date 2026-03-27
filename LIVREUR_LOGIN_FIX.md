# 🔐 GUIDE COMPLET: PROBLÈMES DE CONNEXION DES LIVREURS

## ⚠️ CAUSES POSSIBLES IDENTIFIÉES

### 1. **Compte livreur n'existe pas en BD** 🔴
- Le livreur n'a pas été créé via l'interface admin
- Vérifier: Base de données → Table `users` → Chercher l'email du livreur

### 2. **Compte livreur existe MAIS est INACTIF** 🔴  
- **NOUVEAU**: La vérification `is_active` a été AJOUTÉE au `authController.login()`
- Si `is_active = 0`: Le livreur recevra l'erreur "Compte désactivé"
- Solution: Activer le compte en BD

### 3. **Enregistrement manquant dans table `livreurs`** 🔴
- L'utilisateur existe dans `users` avec `role = 'livreur'`
- Mais PAS d'enregistrement correspondant dans table `livreurs`
- Impact: Impossible de gérer les livraisons
- Solution: Créer l'enregistrement livreur ou le recréer

### 4. **Mot de passe incorrect** 🔴
- Le mot de passe saisi ne correspond pas au hash en BD
- Solution: Réinitialiser le mot de passe

### 5. **Problème de configuration (.env)** 🔴
- Variables manquantes: `JWT_SECRET`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- Solution: Vérifier le fichier `.env`

### 6. **Token JWT invalide ou expiré** 🟡
- Token expiré après 24h
- Solution: Se reconnecter

---

## 🔧 CORRECTIONS APPLIQUÉES

### ✅ Backend: `authController.login()`
```javascript
// NOUVEAU: Vérification du compte actif
if (!user.is_active) {
  return res.status(403).json(
    responseFormatter(false, null, 'Compte désactivé. Contactez l\'administrateur')
  );
}
```

### ✅ Backend: `models/User.js`
```javascript
// NOUVELLE MÉTHODE: Trouver utilisateur actif par email
static async findActiveByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email=? AND is_active=1',[email]
  );
  return rows[0];
}
```

### ✅ Frontend: `Login.jsx`
- Logique de gestion simplifiée
- Messages d'erreur plus clairs
- Meilleure détection des erreurs API (404, 401, 403)
- Logs de débogage améliorés

---

## 📋 CHECKLIST DE DÉPANNAGE

### ÉTAPE 1: Vérifier le compte en BD 

```bash
# Exécuter le script de diagnostic
cd backend
node diagnostic-livreur.js
```

Ce script affichera:
- ✅ Nombre de livreurs par statut (actifs/inactifs)
- ✅ Détails de chaque livreur actif
- ✅ Détails de chaque livreur inactif
- ✅ Orphans (qui n'existent pas dans table livreurs)
- ✅ Messages de correction

---

### ÉTAPE 2: Si le diagnostic montre des INACTIFS

⚠️ **Livreurs INACTIFS trouvés**

```sql
-- Activer TOUS les livreurs inactifs:
UPDATE users SET is_active = 1 WHERE role = 'livreur' AND is_active = 0;

-- Ou activer un livreur spécifique:
UPDATE users SET is_active = 1 WHERE email = 'livreur@example.com';
```

---

### ÉTAPE 3: Si le diagnostic montre des ORPHANS

⚠️ **Livreurs sans enregistrement dans table `livreurs`**

Pour chaque orphan trouvé:
```sql
-- Créer l'enregistrement livreur manquant
INSERT INTO livreurs (user_id, type_vehicule, statut, total_livraisons)
VALUES (
  [USER_ID du diagnostic],      -- ID de l'utilisateur
  'moto',                        -- Type de véhicule
  'disponible',                  -- Statut initial
  0                              -- Total livraisons
);
```

---

### ÉTAPE 4: Si le diagnostic montre AUCUN LIVREUR

❌ **Aucun livreur n'existe!**

1. Se connecter en tant qu'admin
2. Aller à `/admin/livreurs` (page CRUD Livreurs)
3. Cliquer sur "Créer un nouveau livreur"
4. Remplir le formulaire:
   - Nom
   - Prénom
   - Email (unique!)
   - Téléphone
   - Mot de passe (minimum 6 caractères)
   - Type de véhicule (moto/voiture/vélo)

---

## 🧪 TESTS DE VÉRIFICATION

### Test 1: Vérifier la connexion avec email correct, mot de passe CORRECT  
```
Résultat attendu: ✅ Connexion réussie → Redirection vers /livreur/dashboard
```

### Test 2: Vérifier la connexion avec email correct, mot de passe INCORRECT
```
Résultat attendu: ❌ Erreur 401 "Mot de passe incorrect"
```

### Test 3: Vérifier la connexion avec email INEXISTANT
```
Résultat attendu: ❌ Erreur 404 "Utilisateur non trouvé"
```

### Test 4: Vérifier la connexion avec compte INACTIF
```
Résultat attendu: ❌ Erreur 403 "Compte désactivé. Contactez l'administrateur"
```

### Test 5: Vérifier le token JWT
```javascript
// Dans la console du navigateur:
console.log(localStorage.getItem('token'));
// Devrait afficher un JWT valide (eyJ...)
```

---

## 📊 FLUX DE CONNEXION (Après corrections)

```
Frontend Form
     ↓
POST /api/auth/login {email, password}
     ↓
Backend authController.login()
     ↓
User.findByEmail(email)  ← Cherche l'utilisateur
     ↓
✅ Utilisateur trouvé?
  ├─ ❌ NON: return 404 "Utilisateur non trouvé"
  └─ ✅ OUI: Continuer
     ↓
✅ is_active = 1? [NOUVEAU]
  ├─ ❌ NON: return 403 "Compte désactivé"
  └─ ✅ OUI: Continuer
     ↓
✅ bcrypt.compare(password, password_hash)?
  ├─ ❌ NON: return 401 "Mot de passe incorrect"
  └─ ✅ OUI: Continuer
     ↓
jwt.sign({id, role}) ← Créer le token
     ↓
return 200 {token, user, message: "Connexion réussie"}
     ↓
Frontend: loginService() stocke token + user
     ↓
GET /api/auth/me (avec token)
     ↓
authMiddleware vérifie token
     ↓
Retour données utilisateur
     ↓
Login context updated ✅
     ↓
Redirection selon rôle ✅
```

---

## 🛠️ FICHIERS MODIFIÉS

| Fichier | Modification | Impact |
|---------|-------------|--------|
| `backend/controllers/authController.js` | ✅ Ajout vérification `is_active` | Empêche connexion de comptes inactifs |
| `backend/models/User.js` | ✅ Ajout `findActiveByEmail()` | Nouvelle méthode disponible |
| `frontend/src/pages/Auth/Login.jsx` | ✅ Logique simplifiée + meilleurs messages | UX amélioré |
| `backend/diagnostic-livreur.js` | ✅ Nouveau fichier | Outil de débogage |

---

## 📞 SI TOUJOURS PAS RÉSOLU

Vérifier dans cet ordre:

1. **Base de données accessible?**
   ```bash
   # Terminal
   mysql -h [DB_HOST] -u [DB_USER] -p [DB_PASS] [DB_NAME]
   # Doit se connecter sans erreur
   ```

2. **Fichier .env correct?**
   ```bash
   # backend/.env
   cat .env
   # Vérifier: DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET
   ```

3. **Backend actif?**
   ```bash
   # Terminal backend
   npm start
   # Doit afficher: "Serveur écoute sur le port 5000"
   ```

4. **Frontend actif?**
   ```bash
   # Terminal frontend (autre)
   npm run dev
   # Doit afficher l'URL locale (http://localhost:5173)
   ```

5. **Console du navigateur?**
   - Ouvrir DevTools (F12)
   - Aller à Console
   - Observer les logs détaillés du login (commence par "📝 Tentative de connexion")

---

## ✅ CONFIRMATION DE SUCCÈS

Quand la connexion fonctionne:

1. ✅ Page login reçoit les identifiants
2. ✅ Backend valide l'email + mot de passe + is_active
3. ✅ Token JWT est retourné
4. ✅ Token stocké dans localStorage
5. ✅ Données utilisateur stockées dans localStorage
6. ✅ Redirection vers `/livreur/dashboard`
7. ✅ Dashboard affiche les informations du livreur

