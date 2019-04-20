const mysql = require('mysql')
const { MYSQL_CONF } = require('../../src/config/db')

class Connection {
    constructor() {
        this.config = MYSQL_CONF
        this.connect = mysql.createConnection(this.config)
        this.connect.connect()
    }

    getConnect() {
        return this.connect
    }
}

module.exports = Connection
// 开始连接
// conn.connect()

//开始执行sql
// conn.query(sql, (err, result) => {

// })

// 关闭连接
// conn.end()