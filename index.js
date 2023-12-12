const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

const app = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json())

const VK_API_VERSION = '5.199'
const VK_API_URL = 'https://api.vk.com/method/'

const accessToken = 'vk1.a.oHsLvFtWRzuemf-8yHs5PD6cwLkrH0CqH77Qm3pDfTgwsmVXEpNjHJUcOqXs0pBAtQK8RzCQd7fbXeakc4qmQHxUw7icfoN9O9Rsr42db3iybvwioy7EtoY_PtQH5HJDDMoRIjZRxd-W0-oQEOnBixpwVB4e-IYtC5XevZr8YJvfOmdEVHfPOBWsLz2ZbSoI2ckyxLf9cGJ6MtsJt3sOYQ'

async function vkApiRequest (method, params) {
    const url = `${VK_API_URL}${method}`
    const response = await axios.post(url, { ...params, v: VK_API_VERSION, access_token: accessToken})
    return response.data.response
}

async function handleHelloCommand(peer_id) {
    const message = 'Привет! Я твой юридический помощник. Чем я могу тебе помочь?'
    await vkApiRequest('messages.send', {peer_id, message})
}
async function handleMassage(message) {
    const {text, peer_id} = message

    if (text.toLowerCase() === '/привет') {
        await handleHelloCommand(peer_id)
    }
}

async function handleEvent(event) {
    try {
        if (event.type === 'message_new') {
            await handleMassage(event.object.message)
        }
    } catch (err) {
        console.error(err)
    }
}

app.post('/vk-webhook', async(req,res) => {
    const {body} = req

    if (body.type === 'confirmation') {
        console.log('confirm')
        res.send('79da0752')
    } else {
        console.log('any')
        await handleEvent(body)
        res.status(200).send('ok')
    }
})

app.listen(port,() => {
    console.log('Сервер запущен')
})
