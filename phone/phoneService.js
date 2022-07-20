const axios = require('axios')
const WebSocket = require('ws')
const ws = new WebSocket('wss://app.truverifi.com/api/ws')


const getPhone = async() => {

    return await axios.post(process.env.TRUVERIFI_ENDPOINT + '/line/changeService', {
        "services": "SERVICE_NOT_LISTED"
    },{
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-API-KEY": process.env.TRUVERIFI_API_KEY
    }}).then(response => {
        return response.data.phoneNumber
    }).catch(error => {
        console.log(error.response.data)
    })
}

const getCode = async() => {
    console.log("Service started Getting code")
    return await axios.get(process.env.TRUVERIFI_ENDPOINT + '/line', {
        headers: {
            "Accept": "application/json",
            "X-API-KEY": process.env.TRUVERIFI_API_KEY
        }
    }).then(response => {
        const text = response.data.sms[0].text
        const code = text.match(/\d+/)[0]
        return code
    }).catch(error => {
        return error.response.data
    })
}

ws.on('open', () => {
    console.log('WebSocket Client Connected');
    setInterval(() => {
        ws.send(JSON.stringify({
            "jsonrpc": "2.0",
            "method": "ping"
        }))
    }, 90000)

    ws.send(JSON.stringify({
        "jsonrpc": '2.0',
        "method": 'subscribe',
        "params": {
            "apiKey": "NucqaT4T9C1TKmszLnI2NLXC"
        }
    }))
})

   


module.exports = {
    getPhone,
    getCode,
    ws
}