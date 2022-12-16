import { createServer } from 'http'
import { Server } from 'socket.io'
import { LocalStorage } from "node-localstorage";
import LightTimer from './lightTimer.js';

const httpServer = createServer()

const initialLightsState = {
    "animationType": "normal",
    "pause": true,
    "red": false,
    "yellow": false,
    "green": false
}

const localStorage = new LocalStorage('./storage')

const setLightState = (newLightStatus) => {
    localStorage.setItem(
        'lightStatus',
        newLightStatus
    )
}

if (localStorage.getItem('lightStatus') == null) {
    setLightState(JSON.stringify(initialLightsState))
}

const getCurrentLightState = () => {
    return JSON.parse(localStorage.getItem('lightStatus'))
}

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
})

let lightTimer = new LightTimer(getCurrentLightState().animationType)


io.on("connection", (socket) => {
    socket.emit('message', localStorage.getItem('lightStatus'))

    lightTimer.on('updatedLight', () => {
        let lightState = getCurrentLightState()

        for (const key of Object.keys(lightTimer.lightStatus)) {
            lightState[key] = lightTimer.lightStatus[key]
        }

        localStorage.setItem('lightStatus', JSON.stringify(lightState))

        socket.emit('update', localStorage.getItem('lightStatus'))
    })

    socket.on('update', (e) => {
        setLightState(e)
        let parsedState = JSON.parse(e)

        if (parsedState.pause) {
            lightTimer.pauseTimer()
        } else {
            lightTimer.playTimer()
        }

        if (lightTimer.type != parsedState.animationType) {
            lightTimer.type = parsedState.animationType
            lightTimer.clear()
        }
        
        socket.emit('update', localStorage.getItem('lightStatus'))
    })
});

httpServer.listen(3000)
