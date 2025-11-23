const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const listingRoutes = require('./routes/listings');
const orderRoutes = require('./routes/orders');
const chatRoutes = require('./routes/chats');
const adminRoutes = require('./routes/admin');
const priceRoutes = require('./routes/prices');
const diseaseRoutes = require('./routes/diseaseRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

connectDB();

//app.use(cors("*"));
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://agrifarmio.netlify.app', // Your actual Netlify domain
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

app.use('/api/users', require('./routes/users'));
app.use('/api/listings', listingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/prices', priceRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/lands', require('./routes/lands'));
app.use('/api/disease', diseaseRoutes);
app.use('/api/chatbot', chatbotRoutes);

io.on('connection', (socket) => {
  socket.on('joinChat', ({ listingId, userId }) => {
    socket.join(listingId);
  });

  socket.on('sendMessage', ({ listingId, userId, message }) => {
    io.to(listingId).emit('message', { userId, message, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
app.get("/", (req, res) => {
  res.send({"msg": "BACKEND HOSTED SUCCESSFULLY"});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
