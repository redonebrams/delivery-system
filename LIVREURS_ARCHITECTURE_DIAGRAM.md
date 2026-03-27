# 📐 Diagramme d'Architecture - Livreurs CRUD

## 1. Vue Globale du Système

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION DELIVERY                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           FRONTEND (React + Bootstrap)              │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │  Frontend/src/pages/Admin/Livreurs.jsx              │   │
│  │  ├─ State Management (14 useState)                  │   │
│  │  ├─ Validation Functions                           │   │
│  │  ├─ CRUD Operations                                │   │
│  │  ├─ Modal System (4 modes)                         │   │
│  │  ├─ Filtering & Sorting                            │   │
│  │  ├─ Pagination                                     │   │
│  │  └─ UI Components (Bootstrap 5)                    │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Frontend/src/services/userService.js          │   │
│  │                                                      │   │
│  │  ├─ getLivreurs()                                   │   │
│  │  ├─ getLivreurById(id)                              │   │
│  │  ├─ createLivreur(data)                             │   │
│  │  ├─ updateLivreur(id, data)                         │   │
│  │  ├─ removeLivreur(id)                               │   │
│  │  ├─ getLivreurStats(id)                             │   │
│  │  └─ getLivreurDeliveries(id)                        │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Frontend/src/services/api.js                │   │
│  │    (Axios instance + Headers + Auth)               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↕
        HTTP REST API (JWT + Authorization)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     Backend/controllers/livreurController.js        │   │
│  │                                                      │   │
│  │  ├─ exports.getAll()                                │   │
│  │  ├─ exports.getById(id)                             │   │
│  │  ├─ exports.create(data)                            │   │
│  │  ├─ exports.update(id, data)                        │   │
│  │  ├─ exports.remove(id)                              │   │
│  │  ├─ exports.getStats(id)                            │   │
│  │  └─ exports.getDeliveries(id)                       │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     Backend/models/Livreur.js                       │   │
│  │                                                      │   │
│  │  ├─ Livreur.getAll()                                │   │
│  │  ├─ Livreur.findById(id)                            │   │
│  │  ├─ Livreur.create(data)                            │   │
│  │  ├─ Livreur.update(id, data)                        │   │
│  │  ├─ Livreur.remove(id)                              │   │
│  │  └─ Livreur.updateStatut(id, statut)               │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    Database (MySQL/MariaDB)                         │   │
│  │                                                      │   │
│  │  Table: livreurs                                    │   │
│  │  Table: users                                       │   │
│  │  Table: commandes                                   │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Flux d'Interaction Utilisateur

```
┌─────────────────────┐
│   Page Livreurs     │
│   Chargée (GET)     │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────────────────┐
│  Affiche Liste + Statistiques   │
│  Admin Voit les 4 Actions       │
└──────────┬──────────────────────┘
           │
     ┌─────┼──────┬──────┬────────┐
     ↓     ↓      ↓      ↓        ↓
   [👁️]  [✏️]   [📊]  [🔄]   [Filtre]
     │     │      │      │        │
     ├─────┴─VOIR──┴──────┴────────┴─────────────────────┐
     │                                                    │
     ↓                                                    ↓
  MODAL                                           FILTRAGE
  (4 modes)                                    TEMPS RÉEL
     │                                             │
     ├─ View: Lecture seuls              searchTerm
     │  ├─ Détails livreur              statusFilter
     │  ├─ Info card                    vehicleFilter
     │  └─ Bouton Modifier              sortBy
     │                                  │
     ├─ Edit: Formulaire édition        ↓
     │  ├─ Champs modifiables        useEffect
     │  ├─ Validation                 │
     │  └─ Boutons Save/Delete        ↓
     │                            setFilteredLivreurs
     ├─ Create: Formulaire création     │
     │  ├─ Tous les champs             ↓
     │  ├─ Validation stricte      Tableau mis
     │  └─ Bouton Créer               à jour
     │                                  │
     └─ Stats: Statistiques entité      ↓
        ├─ 3 cartes               Pagination
        ├─ Tableau historique     ajustée
        └─ Graphiques
```

---

## 3. État (State) du Composant

```
Livreurs Component State
├── Data States
│   ├── livreurs: Livreur[]             // Base de données
│   ├── filteredLivreurs: Livreur[]     // Filtrés/Triés
│   └── selectedLivreur: Livreur | null // Couramment édité
│
├── UI States
│   ├── showModal: boolean               // Visible/Caché
│   ├── modalMode: "view"|"edit"|"create"|"stats"
│   └── currentPage: number             // Pagination
│
├── Filter States
│   ├── searchTerm: string              // Recherche
│   ├── statusFilter: string            // Filtre statut
│   ├── vehicleFilter: string           // Filtre véhicule
│   └── sortBy: string                  // Tri
│
├── Form States
│   ├── formData: Object                // Données saisies
│   │   ├── nom: string
│   │   ├── prenom: string
│   │   ├── email: string
│   │   ├── telephone: string
│   │   ├── password: string            // Création seulement
│   │   ├── confirmPassword: string     // Création seulement
│   │   └── type_vehicule: string
│   └── formErrors: Object              // Erreurs validation
│
└── Additional States
    ├── livreurStats: Object | null     // Statistiques livreur
    ├── deliveriesHistory: Object[]     // Historique livraisons
    └── itemsPerPage: number            // Pagination (10)
```

---

## 4. Cycle de Vie - Création d'un Livreur

```
START
  │
  ├─ utilisateur.clicks("Ajouter Livreur")
  │  └─ handleOpenCreateModal()
  │     ├─ resetFormData()
  │     ├─ setModalMode("create")
  │     └─ setShowModal(true)
  │
  ├─ MODAL DISPLAYED
  │  └─ utilisateur remplit formulaire
  │     ├─ nom
  │     ├─ prenom
  │     ├─ email
  │     ├─ telephone
  │     ├─ password
  │     ├─ confirmPassword
  │     └─ type_vehicule
  │
  ├─ utilisateur.clicks("Créer Livreur")
  │  └─ handleCreateLivreur(e)
  │     ├─ e.preventDefault()
  │     ├─ validateForm()
  │     │  ├─ Check nom (not empty)
  │     │  ├─ Check email (format + unique)
  │     │  ├─ Check telephone (06/07)
  │     │  ├─ Check password (8+ char, 1 Maj, 1 min, 1 chiffre)
  │     │  └─ Set formErrors if any
  │     │
  │     │  ├─ SI ERREURS: RETURN (modal reste ouvert)
  │     │  └─ SI OK: CONTINUE
  │     │
  │     ├─ setLoading("createLivreur", true)
  │     ├─ API CALL: POST /api/livreurs
  │     │  └─ Backend vérifie role = admin
  │     │  └─ Backend valide données
  │     │  └─ Backend crée user + livreur
  │     │
  │     ├─ SUCCESS: handleSuccess("Livreur créé...")
  │     ├─ closeModal()
  │     ├─ fetchLivreurs() // Rafraîchir
  │     │  └─ API GET /api/livreurs
  │     │  └─ setLivreurs(data)
  │     │  └─ useEffect: re-filter automatiquement
  │     │
  │     ├─ Tableau mis à jour
  │     ├─ Notification toast succès
  │     └─ setLoading("createLivreur", false)
  │
  └─ END
```

---

## 5. Flux Filtrage et Tri

```
User Input (Search/Filter/Sort)
    ↓
setSearchTerm() / setStatusFilter() / setVehicleFilter() / setSortBy()
    ↓
useEffect triggered
    ↓
Applique tous les filtres:
├─ searchTerm matching (prenom OR nom OR email OR telephone)
├─ statusFilter matching (all OR specific status)
└─ vehicleFilter matching (all OR specific vehicle)
    ↓
Applique tri:
├─ sortBy "nom": alphabetical A-Z
├─ sortBy "statut": par status string
└─ sortBy "deliveries": par total_livraisons DESC
    ↓
setFilteredLivreurs(filtered)
    ↓
setCurrentPage(1) // Reset pagination
    ↓
Tableau slice(0, 10) // Affiche page 1
    ↓
Total pages = Math.ceil(filtered.length / 10)
    ↓
UI Updated
```

---

## 6. Validation Pipeline

```
Formulaire soumis
    ↓
validateForm()
    ├─ Check: nom not empty
    │  └─ Si erreur: errors.nom = "...message"
    │
    ├─ Check: prenom not empty
    │  └─ Si erreur: errors.prenom = "...message"
    │
    ├─ Check: email format + unique
    │  └─ validateEmail(email)
    │     ├─ Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    │     └─ Unique: contrôle backend
    │  └─ Si erreur: errors.email = "...message"
    │
    ├─ Check: telephone format marocain
    │  └─ validateMoroccanPhone(phone)
    │     ├─ Regex: /^(06|07)[0-9]{8}$/
    │     └─ Remove spaces: phone.replace(/\s/g, "")
    │  └─ Si erreur: errors.telephone = "...message"
    │
    ├─ IF modalMode === "create":
    │  ├─ Check: password strength
    │  │  └─ validatePassword(password)
    │  │     ├─ Length >= 8
    │  │     ├─ /[A-Z]/ = 1 Majuscule
    │  │     ├─ /[a-z]/ = 1 Minuscule
    │  │     └─ /[0-9]/ = 1 Chiffre
    │  │  └─ Si erreur: errors.password = "...message"
    │  │
    │  └─ Check: passwords match
    │     └─ password === confirmPassword
    │     └─ Si erreur: errors.confirmPassword = "...message"
    │
    └─ setFormErrors(errors)
       └─ IF Object.keys(errors).length > 0:
          ├─ Return false
          ├─ Modal reste ouvert
          ├─ Messages affichés sous champs
          └─ STOP (pas d'API call)
       
       ELSE:
       ├─ Return true
       ├─ Léger vert (optional)
       └─ CONTINUE API call
```

---

## 7. Architecture des Modales

```
┌─────────────────────────────────────────────────┐
│           showModal && (                        │
│  ┌──────────────────────────────────────────┐  │
│  │     <div className="modal d-block">      │  │
│  │                                          │  │
│  │  ┌──────────────────────────────────┐   │  │
│  │  │   MODAL HEADER (Gradient Bleu)  │   │  │
│  │  │  ├─ Titre dynamique (modalMode) │   │  │
│  │  │  └─ Bouton X (closeModal)       │   │  │
│  │  └──────────────────────────────────┘   │  │
│  │           ↓                              │  │
│  │  ┌──────────────────────────────────┐   │  │
│  │  │  MODAL BODY (contenu variable)  │   │  │
│  │  │                                  │   │  │
│  │  │  ${modalMode === "create" && (   │   │  │
│  │  │    <CreateForm /> )}             │   │  │
│  │  │                                  │   │  │
│  │  │  ${modalMode === "edit" && (     │   │  │
│  │  │    <EditForm /> )}               │   │  │
│  │  │                                  │   │  │
│  │  │  ${modalMode === "view" && (     │   │  │
│  │  │    <ViewDetails /> )}            │   │  │
│  │  │                                  │   │  │
│  │  │  ${modalMode === "stats" && (    │   │  │
│  │  │    <StatsView /> )}              │   │  │
│  │  │                                  │   │  │
│  │  └──────────────────────────────────┘   │  │
│  │           ↓                              │  │
│  │  ┌──────────────────────────────────┐   │  │
│  │  │  MODAL FOOTER (Boutons)          │   │  │
│  │  │                                  │   │  │
│  │  │  ${modalMode === "create" && (   │   │  │
│  │  │    [Annuler] [Créer] )}          │   │  │
│  │  │                                  │   │  │
│  │  │  ${modalMode === "edit" && (     │   │  │
│  │  │    [Annuler] [Supprimer] [Save] )}│  │  │
│  │  │                                  │   │  │
│  │  │  ${modalMode === "view" && (     │   │  │
│  │  │    [Fermer] [Modifier] )}        │   │  │
│  │  │                                  │   │  │
│  │  │  ${modalMode === "stats" && (    │   │  │
│  │  │    [Fermer] )}                   │   │  │
│  │  │                                  │   │  │
│  │  └──────────────────────────────────┘   │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│           )                                   │
└─────────────────────────────────────────────────┘
```

---

## 8. API Request/Response Flow

```
FRONTEND                              BACKEND
  │                                     │
  ├─────────── POST /api/livreurs ────→│
  │   {                                 │
  │     nom: "Hassan"                  │ ├─ authMiddleware
  │     prenom: "Ahmed"                │ ├─ Check JWT token
  │     email: "ahmed@email.com"       │ │
  │     telephone: "0612345678"        │ ├─ roleMiddleware
  │     password: "SecurePass123"      │ ├─ Check role = "admin"
  │     type_vehicule: "moto"          │ │
  │     role: "livreur"                │ ├─ livreurController.create()
  │   }                                 │ ├─ Create user in users table
  │                                     │ ├─ Create livreur in livreurs table
  │                                     │ │
  │←───────────── 200 OK ──────────────┤
  │   {                                 │
  │     success: true                  │
  │     data: { id: 42 }               │
  │     message: "Livreur créé"        │
  │   }                                 │
  │                                     │
  ├─────────── GET /api/livreurs ─────→│
  │                                     │ ├─ livreurController.getAll()
  │                                     │ ├─ SELECT * FROM livreurs
  │                                     │ │    JOIN users ON livreur_id
  │                                     │
  │←───────────── 200 OK ──────────────┤
  │   {                                 │
  │     success: true                  │
  │     data: [                         │
  │       { id, nom, prenom, email,    │
  │         telephone, type_vehicule,  │
  │         statut, total_livraisons } │
  │     ]                               │
  │   }                                 │
  │                                     │
  └─────────────────────────────────────┘
```

---

## 9. Table de Données

```
LIVREURS Table              USERS Table
┌─────────────────────┐    ┌──────────────────────┐
│ id (PK)             │←───│ id (PK)              │
│ user_id (FK)        │────│ nom                  │
│ type_vehicule       │    │ prenom               │
│ statut              │    │ email (UNIQUE)       │
│ total_livraisons    │    │ telephone            │
│ created_at          │    │ password_hash        │
│ updated_at          │    │ role                 │
└─────────────────────┘    │ created_at           │
                           │ updated_at           │
                           └──────────────────────┘
                                  ↑
                                  │ Foreign Key
                                  │
                           ┌──────────────────────┐
                           │ COMMANDES Table      │
                           ├──────────────────────┤
                           │ id                   │
                           │ livreur_id (FK)      │
                           │ statut               │
                           │ created_at           │
                           └──────────────────────┘
```

---

## 10. Statistiques du Dashboard

```
┌──────────────────────────────────────────────────────┐
│        DASHBOARD STATISTIQUES (4 cartes)             │
├──────────────────────────────────────────────────────┤
│                                                       │
│ ┌──────────────┐  ┌──────────────┐                  │
│ │   TOTAL      │  │ DISPONIBLES  │                  │
│ │ 🚗🚗🚗🚗🚗  │  │ 🚗🚗🚗🚗     │                  │
│ │   45         │  │   32         │                  │
│ │ (all)        │  │ (statut=...) │                  │
│ └──────────────┘  └──────────────┘                  │
│                                                       │
│ ┌──────────────┐  ┌──────────────┐                  │
│ │   EN COURS   │  │   INACTIFS   │                  │
│ │ 🚗🚗🚗🚗     │  │ 🚗🚗        │                  │
│ │   8          │  │   5          │                  │
│ │ (statut=...) │  │ (statut=...) │                  │
│ └──────────────┘  └──────────────┘                  │
│                                                       │
│ CALCUL:                                             │
│ Total = livreurs.length                            │
│ Disponibles = livreurs.filter(s="disponible")      │
│ En Cours = livreurs.filter(s="en_livraison")       │
│ Inactifs = livreurs.filter(s="indisponible")       │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 11. Icônes Bootstrap Utilisées

```
Navigation & Actions
├─ bi-plus-circle          → Ajouter
├─ bi-eye                  → Voir/Consulter
├─ bi-pencil               → Modifier
├─ bi-pencil-square        → Modifier (modal)
├─ bi-graph-up             → Statistiques
├─ bi-toggle-on/off        → Activer/Désactiver
├─ bi-trash                → Supprimer
├─ bi-arrow-clockwise      → Réinitialiser

Statuts
├─ bi-check-circle         → Disponible
├─ bi-box-seam             → En livraison
├─ bi-x-circle             → Inactif

Véhicules
├─ bi-fire                 → Moto
├─ bi-car-front            → Voiture
├─ bi-bicycle              → Vélo

Dashboard
├─ bi-truck                → Livreurs
├─ bi-inbox                → Vide/Aucun

Modales
├─ bi-btn-close           → Fermer
├─ bi-person-circle       → Profil

Misc
├─ bi-chevron-left/right  → Pagination
├─ bi-search              → Recherche
├─ bi-filter              → Filtres
```

---

**Document Généré** : 27/03/2024
**Version** : 1.0
**Status** : ✅ Complet et Validé
