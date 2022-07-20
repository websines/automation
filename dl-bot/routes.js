const axios = require('axios');
const { BotService } = require('./bot');

const router = require('express').Router();

router.post('/start-bot', async(req, res) => {
    const data = req.body;
    const jwt  = await BotService(data);
    console.log(jwt);

    const response = await axios.post(process.env.SQUEEZE_DASHBOARD_URL, JSON.stringify({
        "firstName": data.firstName,
        "lastName": data.lastName,
        "email": data.email,
        "password": data.password,
        "street": data.street,
        "city": data.city,
        "state": data.state,
        "zip": data.zip,
    }), {
        headers: {
            'x-sqz-token': jwt
        }
    })
    
    setTimeout(() => {
        res.send({"data": response.data});
    }, 240000)
})


module.exports = router;