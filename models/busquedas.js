import fs from 'fs'
import axios from "axios"

class Busquedas {
    #historial = []
    #dbPath = './db/database.json'

    constructor() { 
        this.leerDB()
    }

    get historialCapitalizado() {
        return  this.#historial.map(x => {
           let palabras = x.split(' ')
           palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))
           return palabras.join(' ')
        })
    }

    get getParams() {
        return {
            access_token: process.env.MAPBOX_KEY,
            limit: 5,
            language: 'es'
        }
    }

    async ciudad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.getParams
            })
            const res  = await instance.get()
            return res.data.features.map( x => ({
                id: x.id,
                nombre: x.place_name,
                lng: x.center[0],
                lat: x.center[1]
            }))
           
        } catch(e) {
            console.clear()
            console.log ('\nOcurrió un error\n')
            console.log(e)
        }
    }

    get getClimaParams() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async climaLugar(lat, lon) {

        try {
            const clima = axios.create({
               baseURL: 'https://api.openweathermap.org/data/2.5/weather',
               params: {...this.getClimaParams, lat, lon}
            })

            const res = await clima.get()
            const { weather, main } = res.data
            return {
                description : weather[0].description,
                temperatura: main.temp,
                minima: main.temp_min,
                maxima: main.temp_max
            }

        } catch(e) {
            console.log('error\n', e)
        }
    }

    agregarHistorial(lugar = '') {
        if(lugar && !this.#historial.includes(lugar.toLocaleLowerCase())) {
            this.#historial.unshift(lugar.toLocaleLowerCase())
        }
       
        if(this.#historial.length > 5) {
            this.#historial.pop()
        }
        this.guardarDB()
    }

    guardarDB () {
        const payload = {
            historial: this.#historial
        }
        fs.writeFileSync(this.#dbPath, JSON.stringify(payload))
    }

    leerDB () {
        if (fs.existsSync(this.#dbPath)) {
            const data = fs.readFileSync(this.#dbPath, 'utf-8')
            const historial = JSON.parse(data).historial
            this.#historial = historial
        } 
    }
}

export default Busquedas