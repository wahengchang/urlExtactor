const file = require('./file')

class Dictionary{
    constructor(path) {
        this.path = path
    }

    init(str) {
        file.checkFileExistThenCreate(this.path, str)
    }

    reset (str) {
        file.checkFileExistThenDelete(this.path)
        file.checkFileExistThenCreate(this.path, str)
    }

    readLineAsArray () {
        return file.readLineAsArray(this.path)
    }

    search(key) {
        const arr = this.readLineAsArray()

        return arr.filter(lineStr => {
            return lineStr.includes(key)
        })
    }

    appendLine (singleLineString) {
        return file.appendLine(this.path, singleLineString)
    }
}

module.exports = Dictionary