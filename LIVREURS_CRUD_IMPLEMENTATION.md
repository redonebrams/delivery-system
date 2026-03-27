# 📋 Gestion des Livreurs - Documentation Complète

## 1. Vue d'ensemble

La page **Gestion des Livreurs** est une interface administrative complète pour gérer tous les livreurs de la plateforme. Elle offre des fonctionnalités CRUD (Create, Read, Update, Delete) complètes avec validation, filtrage, recherche et statistiques.

---

## 2. Fonctionnalités Principales

### 2.1 Tableau de Bord Statistique
- **Livreurs Totaux** : Affiche le nombre total de livreurs enregistrés
- **Disponibles** : Compte les livreurs avec le statut "disponible"
- **En Livraison** : Nombre de livreurs actuellement en cours de livraison
- **Inactifs** : Livreurs désactivés par l'administrateur

Chaque statistique est affichée dans une carte colorée avec dégradé pour une meilleure visibilité.

### 2.2 Système de Filtrage Avancé
- **Recherche Textuelle** : Recherche rapide par nom, prénom, email ou téléphone
- **Filtre par Statut** : Tous / Disponible / En Livraison / Inactif
- **Filtre par Type de Véhicule** : Tous / Moto / Voiture / Vélo
- **Tri** : Par nom (A-Z), Statut, ou Nombre de Livraisons
- **Bouton Réinitialiser** : Remet tous les filtres à zéro

### 2.3 Tableau Complet des Livreurs
Le tableau affiche les colonnes suivantes pour chaque livreur :
| Colonne | Description |
|---------|------------|
| **Nom Complet** | Prénom + Nom du livreur |
| **Email** | Adresse email de connexion |
| **Téléphone** | Numéro de contact |
| **Véhicule** | Type de véhicule (Moto 🏍️, Voiture 🚗, Vélo 🚲) avec icône |
| **Statut** | Badge coloré (Disponible 🟢, En livraison 🔵, Inactif 🔴) |
| **Livraisons** | Nombre total de livraisons effectuées |
| **Actions** | Boutons pour voir, modifier, statistiques, activer/désactiver |

### 2.4 Systèmes d'Actions
Chaque livreur dispose de 4 boutons d'action :

#### 👁️ Voir (Bleu)
- Ouvre une modal avec tous les détails du livreur
- Affiche : Prénom, Nom, Email, Téléphone, Type de Véhicule, Statut, Total de livraisons
- Permet de passer au mode édition ou de fermer

#### ✏️ Modifier (Orange)
- Ouvre la modal en mode édition
- Permet de modifier : Prénom, Nom, Téléphone, Type de Véhicule
- L'email ne peut pas être modifié (unique)
- Inclut un bouton "Supprimer" pour supprimer le livreur
- Validation en temps réel des champs

#### 📊 Statistiques (Rouge)
- Affiche un tableau de statistiques du livreur
- **Livraisons Aujourd'hui** : Nombre de livraisons du jour
- **En Cours** : Nombre de livraisons actuellement en cours
- **Total** : Nombre total de livraisons historiques
- **Historique** : Tableau des 10 dernières livraisons avec dates et statuts

#### 🔄 Activer/Désactiver (Vert/Rouge)
- Toggle rapide pour activer (icon: toggle-on) ou désactiver (icon: toggle-off)
- Change immédiatement le statut du livreur
- Le livreur inactif ne peut pas recevoir de nouvelles commandes

### 2.5 CRUD Complet

#### CREATE - Ajouter un Livreur
**Bouton** : "Ajouter Livreur" (bouton gradient bleu dans les filtres)

**Formulaire avec Validation :**
- **Prénom** (obligatoire)
- **Nom** (obligatoire)
- **Email** (obligatoire, unique, validé)
  - Format : `nom@domaine.com`
  - Vérification de l'unicité
- **Téléphone** (obligatoire, format marocain)
  - Format : `06XXXXXXXX` ou `07XXXXXXXX` (10 chiffres)
  - Exemple : 0612345678, 0712345678
- **Type de Véhicule** (Moto, Voiture, Vélo)
- **Mot de Passe** (obligatoire, validation stricte)
  - Minimum 8 caractères
  - Au moins 1 lettre majuscule (A-Z)
  - Au moins 1 lettre minuscule (a-z)
  - Au moins 1 chiffre (0-9)
  - Exemple : `SecurePass123`
- **Confirmer Mot de Passe** (doit correspondre au premier)

**Exemple de Mot de Passe Valide :**
- ✅ `SecurePass123`
- ✅ `Livreur2024`
- ❌ `password` (pas de majuscule ni chiffre)
- ❌ `PASS123` (pas de minuscule)
- ❌ `Pass123` (8 caractères minimum requis)

#### READ - Voir Détails
- Afficher tous les détails du livreur
- Voir le nombre total de livraisons
- Accéder directement à la modificationou aux statistiques

#### UPDATE - Modifier
- Modal en mode édition pour les champs modifiables
- Validation des champs
- Confirmation avant enregistrement
- Messages de succès/erreur

#### DELETE - Supprimer
- Disponible dans le mode édition
- Confirmation de suppression requise
- Impossible de récupérer après suppression

### 2.6 Pagination
- Affiche 10 livreurs par page
- Navigation : Précédent / Numéros de page / Suivant
- Affichage du nombre d'éléments actuels
- Mise à jour automatique lors du filtre/recherche

---

## 3. Validation des Données

### Email
- Format standard : `utilisateur@domaine.extension`
- Validé lors de la création
- Uniqueness : Email ne peut pas être dupliqué
- Non modifiable après création

### Téléphone (Marocain - Obligatoire)
- **Format** : 06 ou 07 suivi de 8 chiffres
- **Exemples Valides** :
  - 0612345678
  - 0712345678
  - 06 12 34 56 78 (avec espaces - gérés automatiquement)
- **Exemples Invalides** :
  - 0512345678 (commence par 05)
  - 061234567 (seulement 9 chiffres)
  - +212612345678 (format international - non accepté)

### Mot de Passe (Création uniquement)
- **Minimum** : 8 caractères
- **Complexité** : 1 Maj + 1 min + 1 chiffre
- **Règles** :
  - Aucun espacement autorisé en début/fin
  - Sensible à la casse

### Type de Véhicule
- Options : Moto, Voiture, Vélo
- Icône correspondante affichée dans le tableau
- Modifiable après création

---

## 4. Flux d'Utilisation Typiques

### Créer un Nouveau Livreur
```
1. Cliquer sur "Ajouter Livreur"
2. Remplir le formulaire :
   - Prénom : "Ahmed"
   - Nom : "Hassan"
   - Email : "ahmed.hassan@email.com"
   - Téléphone : "0612345678"
   - Type Véhicule : "Moto"
   - Mot de Passe : "SecurePass123"
   - Confirmer : "SecurePass123"
3. Cliquer "Créer Livreur"
4. Notification succès ✓
5. Nouvelle ligne apparaît dans le tableau
```

### Modifier un Livreur Existant
```
1. Dans le tableau, cliquer sur l'icône ✏️ (Modifier)
2. La modal s'ouvre en édition
3. Modifier les champs nécessaires :
   - Prénom, Nom, Téléphone, Type Véhicule
4. Cliquer "Enregistrer"
5. Notification succès ✓
```

### Voir les Statistiques
```
1. Cliquer sur l'icône 📊 (Statistiques)
2. La modal affiche :
   - 3 cartes avec stats (Aujourd'hui, En cours, Total)
   - Tableau des 10 dernières livraisons
3. Fermer la modal
```

### Désactiver/Activer un Livreur
```
1. Localisez le livreur dans le tableau
2. Cliquez sur l'icône 🔄 (toggle)
3. Le statut change immédiatement
4. Notification succès ✓
5. Badge "Inactif" apparaît dans le tableau
```

### Filtrer et Rechercher
```
1. Utilisez la barre "Rechercher par nom, email..." en haut
2. Sélectionnez un filtre de statut
3. Sélectionnez un filtre de véhicule
4. Sélectionnez un tri
5. Les résultats se mettent à jour en temps réel
6. Pagination s'ajuste automatiquement
```

---

## 5. Architecture Technique

### États (useState)
```javascript
livreurs                  // Tous les livreurs de la BDD
selectedLivreur          // Livreur actuellement sélectionné
showModal                // Affichage/masquage de la modal
modalMode                // View (consultation) / Edit (édition) / Create (création) / Stats (statistiques)
formData                 // Données saisies dans le formulaire
formErrors               // Liste des erreurs de validation
searchTerm               // Terme de recherche
statusFilter             // Filtre par statut
vehicleFilter            // Filtre par type de véhicule
filteredLivreurs         // Livreurs affichés après filtres
livreurStats             // Statistiques du livreur sélectionné
deliveriesHistory        // Historique des livraisons
sortBy                   // Critère de tri actuel
currentPage              // Numéro de la page actuelle
```

### Fonctions Principales
| Fonction | Objectif |
|----------|----------|
| `fetchLivreurs()` | Récupère la liste complète des livreurs |
| `validateForm()` | Valide tous les champs du formulaire |
| `handleOpenCreateModal()` | Ouvre la modal de création |
| `handleOpenEditModal()` | Ouvre la modal d'édition |
| `handleOpenViewModal()` | Ouvre la modal de consultation |
| `handleOpenStatsModal()` | Ouvre la modal de statistiques |
| `handleCreateLivreur()` | Crée un nouveau livreur |
| `handleUpdateLivreur()` | Met à jour un livreur existant |
| `handleDeleteLivreur()` | Supprime un livreur |
| `handleToggleStatus()` | Bascule entre actif/inactif |

### API Endpoints Utilisés
```
GET    /api/livreurs              // Récupère tous les livreurs
POST   /api/livreurs              // Crée un nouveau livreur
PUT    /api/livreurs/{id}         // Met à jour un livreur
DELETE /api/livreurs/{id}         // Supprime un livreur
GET    /api/livreurs/{id}/stats   // Détails + statistiques
GET    /api/livreurs/{id}/deliveries // Historique des livraisons
```

---

## 6. Design et UX

### Palette de Couleurs
- **Gradient Principal** : Bleu (#2563eb) → Cyan (#0ea5e9)
- **Succès** : Vert (#10b981)
- **Info** : Bleu-Ciel (#0ea5e9)
- **Avertissement** : Orange (#f59e0b)
- **Erreur** : Rouge (#ef4444)
- **Arrière-plan** : Gris très clair (#f8fafc)
- **Bordures** : Gris clair (#e2e8f0)
- **Texte** : Gris foncé (#1e293b)

### Icônes Bootstrap
- `bi-plus-circle` : Ajouter
- `bi-eye` : Voir
- `bi-pencil` : Modifier
- `bi-graph-up` : Statistiques
- `bi-toggle-on/off` : Activer/Désactiver
- `bi-truck` : Livreurs
- `bi-fire/car-front/bicycle` : Types de véhicules
- `bi-check-circle` : Disponible
- `bi-box-seam` : En livraison
- `bi-x-circle` : Inactif

### Responsive Design
- Mobile (< 768px) : Adaptation des colonnes
- Tablette (768px - 992px) : Grille 2-3 colonnes
- Desktop (> 992px) : Grille complète 4 colonnes pour les stats

---

## 7. Messages et Notifications

### Succès
- ✅ "Livreur créé avec succès!"
- ✅ "Livreur mis à jour avec succès!"
- ✅ "Livreur supprimé avec succès!"
- ✅ "Livreur activé!"
- ✅ "Livreur désactivé!"

### Erreurs de Validation
- ❌ "Le nom est requis"
- ❌ "Le prénom est requis"
- ❌ "L'email est requis"
- ❌ "Format email invalide"
- ❌ "Le téléphone est requis"
- ❌ "Format marocain requis (06/07XXXXXXXX)"
- ❌ "Le mot de passe est requis"
- ❌ "Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre"
- ❌ "Les mots de passe ne correspondent pas"

---

## 8. Sécurité

✅ **Authentification** : Vérification JWT via middleware AuthContext
✅ **Autorisation** : Rôle Admin obligatoire (middleware roleMiddleware)
✅ **Validation Frontend** : Validation complète avant soumission
✅ **Validation Backend** : Double validation côté serveur
✅ **Email Unique** : Vérification d'unicité côté backend
✅ **Mot de passe Sécurisé** : Hash stocké (ne jamais en clair)
✅ **XSS Protection** : Normalisation et échappement des entrées
✅ **CSRF Protection** : Token inclus dans les requêtes API

---

## 9. Améliorations Possibles (Futures)

- [ ] Upload de photo de profil avec prévisualisation
- [ ] Export CSV/PDF de la liste des livreurs
- [ ] Graphique d'activité en temps réel
- [ ] Bulk actions (activation/désactivation multiple)
- [ ] Historique détaillé des modificationss
- [ ] Assignation de zones de livraison par livreur
- [ ] Évaluation/Notes des livraisons
- [ ] Module manquante de réinitialisation de mot de passe

---

## 10. Intégration avec les Services

### userService.js (Mis à jour)
```javascript
export const getLivreurs = async ()           // Récupère tous
export const getLivreurById = async (id)      // Détails d'un
export const createLivreur = async (data)     // Créer
export const updateLivreur = async (id, data) // Modifier
export const removeLivreur = async (id)       // Supprimer
export const getLivreurStats = async (id)     // Stats spécifiques
export const getLivreurDeliveries = async (id) // Historique
```

---

## 11. Dépannage

### La liste ne se charge pas
→ Vérifier la connexion API et l'authentification

### Les filtres ne fonctionnent pas
→ Vérifier que les données contiennent les champs attendus

### Erreur "Email déjà utilisé"
→ Cet email existe déjà dans la base de données

### Erreur de validation du mot de passe
→ Vérifier : 8+ caractères, 1 Maj, 1 min, 1 chiffre

### Erreur de format téléphone
→ Utiliser le format marocain : 06 ou 07 + 8 chiffres

---

## 12. Exemple de Données Test

```json
{
  "nom": "Hassan",
  "prenom": "Ahmed",
  "email": "ahmed.hassan@email.com",
  "telephone": "0612345678",
  "password": "SecurePass123",
  "type_vehicule": "moto",
  "statut": "disponible",
  "total_livraisons": 45
}
```

---

**Dernière mise à jour** : 2024-2025
**Version** : 1.0 - Complète avec CRUD + Validation + Statistiques + Filtres
**Statut** : ✅ Production Ready
