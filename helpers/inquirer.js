import inquirer from 'inquirer'
import colors from 'colors'


export const inquirerMenu = async () => {
    console.clear()
    console.log('======================='.blue)
    console.log(' SELECCIONE UNA OPCIÓN '.bgWhite.black)
    console.log('=======================\n'.blue)

    const questions = [
        {
            value: 1,
            name: `${'1.'.green} Buscar ciudad`
        },
        {
            value: 2,
            name: `${'2.'.green} Historial`
        },
        {
            value: 3,
            name: `${'3.'.green} Salir`
        }
    ]

    const options = [
        {
            type: 'list',
            name: 'opcion',
            message: '¿Qué desea hacer?\n',
            choices: questions
        }
    ]

    const { opcion } = await inquirer.prompt(options)
    return opcion
}

export const pausa = async () => {
    await inquirer.prompt([{
        type: 'input',
        name: 'confirm',
        message: `\nPresione ${'ENTER'.blue} para continuar...`
    }])
}

export const listarLugares = async(lugares = []) => {
    const choices = lugares.map((x, i) => {
        const ind = `${i + 1}`.green

        return {
            value: x.id,
            name: `${ind} ${x.nombre}`
        }
    })

    choices.unshift({
        value: '0',
        name: '0'.green + ' Cancelar'
    })

    const preguntas  = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione Lugar: \n',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas)
    return id
}

export const leerInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if(value.length === 0) {
                    return '\nPor favor ingrese un valor'
                }
                return true
            } 
        }
    ]
    const { desc } = await inquirer.prompt(question)
    return desc
}