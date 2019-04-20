const redis = require('redis')
const { REDIS_CONF } = require('../../src/config/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error(err)
})

function set(key, val) {
    // 如果是个对象，那么转为 json 字符串
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            // 如果返回一个错误，reject 错误
            if (err) {
                reject(err)
                return
            }
            // 如果随便穿一个key，没有值的时候，也返回空
            if (val === null) {
                resolve(null)
                return
            }
            // 尝试去JSON.parse 如果失败了就原样返回
            try {
                val = JSON.parse(val)
                resolve(val)
            } catch (ex) {
                resolve(val)
            }
        })
    })
}

module.exports = {
    set,
    get
}