const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/commandes', require('./routes/commandeRoutes'));
app.use('/api/livreurs', require('./routes/livreurRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
