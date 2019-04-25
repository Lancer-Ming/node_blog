const fs = require('fs')
const path = require('path')

const file = {
    copy(source, target) {
        const filePath1 = path.resolve(__dirname, '../logs', source)
        const filePath2 = path.resolve(__dirname, '../logs', target)

        const readStream = fs.createReadStream(filePath1)
        const writeStream = fs.createWriteStream(filePath2)
        readStream.pipe(writeStream)

        readStream.on('data', chunk => {
            console.log(chunk.toString())
        })

        readStream.on('end', () => {
            console.log('copy done')
        })
    }
}

module.exports = file