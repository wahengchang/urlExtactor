const file = require('./file')
const fs = require('fs')

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

    deleteLineByString (lineStr) {
        return file.deleteLineByString(this.path, lineStr)
    }

    deleteFile () {
        fs.unlinkSync(this.path);
    }

    search(key) {
        const arr = this.readLineAsArray()

        return arr.filter(lineStr => {
            // console.log(key, lineStr)
            return key === lineStr
        })
    }

    appendLine (singleLineString) {
        return file.appendLine(this.path, singleLineString)
    }
}

module.exports = Dictionary