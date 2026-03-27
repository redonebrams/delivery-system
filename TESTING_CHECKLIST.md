# Testing Checklist - Delivery System

## Pre-Testing Setup
- [ ] MySQL server is running
- [ ] Backend .env file configured with database credentials
- [ ] Frontend .env configured (if needed)
- [ ] `delivery_db.sql` imported into MySQL
- [ ] Backend started: `npm run dev` from backend folder
- [ ] Frontend started: `npm run dev` from frontend folder
- [ ] Browser console open (F12) to check for errors

---

## 1. Authentication Flow ✅

### Registration
- [ ] Navigate to Register page
- [ ] Fill in: Email, Password, Full Name, Phone Number
- [ ] Select role (client)
- [ ] Submit and verify success message
- [ ] Check database: `SELECT * FROM users WHERE role='client';`
- [ ] Should see new user with hashed password

### Login
- [ ] Navigate to Login page
- [ ] Login with registered credentials
- [ ] Verify dashboard loads correctly
- [ ] Check localStorage has token: `localStorage.getItem('token')`
- [ ] Check user data: `localStorage.getItem('userData')`
- [ ] Logout and verify redirect to login page

### Role-Based Access
- [ ] Register as client, login, verify client dashboard
- [ ] Register as livreur, login, verify livreur dashboard
- [ ] Register as admin (database), login, verify admin dashboard
- [ ] Try accessing `/admin` as client, should be blocked/not visible
- [ ] Check network tab for 401 errors on restricted routes

---

## 2. Client Page Tests ✅

### Login as Client
### Dashboard
- [ ] Page loads without errors
- [ ] Shows greeting with user name
- [ ] Recent orders load (if any exist)

### New Order (NewOrder.jsx)
- [ ] Type dropdown: All 4 types available (Restaurant, Pharmacie, Colis, Courses)
- [ ] Pickup address field accepts input
- [ ] Delivery address field accepts input
- [ ] Distance field accepts numbers
- [ ] Price calculates automatically: `price = 15 + (distance * 3)`
- [ ] Payment mode selector works (Cash, Card)
- [ ] Submit button creates order
- [ ] Success message appears
- [ ] Order appears in Order History

### Order History (OrderHistory.jsx)
- [ ] Table shows all client's orders
- [ ] Columns: ID, Type, Distance, Price, Status, Date, Actions
- [ ] Click order row shows details modal
- [ ] Filter/sort buttons work (if implemented)

### Order Details (OrderDetails.jsx)
- [ ] Modal shows full order info
- [ ] Timeline shows status progression
- [ ] Statuses: en_attente → assignee → en_retrait → recuperee → livree
- [ ] Close button works

### Profile (Profile.jsx)
- [ ] Shows user information
- [ ] Edit form works (or readonly display)
- [ ] Changes save to database
- [ ] No password/role changes allowed

---

## 3. Livreur Page Tests ✅

### Login as Livreur
### Dashboard
- [ ] Stats cards load:
  - [ ] "Livraisons Aujourd'hui" shows count
  - [ ] "Total Livraisons" shows count  
  - [ ] "Livraisons Actives" shows count
- [ ] Recent deliveries table shows
- [ ] No errors in console

### My Deliveries (MyDeliveries.jsx)
- [ ] Filter buttons work:
  - [ ] "Tous" shows all deliveries
  - [ ] "En Cours" shows only active
  - [ ] "Complétées" shows completed
  - [ ] "Annulées" shows cancelled
- [ ] Cards display delivery info (pickup/dropoff addresses)
- [ ] Status buttons allow state changes
- [ ] Click card opens delivery details

### Delivery Details (DeliveryDetails.jsx)
- [ ] Shows full order details
- [ ] Displays timeline of status changes
- [ ] Address and contact info visible
- [ ] Customer notes visible (if provided)

---

## 4. Admin Page Tests ✅

### Login as Admin
### Dashboard
- [ ] Statistics load:
  - [ ] Total orders count
  - [ ] Total revenue calculation
  - [ ] Pending orders count
  - [ ] Active livreurs count
- [ ] Recent orders table shows
- [ ] Charts display (or placeholders)

### Orders Management (Orders.jsx)
- [ ] Table shows all orders with:
  - [ ] Client name
  - [ ] Type
  - [ ] Status
  - [ ] Distance
  - [ ] Price
  - [ ] Assigned Livreur
- [ ] Assign button:
  - [ ] Modal opens with livreur dropdown
  - [ ] Can select from available livreurs
  - [ ] Assigns livreur and updates table
- [ ] Status update button:
  - [ ] Shows status options
  - [ ] Updates order status
  - [ ] Table reflects change  
- [ ] Delete button:
  - [ ] Removes order from table
  - [ ] Database record deleted
- [ ] Search/filter (if implemented)

### Clients Management (Clients.jsx)
- [ ] Table shows all clients with:
  - [ ] Email
  - [ ] Name
  - [ ] Phone
  - [ ] Account creation date
  - [ ] Actions (edit/delete)
- [ ] View details button shows client info
- [ ] Delete button removes client
- [ ] Count updates after add/delete

### Livreurs Management (Livreurs.jsx)  
- [ ] Table shows all livreurs with:
  - [ ] Name
  - [ ] Email
  - [ ] Phone
  - [ ] Vehicle type
  - [ ] Status (active/inactive)
  - [ ] Total deliveries count
- [ ] Create button (if implemented)
- [ ] Edit/delete buttons work
- [ ] Status changes reflect

### Settings (Settings.jsx)
- [ ] Load current pricing:
  - [ ] Prix de base: 15 MAD
  - [ ] Tarif par km: 3 MAD
- [ ] Edit values in inputs
- [ ] Save button updates database
- [ ] Success message appears
- [ ] Reload page, values persist

---

## 5. API Integration Tests ✅

### Network Requests
- [ ] Check browser Network tab (F12)
- [ ] Login request:
  - [ ] POST /api/auth/login
  - [ ] Response includes token and user data
  - [ ] Status 200
- [ ] Fetch orders request:
  - [ ] GET /api/commandes
  - [ ] Response is JSON array
  - [ ] Status 200
- [ ] Create order request:
  - [ ] POST /api/commandes  
  - [ ] Request body has all fields
  - [ ] Status 201
  - [ ] Response includes order ID

### Response Formats
- [ ] All responses follow format: `{success, data, message}`
- [ ] Error responses set `success: false`
- [ ] Messages are in French
- [ ] Data structure matches database schema

### Error Handling
- [ ] 401 Unauthorized - No token
- [ ] 403 Forbidden - Insufficient permissions
- [ ] 400 Bad Request - Invalid data
- [ ] 500 Server Error - Database error
- [ ] All show error toast notifications

---

## 6. Validation Tests ✅

### Client Registration
- [ ] Empty fields blocked: Show error message
- [ ] Invalid email format: Show error message
- [ ] Password too short (< 8 chars): Show error message
- [ ] Phone format validation (Moroccan): Works correctly
- [ ] Duplicate email: Shows error

### Order Creation
- [ ] Empty fields blocked
- [ ] Distance must be number > 0
- [ ] Price calculates correctly
- [ ] All required fields checked

### Settings Form
- [ ] Prix de base must be number > 0
- [ ] Tarif par km must be number > 0
- [ ] Empty values blocked

---

## 7. State Management Tests ✅

### Authentication Context
- [ ] User data persists on page reload
- [ ] Token stored in localStorage
- [ ] Logout clears user data
- [ ] Unauthorized requests clear auth

### Error Context
- [ ] Error messages display in toast
- [ ] Auto-dismiss after ~5 seconds
- [ ] Multiple errors queue properly
- [ ] Success messages show in green

### Loading Context
- [ ] Spinners show during data fetch
- [ ] Buttons disabled while loading
- [ ] Multiple parallel requests handled
- [ ] Loading clears after completion

---

## 8. Database Tests ✅

### Users Table
```sql
SELECT COUNT(*) FROM users;
SELECT * FROM users WHERE role='client' LIMIT 1;
SELECT * FROM users WHERE role='livreur' LIMIT 1;
SELECT * FROM users WHERE role='admin' LIMIT 1;
```

### Commandes Table
```sql
SELECT COUNT(*) FROM commandes;
SELECT * FROM commandes WHERE statut='en_attente' LIMIT 1;
SELECT * FROM commandes WHERE livreur_id IS NOT NULL LIMIT 1;
```

### Price Calculation
```sql
SELECT id, distance_km, prix_livraison FROM commandes LIMIT 5;
-- Verify: prix_livraison = 15 + (distance_km * 3)
```

### Status History
```sql
SELECT * FROM statushistoriques ORDER BY created_at DESC LIMIT 10;
```

---

## 9. UI/UX Tests ✅

### Responsive Design
- [ ] Desktop (1920px): Layout works
- [ ] Tablet (768px): Layout adjusts
- [ ] Mobile (375px): Layout responsive
- [ ] No horizontal scroll

### Bootstrap Components
- [ ] Buttons have hover effects
- [ ] Inputs have focus states
- [ ] Modals close properly
- [ ] Dropdowns expand/collapse
- [ ] Tables scroll on small screens
- [ ] Forms stack vertically on mobile

### User Experience
- [ ] Loading spinners appear during waits
- [ ] Success messages clear/auto-dismiss
- [ ] Error messages are informative
- [ ] Buttons disabled during submission
- [ ] Forms clear after successful submit
- [ ] Navigation works smoothly

---

## 10. Performance Tests ✅

### Initial Load
- [ ] Frontend loads in < 3 seconds
- [ ] No console errors
- [ ] No warnings (or only non-critical)

### Data Fetch Performance  
- [ ] Getting 100 orders: < 1 second
- [ ] Creating order: < 1 second
- [ ] Updating status: < 500ms

### Asset Size
```bash
cd frontend && npm run build
# Check dist/ folder size (should be < 500KB)
```

---

## 11. Security Tests ✅

### Authentication
- [ ] Cannot access /admin without admin token
- [ ] Cannot access /livreur without livreur token
- [ ] Token expires after 24 hours
- [ ] Logout clears token immediately

### Authorization
- [ ] Client can only see own orders
- [ ] Livreur can only see assigned orders
- [ ] Admin sees all orders
- [ ] Non-admin cannot delete orders

### Password Security
- [ ] Passwords not visible in console
- [ ] Password hashing in database (not plaintext)
- [ ] If forgot password, cannot guess/brute-force
- [ ] Session tokens are unique (different each login)

---

## 12. Cross-Browser Compatibility ✅

Test in:
- [ ] Chrome (current version)
- [ ] Firefox (current version)
- [ ] Safari (current version)
- [ ] Edge (current version)

Verify:
- [ ] Layouts render correctly
- [ ] Forms submit properly
- [ ] All features work

---

## 13. Full User Journeys ✅

### Complete Order Creation to Delivery
1. [ ] Client registers as "Ali Mohamed"
2. [ ] Client logs in
3. [ ] Client creates order:
   - Type: Restaurant
   - Pickup: "Restau Al Baraka, 123 Rue Principale"
   - Delivery: "Office, 456 Boulevard Central"
   - Distance: 5 km (Price: 15 + 15 = 30 MAD)
   - Payment: Cash
4. [ ] Admin logs in
5. [ ] Admin sees order in dashboard (status: en_attente)
6. [ ] Admin assigns to livreur "Fatima"
7. [ ] Livreur "Fatima" logs in
8. [ ] Livreur sees order in dashboard
9. [ ] Livreur marks as: en_retrait
10. [ ] Admin sees update (status: en_retrait)
11. [ ] Livreur marks as: recuperee
12. [ ] Livreur marks as: livree
13. [ ] Client sees order marked as delivered
14. [ ] Admin dashboard shows completed order

### Multi-User Concurrent Testing
1. [ ] Admin in one window
2. [ ] Client in another window
3. [ ] Livreur in third window
4. [ ] Create order as client
5. [ ] Assign as admin in real-time
6. [ ] Check livreur sees it immediately (refresh if needed)

---

## 14. Error Scenario Tests ✅

### Network Errors
- [ ] Unplug internet mid-operation
- [ ] Error message appears
- [ ] Retry button works
- [ ] Reconnect and complete transaction

### Database Connection Loss
- [ ] Stop MySQL server
- [ ] Try to create order
- [ ] Get database error message
- [ ] Restart MySQL
- [ ] Operations work again

### Invalid Input
- [ ] Try to assign 0 distance: Blocked
- [ ] Try to assign negative price: Blocked
- [ ] Try to create account with duplicate email: Error
- [ ] All show appropriate error messages

### Token Expiration
- [ ] Create order successfully
- [ ] Wait for token expiration (or manually set expiry to 1 minute)
- [ ] Try another operation after expiry
- [ ] Get 401 error, redirect to login
- [ ] Login again, can continue

---

## Summary Checklist
- [ ] All authentication flows work
- [ ] All user roles access correct pages
- [ ] All CRUD operations (Create, Read, Update, Delete) work
- [ ] All API endpoints respond correctly
- [ ] Database updates properly
- [ ] No console errors or warnings
- [ ] Responsive on all screen sizes
- [ ] Forms validate correctly
- [ ] Loading states work
- [ ] Error handling works
- [ ] Users stay logged in after reload
- [ ] Can complete full order lifecycle

---

## Deployment Readiness Checklist
- [ ] All tests pass
- [ ] Zero console errors
- [ ] No sensitive data in frontend code
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] API CORS properly configured
- [ ] Frontend built: `npm run build`
- [ ] Backend ready: `npm start` or PM2
- [ ] Nginx/reverse proxy configured (if applicable)
- [ ] SSL certificate configured (HTTPS)
- [ ] Monitoring/logging set up

---

**Testing Date**: _______________  
**Tested By**: _______________  
**Status**: [ ] Ready to Deploy [ ] Needs Fixes
