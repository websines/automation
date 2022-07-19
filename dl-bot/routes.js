const { BotService } = require('./bot');

const router = require('express').Router();

router.post('/start-bot', async(req, res) => {
    const data = req.body;
    const response  = await BotService(data);
    
    setTimeout(() => {
        res.send({"data": response});
    }, 240000)
})


module.exports = router;