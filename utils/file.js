const fs = require('fs')

const checkFileExistThenDelete = (path = '') => {
    if(!path) {
        throw new Error('[ERROR] path is required, checkFileExistThenDelete')
    }

    try {
        fs.unlinkSync(path)
        console.log(`[INFO] file deleted: ${path}`)
    } catch(err) {
        console.error(err)
    }
}

const checkFileExistThenCreate = (path = '', str = '') => {
    if(!path) {
        throw new Error('[ERROR] path is required, checkFileExistThenDelete')
    }

    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, str, 'utf8')
    }
    else {
        if(!str) return 

        fs.writeFileSync(path, str, 'utf8')
    }
}

const listAddDir = (path = '') => {
    if(!path) {
        throw new Error('[ERROR] path is required, listAddDir')
    }

    try {
        return fs.readdirSync(path)
    } catch(err) {
        console.error(err)
    }
}

const readLineAsArray = (path = '') => {
    if(!path) {
        throw new Error('[ERROR] path is required, listAddDir')
    }

    try {
        const str = fs.readFileSync(path, 'utf8')
        const arr = str.split(/\r?\n/)
        return arr

    } catch(err) {
        console.error(err)
    }
}

const appendLine = (path = '', singleLineString) => {
    if(!path) {
        throw new Error('[ERROR] path is required, listAddDir')
    }

    try {
        return fs.appendFileSync(path, `\n${singleLineString}`, 'utf-8');
    } catch(err) {
        console.error(err)
    }
}

module.exports = {
    checkFileExistThenDelete,
    checkFileExistThenCreate,
    listAddDir,
    readLineAsArray,
    appendLine
}