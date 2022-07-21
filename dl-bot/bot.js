const { getPhone, getCode } = require('../phone/phoneService');

const chromium = require('chromium')
const puppeteer = require('puppeteer')
const axios = require('axios')

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getJSON = async (data, jwt) => {
    try {
        return await axios.post(process.env.SQUEEZE_DASHBOARD_URL, {
            "firstName": data.firstName,
            "lastName": data.lastName,
            "street": data.street,
            "city": data.city,
            "state": data.state,
            "zipcode": data.zip,
        }, {
            headers: {
                'x-sqz-token': jwt
            }
        }).then(response => {
            return response.data
        })
    }catch (err) {
        return err
    }
}


const BotService = async (data) => {

    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: chromium.path
        })
        const page = await browser.newPage()
        await page.goto(process.env.SQUEEZE_URL, { waitUntil: 'load', timeout: 0 })
        await page.waitForTimeout(1000)
        //Enter Sign in Details and click button
        await page.type('input[name="firstName"]', data.firstName, { delay: 35 })
        await page.type('input[name="lastName"]', data.lastName, { delay: 35 })
        const email = await page.$x('//*[@id="email-address"]')
        await email[0].type(data.email, { delay: 35 })
        const password = await page.$x('//*[@id="new-password"]')
        await password[0].type(data.password, { delay: 35 })
        const button = await page.$x('//*[@id="signupForm"]/div[4]/button')
        await button[0].click()

        //Wait for page to load
        await page.waitForNavigation({
            waitUntil: 'load'
        })

        //Enter Other details

        await page.type('input[name="addressStreet"]', data.street, { delay: 35 })
        await page.type('input[name="addressCity"]', data.city, { delay: 35 })
        await page.select('select[name="addressState"]', data.state)
        await page.type('input[name="addressZip"]', data.zip, { delay: 35 })
        const selectMort = await page.$x('//*[@id="housing-situation"]')
        await selectMort[0].select('own_with_mortgage')

        //Get phone number 
        const phone = await getPhone()
        const phoneElement = await page.$x('//*[@id="cell-phone"]')
        await phoneElement[0].type(phone, { delay: 35 })

        const button_step2 = await page.$$('button[class="address-stage__submit"]')
        await button_step2[0].click()

        await page.waitForNavigation({
            waitUntil: 'load'
        })

        //Get code
        await delay(5000)
        const code = await getCode()
        if (code === 'No code found' || code === undefined) {
            return 'No code found'
        }
        const codeElement = await page.$$('input[name="verifyNumber"]')
        await codeElement[0].type(code, { delay: 35 })
        const button_step3 = await page.$$('button[class="verification-stage__submit"]')
        await button_step3[0].click()

        //Get JWT
        await page.waitForNavigation(
            { waitUntil: 'load' }
        )

        const cookies = await page.cookies()

        const jwt = cookies.find(cookie => cookie.name === '_jwt').value

        await browser.close()

        const UserJSON =  await getJSON(data, jwt)
        return UserJSON

    } catch (err) {
        return err
    }

}

module.exports = {
    BotService
}