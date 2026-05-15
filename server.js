const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet({ contentSecurityPolicy: false }));

app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many attempts, please try again later' }
}));

// Routes
app.use(express.static('public'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./middleware/auth').protect, require('./routes/patients'));
app.use('/api/rooms',    require('./middleware/auth').protect, require('./routes/rooms'));

// Start server immediately so Cloud Run health check passes
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Connect to MongoDB separately
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));
