import { EventEmitter } from 'node:events'

class LightTimer extends EventEmitter {
    constructor(type) {
        super()
        this.type = type
        this.counter = 0
        this.currentIndex = 0
        this.lightStatus = {
            red: false,
            yellow: false,
            green: false
        }
        this.pause = false

        this.timer = this.getTimer()
    }

    getNormalInterval() {
        return {
            red: 280,
            yellow: 100,
            green: 880
        }
    }

    getRedLightGreenLightInterval() {
        let interval = {
            red: Math.floor(Math.random() * 500) || 1,
            green: Math.floor(Math.random() * 500) || 1
        }

        return interval
    }

    getStrobeInterval() {
        return {
            red: 50,
            yellow: 50,
            green: 50
        }
    }

    getInterval() {
        let interval = this.getNormalInterval()

        if (this.type == 'redLightGreenLight') {
            interval = this.getRedLightGreenLightInterval()
        } else if (this.type == 'strobe') {
            interval = this.getStrobeInterval()
        }

        return interval
    }

    getTimer() {
        let interval = this.getInterval()
        setInterval(() => {
            if (this.pause) return

            this.resetLightStats()
            this.counter++

            let lightColors = Object.keys(interval)
            let lightColor = lightColors[this.currentIndex]

            if (this.counter != interval[lightColor]) return

            this.counter = 0
            this.currentIndex ++

            let newLightColor = lightColors[this.currentIndex]

            if (typeof newLightColor == 'undefined') {
                this.currentIndex = 0
                this.counter = 0

                newLightColor = lightColors[this.currentIndex]
                interval = this.getInterval()
            }

            this.lightStatus[newLightColor] = true

            this.emit('updatedLight')
        
        }, 10)
    }
    
    resetLightStats() {
        for (const statusColor of Object.keys(this.lightStatus)) {
            this.lightStatus[statusColor] = false
        }
    }

    pauseTimer() {
        this.pause = true
    }

    playTimer() {
        this.pause = false
    }

    clear() {
        this.counter = 0

        clearInterval(this.timer)
        this.timer = this.getTimer()
    }
}

export default LightTimer
