const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

const PORT = process.env.PORT || 5000;

// Connect to Database
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB Connected');

  app.listen(PORT, '0.0.0.0',() => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Database connection error:', err);
});
