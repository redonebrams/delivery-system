# 🚀 Démarrage Rapide - Système de Livraison

## ⚡ En 5 minutes!

### 1️⃣ **Cloner/Vérifier le code**
```bash
cd delivery-system-new
ls -la  # Vérifier la structure
```

### 2️⃣ **Base de données**
```bash
mysql -u root -p
mysql> CREATE DATABASE delivery_db;
mysql> SOURCE database/delivery_db.sql;
mysql> SELECT COUNT(*) FROM users;  # Devrait retourner 0
```

### 3️⃣ **Backend**
```bash
cd backend
npm install
# Créer .env avec:
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=your_password
# DB_NAME=delivery_db
# JWT_SECRET=your_very_long_secret_key
# PORT=5000
npm run dev  # Démarre sur http://localhost:5000
```

### 4️⃣ **Frontend**
```bash
# Terminal séparé
cd frontend
npm install
npm run dev  # Démarre sur http://localhost:5173
```

### 5️⃣ **Tester!**
Ouvrir http://localhost:5173 dans le navigateur

---

## 👤 Comptes de Test

**Créer via inscription**:
1. Aller sur `/register`
2. Remplir le formulaire
3. Sélectionner le rôle
4. Se connecter

**Rôles disponibles**:
- `client` - Client régulier
- `livreur` - Personne de livraison
- `admin` - Administrateur système

---

## 📱 Navigation par Rôle

### Client
- `/` → Accueil
- `/dashboard` → Commandations
- `/new-order` → Créer commande
- `/orders` → Historique
- `/profile` → Mon profil

### Livreur
- `/livreur/dashboard` → Mon tableau de bord
- `/livreur/deliveries` → Mes livraisons
- `/livreur/delivery/:id` → Détails livraison

### Admin
- `/admin/dashboard` → Statistiques
- `/admin/orders` → Gestion commandes
- `/admin/clients` → Gestion clients
- `/admin/livreurs` → Gestion livreurs
- `/admin/settings` → Configuration

---

## 🧪 Cas de Test Rapides

### Test 1: Créer une Commande
```
1. Login comme client
2. Aller à "Nouvelle Commande"
3. Remplir les détails:
   - Type: Restaurant
   - Pickup: Restaurant ABC, 123 Rue
   - Delivery: Office XYZ, 456 Boulevard
   - Distance: 5 km
   - Payment: Cash
4. Soumettre → Vérifier la création
```

### Test 2: Assigner un Livreur
```
1. Login comme admin
2. Aller à "Commandes"
3. Cliquer "Assigner"
4. Sélectionner un livreur
5. Confirmer → Vérifier la mise à jour
```

### Test 3: Filtrer les Commandes
```
1. Aller à "Historique des Commandes"
2. Taper dans la recherche
3. Sélectionner un statut
4. Changer les dates
5. Vérifier les résultats filtrés
```

---

## 📊 API Endpoints Clés

### Authentification
```bash
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Commandes
```bash
GET /api/commandes
POST /api/commandes
PUT /api/commandes/:id
PUT /api/commandes/:id/statut
DELETE /api/commandes/:id
```

### Utilisateurs
```bash
GET /api/clients
GET /api/livreurs
PUT /api/clients/:id
```

### Statistiques
```bash
GET /api/stats/dashboard
GET /api/stats/tarifs
PUT /api/stats/tarifs
```

---

## 🔍 Dépannage Courant

### ❌ "Cannot GET /api/..."
- Vérifier que le backend tourne (`http://localhost:5000`)
- Vérifier les routes dans `backend/routes/`

### ❌ "Database connection failed"
- Vérifier que MySQL tourne
- Vérifier les credentials dans `.env`
- Vérifier que la database existe

### ❌ "Unexpected token in JSON"
- Vérifier le format de la requête
- Vérifier que le Content-Type est `application/json`

### ❌ "401 Unauthorized"
- Vérifier que le token est stocké
- Re-login
- Vérifier l'expiration du token (24h)

### ❌ CORS Error
- Vérifier la config dans `backend/config/corsOptions.js`
- Frontend doit être sur `http://localhost:5173`

---

## 🛠️ Dev Tools Recommandés

1. **React DevTools** - Extension Chrome pour React
2. **Redux DevTools** - Pour debug Context
3. **Postman** - Tester les APIs
4. **DBeaver** - Gérer la base de données
5. **VS Code** - Éditeur de code

---

## 📖 Pour Plus de Détails

Consulter les documents:
- **IMPLEMENTATION_GUIDE.md** - Guide complet
- **TESTING_CHECKLIST.md** - Tests exhaustifs
- **DEVELOPER_REFERENCE.md** - Référence API
- **COMPLETION_SUMMARY.md** - Résumé complet

---

## 🎉 Vous Êtes Prêt!

L'application est **100% fonctionnelle** et prête à être utilisée. Bon développement! 🚀

---

**Questions?** Consultez la documentation ou les commentaires dans le code.
