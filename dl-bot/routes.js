const axios = require('axios');
const { BotService } = require('./bot');

const router = require('express').Router();

router.post('/start-bot', async(req, res) => {
    const data = req.body;
    const response  = await BotService(data);

    res.send({"data": response});
})


module.exports = router;