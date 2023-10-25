import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js"
import Busquedas from "./models/busquedas.js"


const main = async () => {
    const busquedas = new Busquedas()
    let option = ''

    const nombres = text => {
        const regex = /^([^,]*)/;
        const result = regex.exec(text)
        return result[1]
    }

    do {
        option = await inquirerMenu()

        switch (option) {
            case 1:
                const termino = await leerInput('Ciudad: ')
                console.clear()
                const lugares = await busquedas.ciudad(termino)
                const idLugares = await listarLugares(lugares)
                if (idLugares === '0') continue
                const lugSel = lugares.find(x => x.id === idLugares)
                if (idLugares !== '0') busquedas.agregarHistorial(lugSel.nombre)
                const clima = await busquedas.climaLugar(lugSel.lat, lugSel.lng)
                console.log('\nInformación de la ciudad:\n'.green)
                console.log('Ciudad:', nombres(lugSel.nombre))
                console.log('Lat:', lugSel.lat)
                console.log('Lng:', lugSel.lng)
                console.log('Temperatura:', clima.temperatura)
                console.log('Mínima:', clima.minima)
                console.log('Máxima:', clima.maxima)
                console.log('Como está el clima:', `${clima.description}`.green)
                break
            case 2:
                console.log()
                busquedas.historialCapitalizado.map((x, i) => {
                    const ind = `${i + 1}`.green
                    console.log(`${ind} ${x}`)
                })
                console.log()
                break
        }

        option !== 3 ? await pausa() : console.clear()
    } while (option !== 3)
}

main()
