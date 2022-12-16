import React, { useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000")

function App() {
    const [ lightState, setLightState ] = useState(
        {
            "animationType": "normal",
            "pause": true,
            "red": false,
            "yellow": false,
            "green": false
        }
    )

    socket.onAny((eventName, newState) => {
        if(eventName === 'update') {
            setLightState(JSON.parse(newState))
        } else if (eventName === 'message') {
            setLightState(JSON.parse(newState))
        }
    })

    const updateServer = (newState:any) => {
        socket.emit('update',JSON.stringify(newState))
    }


    const toggleAttribute = (e:any) => {
        let value = e.target.value
        const newLightState = { ...lightState }
        //@ts-ignore
        newLightState[value] = !newLightState[value]
        updateServer(newLightState)
    }

    const setAnimationType = (e:any) => {
        let value = e.target.value
        const newLightState = { ...lightState } 
        newLightState.animationType = value
        updateServer(newLightState)
    }

    return (
        <div className="App">
            <div className="light-body">
                <input
                    className="light"
                    type="checkbox"
                    name="light-1"
                    checked={lightState.red}
                    value="red"
                    disabled={!lightState.pause}
                    onChange={toggleAttribute}
                    id="light-red"
                />
                <label htmlFor="light-red"></label>

                <input
                    className="light"
                    type="checkbox"
                    name="light-2"
                    checked={lightState.yellow}
                    value="yellow"
                    disabled={!lightState.pause}
                    onChange={toggleAttribute}
                    id="light-yellow"
                />
                <label htmlFor="light-yellow"></label>

                <input
                    className="light"
                    type="checkbox"
                    name="light-3"
                    checked={lightState.green}
                    value="green"
                    disabled={!lightState.pause}
                    onChange={toggleAttribute}
                    id="light-green"
                />
                <label htmlFor="light-green"></label>
            </div>

            <div className="inputs-container">
                <input type="checkbox" checked={lightState.pause} onChange={toggleAttribute} id="pause" value="pause" />
                <label htmlFor="pause"></label>

                <label htmlFor="">
                    Animation type:
                    <select name="animationType" value={lightState.animationType} onChange={setAnimationType}>
                        <option value="normal">Normal</option>
                        <option value="redLightGreenLight">Red Light Green Light</option>
                        <option value="strobe">Strobe</option>
                    </select>
                </label>
            </div>
        </div>
    );
}

export default App;
