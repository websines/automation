require('dotenv').config()
const express = require('express');
const PORT = process.env.PORT || 8000;
const cors = require('cors');


const app = express();


const botRoutes = require('./dl-bot/routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}))

app.use('/api', botRoutes);

app.get('/', (req, res) => {
    res.send('Service is Live')
})


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

server.timeout = 240000;