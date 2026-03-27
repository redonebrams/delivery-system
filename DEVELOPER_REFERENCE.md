# Developer Quick Reference - Delivery System

## 🚀 Quick Start Commands

### Start Backend
```bash
cd backend
npm install  # First time only
npm run dev  # Start on localhost:5000
```

### Start Frontend  
```bash
cd frontend
npm install  # First time only
npm run dev  # Start on localhost:5173
```

### Setup Database
```bash
mysql -u root -p

# In MySQL prompt:
SOURCE /path/to/database/delivery_db.sql;

# Verify
USE delivery_db;
SHOW TABLES;
```

---

## 📁 Key Files Reference

### Backend Configuration
| File | Purpose |
|------|---------|
| `backend/.env` | Database credentials, JWT secret, port |
| `backend/server.js` | Express app initialization |
| `backend/config/database.js` | MySQL connection pool |
| `backend/config/corsOptions.js` | CORS configuration |
| `backend/middleware/authMiddleware.js` | JWT verification |
| `backend/middleware/errorHandler.js` | Error response formatting |

### Backend API Structure
| File | Endpoints |
|------|-----------|
| `routes/authRoutes.js` | /api/auth (login, register, me) |
| `routes/commandeRoutes.js` | /api/commandes (orders CRUD) |
| `routes/clientRoutes.js` | /api/clients (client management) |
| `routes/livreurRoutes.js` | /api/livreurs (delivery person mgmt) |
| `routes/statsRoutes.js` | /api/stats (analytics) |

### Frontend Structure
| Folder | Purpose |
|--------|---------|
| `src/pages/` | Page components (routed) |
| `src/components/` | Reusable UI components |
| `src/services/` | API call abstraction layer |
| `src/context/` | Global state management |
| `src/utils/` | Helper functions |
| `src/styles/` | CSS styling |

---

## 🔑 Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=delivery_db
JWT_SECRET=your_very_long_secret_key_min_32_chars
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
(Usually auto-handled, no .env needed)
```

---

## 🔗 API Contract

### Request Format
```javascript
// Standard request with JWT
GET /api/commandes
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

// Request body
POST /api/commandes
Headers: {
  "Authorization": "Bearer ...",
  "Content-Type": "application/json"
}
Body: {
  "type_commande": "Restaurant",
  "nom_retrait": "...",
  "adresse_retrait": "...",
  "nom_livraison": "...",
  "adresse_livraison": "...",
  "distance_km": 5,
  "mode_paiement": "cash"
}
```

### Response Format (All Endpoints)
```javascript
{
  "success": true,
  "data": { /* actual response */ },
  "message": "Success message"
}
```

### Status Codes
- `200` - OK (GET, PUT, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)  
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient permission)
- `500` - Server Error

---

## 👥 Database Schema Reference

### User Roles
```
client   - Regular customers
livreur  - Delivery persons
admin    - System administrators
```

### Order Statuses
```
en_attente   - Waiting for assignment
assignee     - Assigned to livreur
en_retrait   - Being picked up
recuperee    - Picked up, in transit
livree       - Delivered
annulee      - Cancelled
```

### Key Tables
```
users               - User accounts
commandes           - Orders/deliveries
livreurs            - Delivery person profiles
statushistoriques   - Order status changes
settings            - Configuration (pricing)
```

---

## 🔐 Authentication Flow

### Login Process
```
1. User submits credentials
   POST /api/auth/login {email, password}

2. Backend verifies:
   - User exists
   - Password matches hash
   - Account active

3. Server returns:
   {token: "JWT...", user: {id, role, name, ...}}

4. Frontend stores:
   - Token in localStorage['token']
   - User data in localStorage['userData']

5. Frontend redirects to role dashboard
   - /dashboard (client)
   - /livreur/dashboard (livreur)  
   - /admin/dashboard (admin)

6. All API calls include:
   Authorization: Bearer {token}
```

### Token Expiration
- Token lifetime: 24 hours
- Stored in: localStorage['token']
- Verified by: authMiddleware on every protected request
- On expiry: 401 response → redirect to login

---

## 📱 Frontend Services API

### orderService.js
```javascript
createOrder(data)              // POST /api/commandes
getOrders()                    // GET /api/commandes
getOrderById(id)               // GET /api/commandes/:id
updateOrder(id, data)          // PUT /api/commandes/:id
updateOrderStatus(id, status)  // PUT /api/commandes/:id/statut
assignLivreur(id, livreur_id)  // PUT /api/commandes/:id/assigner
deleteOrder(id)                // DELETE /api/commandes/:id
getAdminStats()                // GET /api/stats/dashboard
getTarifs()                    // GET /api/stats/tarifs
updateTarifs(data)             // PUT /api/stats/tarifs
getMyDeliveries()              // GET /api/livreurs/deliveries
getDeliveryById(id)            // GET /api/commandes/:id
```

### userService.js
```javascript
getLivreurs()                  // GET /api/livreurs
getLivreurStats()              // GET /api/livreurs/stats
getClients()                   // GET /api/clients
getClientById(id)              // GET /api/clients/:id
updateClient(id, data)         // PUT /api/clients/:id
removeClient(id)               // DELETE /api/clients/:id
```

### authService.js
```javascript
login(email, password)         // POST /api/auth/login
register(data)                 // POST /api/auth/register
logout()                       // Clears localStorage
```

---

## 🎨 React Component Patterns

### Page Component Template
```javascript
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import useError from '../../hooks/useError';
import useLoading from '../../hooks/useLoading';
import * as orderService from '../../services/orderService';

export default function MyPage() {
  const { handleApiError, handleSuccess } = useError();
  const { setLoading, isLoading } = useLoading();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading('myKey', true);
        const result = await orderService.getOrders();
        setData(Array.isArray(result) ? result : []);
        handleSuccess('Data loaded');
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading('myKey', false);
      }
    };

    fetchData();
  }, []);

  if (isLoading('myKey')) {
    return <div className="spinner-border" role="status">...</div>;
  }

  return (
    <div className="container mt-5">
      {/* Page content */}
    </div>
  );
}
```

### Using Error Context
```javascript
const { handleApiError, handleSuccess } = useError();

// For errors
try {
  await api.call();
} catch (error) {
  handleApiError(error); // Shows red toast
}

// For success
handleSuccess('Order created successfully'); // Shows green toast
```

### Using Loading Context
```javascript
const { setLoading, isLoading } = useLoading();

// Set loading
setLoading('ordersKey', true);

// Check loading
if (isLoading('ordersKey')) {
  // Show spinner
}

// Clear loading
setLoading('ordersKey', false);
```

---

## 🧪 Common Testing Scenarios

### Test Login
```javascript
// POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "role": "client",
      "nom": "Test",
      "prenom": "User"
    }
  }
}
```

### Test Create Order
```javascript
// POST /api/commandes
{
  "type_commande": "Restaurant",
  "nom_retrait": "Restaurant Name",
  "adresse_retrait": "123 Main St",
  "nom_livraison": "Customer Name",
  "adresse_livraison": "456 Side Ave",
  "distance_km": 5,
  "mode_paiement": "cash"
}

// Calculated in backend: 15 + (5 * 3) = 30 MAD
```

### Test Order Assignment
```javascript
// PUT /api/commandes/:id/assigner
{
  "livreur_id": 2
}

// Updates commande.livreur_id and statushistoriques
// Status changes to "assignee"
```

---

## 🐛 Debug Tips

### Enable Backend Logging
```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

### Check Database
```sql
-- Recent orders
SELECT * FROM commandes ORDER BY created_at DESC LIMIT 10;

-- Count by status
SELECT statut, COUNT(*) FROM commandes GROUP BY statut;

-- User orders
SELECT * FROM commandes WHERE client_id = 1;

-- Check JWT tokens
SELECT id, email, role FROM users;
```

### Frontend Console Tips
```javascript
// Check auth
console.log(localStorage.getItem('userData'));
console.log(localStorage.getItem('token'));

// Manually clear auth (testing)
localStorage.clear();

// Check context
// Use React DevTools → Components → Find Context Provider
```

### Network Debugging
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action
4. Check:
   - Request headers (has Authorization?)
   - Response status (200, 401, 500?)
   - Response body (correct format?)

---

## 📊 Price Calculation

```javascript
// Formula
const price = BASE_PRICE + (distance * PRICE_PER_KM);

// Defaults
const BASE_PRICE = 15;        // MAD
const PRICE_PER_KM = 3;       // MAD
const DEFAULT_DISTANCE = 5;   // km

// Example
distance = 10;
price = 15 + (10 * 3) = 45 MAD;
```

---

## 🚨 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Database connection failed" | MySQL not running | `sudo service mysql start` |
| "CORS error" | Frontend URL not in CORS config | Update `corsOptions.js` |
| "Invalid token" | Token expired/malformed | Login again |
| "401 Unauthorized" | Missing Authorization header | Check auth middleware |
| "Cannot POST /api/..." | Route not defined | Check `routes/` files |
| "Cannot read property X of undefined" | Data not loaded yet | Check for null/undefined |

---

## 📦 Dependencies

### Backend
```json
{
  "express": "5.2.0",
  "mysql2": "3.0.0",
  "jsonwebtoken": "9.0.0",
  "bcryptjs": "2.4.3",
  "cors": "2.8.5",
  "dotenv": "16.0.0"
}
```

### Frontend
```json
{
  "react": "19.2.0",
  "react-router-dom": "7.0.0",
  "axios": "1.13.0",
  "bootstrap": "5.3.0",
  "bootstrap-icons": "1.13.0",
  "vite": "7.0.0"
}
```

---

## 🔄 Git Workflow

```bash
# Check status
git status

# See changes
git diff

# Stage files
git add .

# Commit
git commit -m "Fix: description"

# Push
git push origin main

# View history
git log --oneline
```

---

## 📞 Support

### Documentation Files
- `IMPLEMENTATION_GUIDE.md` - Complete project guide
- `TESTING_CHECKLIST.md` - Full testing procedures
- `TODO.md` - Project tasks and status
- Backend code comments - Implementation details

### Quick Help
- Check console (F12) for errors
- Check Network tab for failed requests
- Enable SQL logging with: `npm run dev -- --verbose`
- Review error messages (usually self-explanatory)

---

**Last Updated**: March 26, 2026  
**Version**: 1.0  
**Status**: Ready for Use
