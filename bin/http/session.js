const redis = require('../database/redis')

const session = {
    data: {},
    sessionId: '',
    set(key, val) {
        console.log('enter set', this.sessionId)
        this.get(this.sessionId).then(res => {
            console.log(val, 'val')
            // 如果得到的空对象
            if (res === null) {
                this.data = {
                    user : val
                }
            } else {
                // 如果this.data里已经有了这个键 则覆盖掉
                this.data = Object.assign({}, res, {[key]: val})
            }

            redis.set(this.sessionId, this.data)
        })  
    },

    get(key) {
        return redis.get(key).then(res => {
            return res
        })
    },

    init(sessionId) {
        this.sessionId = sessionId
    }
}

module.exports = session