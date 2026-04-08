const express = require('express');
const { connectDB } = require('./config/database');

const app = express();
app.use(express.json());

app.use('/api/v1/verification', require('./api/v1/routes/verification.routes'));

connectDB();

app.listen(5000, () => console.log('Server running'));