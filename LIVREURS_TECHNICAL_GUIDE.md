# 🔧 Architecture Technique - Livreurs CRUD

## Structure des Fichiers Modifiés

```
frontend/src/
├── pages/Admin/
│   └── Livreurs.jsx                 ← Component principal (REFACTORISÉ)
├── services/
│   └── userService.js               ← API Service (AMÉLIORÉ)
└── components/Layout/
    └── AdminLayout.jsx              ← Wrapper layout
```

---

## 1. Composant Principal : Livreurs.jsx

### Imports & Dépendances
```javascript
import React, { useEffect, useState }
import { getLivreurs, createLivreur, updateLivreur, 
         removeLivreur, getLivreurById, getLivreurDeliveries } 
from "../../services/userService"
import { useError }    from "../../context/ErrorContext"
import { useLoading }  from "../../context/LoadingContext"
import AdminLayout     from "../../components/Layout/AdminLayout"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
```

### État (State Management)

#### Données Principales
```javascript
const [livreurs, setLivreurs] = useState([])           // Base de données
const [filteredLivreurs, setFilteredLivreurs] = useState([]) // Données filtrées
const [selectedLivreur, setSelectedLivreur] = useState(null) // Livreur sélectionné
```

#### Contrôle Modal
```javascript
const [showModal, setShowModal] = useState(false)       // Affichage modal
const [modalMode, setModalMode] = useState("view")      // Mode : view/edit/create/stats
```

#### Filtres et Tri
```javascript
const [searchTerm, setSearchTerm] = useState("")        // Recherche textuelle
const [statusFilter, setStatusFilter] = useState("tous") // Filtre statut
const [vehicleFilter, setVehicleFilter] = useState("tous") // Filtre véhicule
const [sortBy, setSortBy] = useState("nom")             // Tri
```

#### Formulaire & Validation
```javascript
const [formData, setFormData] = useState({
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  password: "",
  confirmPassword: "",
  type_vehicule: "moto"
})
const [formErrors, setFormErrors] = useState({})        // Erreurs
```

#### Pagination & Statistiques
```javascript
const [currentPage, setCurrentPage] = useState(1)       // Page actuelle
const [itemsPerPage] = useState(10)                     // 10 par page
const [livreurStats, setLivreurStats] = useState(null)  // Statistiques
const [deliveriesHistory, setDeliveriesHistory] = useState([]) // Historique
```

### Hooks Effects

#### Chargement Initial
```javascript
useEffect(() => {
  fetchLivreurs()  // Récupère les livreurs au montage du composant
}, [])
```

#### Filtrage & Tri en Temps Réel
```javascript
useEffect(() => {
  // Applique tous les filtres et tri
  // Met à jour setFilteredLivreurs
  // Réinitialise la pagination
}, [searchTerm, statusFilter, vehicleFilter, livreurs, sortBy])
```

### Fonctions d'API

#### Récupération des Données
```javascript
const fetchLivreurs = async () => {
  try {
    setLoading("livreurs", true)
    const data = await getLivreurs()
    setLivreurs(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [])
  } catch (error) {
    handleApiError(error)
  } finally {
    setLoading("livreurs", false)
  }
}
```

### Fonctions de Validation

#### Email
```javascript
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
  // ✓ Valides : name@domain.com, user.email@subdomain.co.uk
  // ✗ Invalides : invalid@, @domain.com, noatsign.com
```

#### Téléphone Marocain
```javascript
const validateMoroccanPhone = (phone) => {
  const regex = /^(06|07)[0-9]{8}$/
  return regex.test(phone.replace(/\s/g, ""))
}
  // ✓ Valides : 0612345678, 06 12 34 56 78, 0712345678
  // ✗ Invalides : 0512345678, 061234567, +212612345678
```

#### Mot de Passe
```javascript
const validatePassword = (password) => {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password)
}
  // ✓ Valides : MyPass123, SecureP@ss01
  // ✗ Invalides : pass, PASS123, mypass123
```

#### Validation Complète du Formulaire
```javascript
const validateForm = () => {
  const errors = {}
  
  // Validation des champs obligatoires
  if (!formData.nom.trim()) errors.nom = "Le nom est requis"
  if (!formData.prenom.trim()) errors.prenom = "Le prénom est requis"
  
  // Validation spécifiques
  if (!validateEmail(formData.email)) errors.email = "Email invalide"
  if (!validateMoroccanPhone(formData.telephone)) errors.telephone = "Format marocain requis"
  
  // Validation mot de passe (création seulement)
  if (modalMode === "create") {
    if (!validatePassword(formData.password)) {
      errors.password = "Min 8 caractères, 1 Maj, 1 min, 1 chiffre"
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas"
    }
  }
  
  setFormErrors(errors)
  return Object.keys(errors).length === 0
}
```

### Fonctions Modales & Modes

#### Ouverture des Modales
```javascript
// Mode Création
const handleOpenCreateModal = () => {
  // Réinitialise formData
  // Met modalMode à "create"
  // Ouvre la modal
}

// Mode Consultation
const handleOpenViewModal = async (livreur) => {
  // Charge les données du livreur
  // Met modalMode à "view"
  // Ouvre la modal
}

// Mode Édition
const handleOpenEditModal = async (livreur) => {
  // Charge les données du livreur
  // Met modalMode à "edit"
  // Ouvre la modal
}

// Mode Statistiques
const handleOpenStatsModal = async (livreur) => {
  // Récupère les statistiques de l'API
  // Récupère l'historique des livraisons
  // Met modalMode à "stats"
  // Ouvre la modal
}
```

### Fonctions CRUD

#### CREATE - Créer Livreur
```javascript
const handleCreateLivreur = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) return  // Validation
  
  try {
    setLoading("createLivreur", true)
    
    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      password: formData.password,
      type_vehicule: formData.type_vehicule,
      role: "livreur"
    }
    
    await createLivreur(payload)  // API Call
    handleSuccess("Livreur créé avec succès!")  // Notification
    closeModal()                 // Ferme modal
    await fetchLivreurs()        // Rafraîchit la liste
    
  } catch (error) {
    handleApiError(error)        // Erreur
  } finally {
    setLoading("createLivreur", false)
  }
}
```

#### UPDATE - Mettre à Jour
```javascript
const handleUpdateLivreur = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) return
  
  try {
    setLoading("updateLivreur", true)
    
    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      telephone: formData.telephone,
      type_vehicule: formData.type_vehicule
      // Email non modifiable
      // Password non modifiable ici
    }
    
    await updateLivreur(selectedLivreur.id, payload)
    handleSuccess("Livreur mis à jour avec succès!")
    closeModal()
    await fetchLivreurs()
    
  } catch (error) {
    handleApiError(error)
  } finally {
    setLoading("updateLivreur", false)
  }
}
```

#### DELETE - Supprimer
```javascript
const handleDeleteLivreur = async () => {
  if (!selectedLivreur) return
  
  // Confirmation requise
  if (!window.confirm("Êtes-vous sûr de supprimer?")) return
  
  try {
    setLoading("deleteLivreur", true)
    await removeLivreur(selectedLivreur.id)
    handleSuccess("Livreur supprimé avec succès!")
    closeModal()
    await fetchLivreurs()
  } catch (error) {
    handleApiError(error)
  } finally {
    setLoading("deleteLivreur", false)
  }
}
```

#### TOGGLE STATUS
```javascript
const handleToggleStatus = async (livreur) => {
  const newStatus = livreur.statut === "indisponible" ? "disponible" : "indisponible"
  
  try {
    setLoading("toggleStatus", true)
    await updateLivreur(livreur.id, { statut: newStatus })
    handleSuccess(`Livreur ${newStatus === "disponible" ? "activé" : "désactivé"}!`)
    await fetchLivreurs()
  } catch (error) {
    handleApiError(error)
  } finally {
    setLoading("toggleStatus", false)
  }
}
```

### Utilitaires

#### Coleur Statut
```javascript
const getStatusColor = (status) => {
  const map = {
    disponible: { bg: "#10b981", label: "Disponible" },
    en_livraison: { bg: "#0ea5e9", label: "En livraison" },
    indisponible: { bg: "#ef4444", label: "Indisponible" }
  }
  return map[status || "disponible"] || { bg: "#64748b", label: status || "N/A" }
}
```

#### Icône Véhicule
```javascript
const getVehicleIcon = (type) => {
  const map = {
    moto: "bi-fire",           // 🏍️
    voiture: "bi-car-front",   // 🚗
    velo: "bi-bicycle"         // 🚲
  }
  return map[type?.toLowerCase() || "moto"] || "bi-fire"
}
```

#### Réinitialiser Formulaire
```javascript
const closeModal = () => {
  setShowModal(false)
  setSelectedLivreur(null)
  setFormData({
    nom: "", prenom: "", email: "", 
    telephone: "", password: "", 
    confirmPassword: "", type_vehicule: "moto"
  })
  setFormErrors({})
  setLivreurStats(null)
  setDeliveriesHistory([])
}
```

### Pagination

```javascript
const indexOfLastItem = currentPage * itemsPerPage
const indexOfFirstItem = indexOfLastItem - itemsPerPage
const currentLivreurs = filteredLivreurs.slice(indexOfFirstItem, indexOfLastItem)
const totalPages = Math.ceil(filteredLivreurs.length / itemsPerPage)

// Exemple avec 45 livreurs et 10 par page :
// Page 1 : items 1-10
// Page 2 : items 11-20
// Page 3 : items 21-30
// Page 4 : items 31-40
// Page 5 : items 41-45
```

---

## 2. Mise à Jour du Service : userService.js

### Nouvelles Fonctions Ajoutées

```javascript
// Retrieve Operations
export const getLivreurById = async (id) => {
  const response = await api.get(`/livreurs/${id}`)
  return extractData(response)
}

export const getLivreurDeliveries = async (id = null) => {
  const url = id ? `/livreurs/${id}/deliveries` : "/livreurs/deliveries"
  const response = await api.get(url)
  return extractData(response)
}

// Update Operations
export const updateLivreur = async (id, data) => {
  const response = await api.put(`/livreurs/${id}`, data)
  return response.data
}

// Delete Operations
export const removeLivreur = async (id) => {
  const response = await api.delete(`/livreurs/${id}`)
  return response.data
}

// Enhanced Stats
export const getLivreurStats = async (id = null) => {
  const url = id ? `/livreurs/${id}/stats` : "/livreurs/stats"
  const response = await api.get(url)
  return extractData(response)
}
```

---

## 3. Structure du DOM

### Sections Principales

#### 1. Header Statistiques
```html
<div class="row mb-4 g-3">  <!-- 4 colonnes -->
  <div class="col-md-3"> <!-- Statistique 1 -->
  <div class="col-md-3"> <!-- Statistique 2 -->
  <div class="col-md-3"> <!-- Statistique 3 -->
  <div class="col-md-3"> <!-- Statistique 4 -->
</div>
```

#### 2. Barre de Filtres
```html
<div class="card rounded-4">
  <div class="row g-3">
    <div class="col-md-3"> <!-- Recherche -->
    <div class="col-md-2"> <!-- Filtre Statut -->
    <div class="col-md-2"> <!-- Filtre Véhicule -->
    <div class="col-md-2"> <!-- Tri -->
    <div class="col-md-3"> <!-- Bouton Réinitialiser -->
</div>
```

#### 3. Tableau
```html
<div class="table-responsive">
  <table class="table table-hover">
    <thead>
      <tr> <!-- En-têtes -->
    <tbody>
      {currentLivreurs.map(livreur => (
        <tr key={livreur.id}>
          <!-- 7 colonnes de données -->
          <!-- 4 boutons d'action -->
```

#### 4. Pagination
```html
<div class="d-flex justify-content-between">
  <span> <!-- Compteur -->
  <nav>
    <ul class="pagination">
      <!-- Boutons pagination -->
```

#### 5. Modal
```html
<div class="modal d-block">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header"> <!-- Gradient -->
      <div class="modal-body"> <!-- Contenu variable -->
      <div class="modal-footer"> <!-- Actions -->
```

---

## 4. Flux d'Exécution

### Chargement Initial
```
Montage Component
    ↓
useEffect(() => { fetchLivreurs() })
    ↓
API GET /livreurs
    ↓
setLivreurs(data)
    ↓
useEffect filtres exécuté
    ↓
Affichage tableau
```

### Création d'un Livreur
```
Clic "Ajouter Livreur"
    ↓
handleOpenCreateModal()
    ↓
Modal affichée (mode create)
    ↓
Utilisateur remplit formulaire
    ↓
Clic "Créer Livreur"
    ↓
validateForm()
    ↓
handleCreateLivreur()
    ↓
API POST /livreurs
    ↓
fetchLivreurs() (rafraîchir)
    ↓
closeModal()
    ↓
Notification succès
```

### Modification d'un Livreur
```
Clic bouton ✏️ (Modifier)
    ↓
handleOpenEditModal(livreur)
    ↓
Modal affichée (mode edit)
    ↓
Utilisateur modifie champs
    ↓
Clic "Enregistrer"
    ↓
validateForm()
    ↓
handleUpdateLivreur()
    ↓
API PUT /livreurs/{id}
    ↓
fetchLivreurs() (rafraîchir)
    ↓
closeModal()
    ↓
Notification succès
```

### Suppression d'un Livreur
```
Mode édition, clic "Supprimer"
    ↓
window.confirm("Êtes-vous sûr?")
    ↓
handleDeleteLivreur()
    ↓
API DELETE /livreurs/{id}
    ↓
fetchLivreurs() (rafraîchir)
    ↓
closeModal()
    ↓
Notification succès
```

### Filtrage en Temps Réel
```
Utilisateur tape dans recherche
    ↓
setSearchTerm() │ setState
    ↓
useEffect se déclenche
    ↓ (re-filtrage)
Applique tous les filtres
    ↓
setFilteredLivreurs()
    ↓
Tableau se réaffiche
    ↓
Pagination réinitialisée
```

---

## 5. Gestion des Erreurs

### Try-Catch Pattern
```javascript
try {
  setLoading(key, true)
  // Appel API
  // Mise à jour state
  handleSuccess(message)
} catch (error) {
  handleApiError(error)  // Affiche message erreur
} finally {
  setLoading(key, false)  // Désactive loading spinner
}
```

### Erreurs de Validation
```javascript
if (!validateForm()) {
  // formErrors contient les erreurs
  // Aucun appel API
  return
}
```

### Confirmations
```javascript
if (!window.confirm(message)) {
  return  // Utilisateur a annulé
}
```

---

## 6. Performance

### Optimisations Implémentées
✅ **Filtering côté frontend** : Pas d'API call lors du filtrage
✅ **Pagination** : Affiche seulement 10 éléments à la fois
✅ **useEffect dépendances** : Re-rendu seulement quand nécessaire
✅ **Loading states** : Évite les doubles soumissions
✅ **Memoization potentielle** : getData functions peuvent être memoizées

### Points d'Amélioration Futurs
- Utiliser `useMemo` pour les données filtrées
- Utiliser `useCallback` pour les handlers
- Implémenter la recherche côté serveur pour grandes listes
- Ajouter debounce sur la recherche

---

## 7. Sécurité

### Validation Frontend
✅ Validation complète avant soumission
✅ Email unique contrôlé
✅ Password complexité stricte
✅ Format téléphone spécifique
✅ Messages d'erreur informatifs

### Sécurité API
✅ JWT authentification (via api.js)
✅ Role check : Admin uniquement
✅ Validation backend requise aussi
✅ Pas de données sensibles en réponse

### XSS Protection
✅ Les données sont échappées automatiquement (React)
✅ Pas d'innerHTML utilisé
✅ Event handlers normalisés

---

## 8. Testing

### Points de Test à Couvrir
- [ ] Validation du formulaire (tous les cas d'erreur)
- [ ] Création avec données valides
- [ ] Création avec données invalides
- [ ] Mise à jour des champs modifiables
- [ ] Vérification email unique
- [ ] Filtrage (chaque filtre indépendamment)
- [ ] Tri (chaque option)
- [ ] Pagination (navigation, affichage count)
- [ ] Suppression avec confirmation
- [ ] Toggle status
- [ ] Modal transitions (create→view, edit→view, etc)
- [ ] Responsive layout (mobile/tablet/desktop)

### Exemple de Test
```javascript
describe('Livreurs CRUD', () => {
  it('should validate email format', () => {
    // validateEmail("test@example.com") => true
    // validateEmail("invalid") => false
  })
  
  it('should create livreur with valid data', () => {
    // Remplit formulaire
    // Clique créer
    // Vérifier API POST appelée
    // Vérifier notification succès
    // Vérifier tableau mis à jour
  })
  
  it('should filter by status', () => {
    // Sélectionne filtre "Disponible"
    // Vérifier setFilteredLivreurs réexécuté
    // Vérifier tableau ne montre que les disponibles
  })
})
```

---

## 9. Débogage

### Chrome DevTools
F12 → Onglets utiles :
- **Console** : Erreurs, logs
- **Network** : Appels API, réponses
- **React DevTools** : État, props, renders
- **Redux DevTools** : State management (si utilisé)

### Logs Utiles à Ajouter
```javascript
console.log({ formData, formErrors })           // Debug form
console.log({ filteredLivreurs, sortBy })     // Debug filters
console.log("State livreurs:", livreurs)       // Debug data
console.error("API Error:", error)             // Debug errors
```

### Erreurs Communes
1. **API 404** : Endpoint incorrect ou livreur n'existe pas
2. **Email unique fail** : Email déjà utilisé
3. **Validation fail** : Données invalides
4. **CORS error** : Configuration backend
5. **State not updating** : Vérifier dépendances useEffect

---

## 10. Documentation pour Futurs Développeurs

### Avant de Modifier :
1. Lire ce document
2. Comprendre le flux d'exécution
3. Vérifier les tests
4. Faire un backup

### Conventions :
- Nommage : camelCase pour variables, PascalCase pour composants
- Indentation : 2 espaces
- Comments : Expliquer le "pourquoi" pas le "quoi"
- Error handling : Toujours utiliser try-catch pour API

### Fichiers Importants :
- `Livreurs.jsx` : Composant principal
- `userService.js` : Appels API
- `AuthContext.jsx` : Authentication
- `api.js` : Configuration axios

---

**Document créé le 27/03/2024 - Version 1.0**
