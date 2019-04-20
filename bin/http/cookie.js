function generateSessionId(number) {
    let string = 'qwertyuiopasdfghjklzxcvbnm1234567890'
    let result = ''
    for (let i = 0; i < number; i++) {
        const random = parseInt(Math.random() * string.length) + 1
        result += string[random]
    }
    return result
}

const cookie = {
    expires: 24 * 3600 * 7 * 1000,
    data: {},
    set(res) {
        const time = new Date().getTime() + this.expires;
        const timeObj = new Date(time).toGMTString()
        res.setHeader("Set-Cookie", `SESSIONID=${generateSessionId(16)};path="/";expires=${timeObj};HttpOnly`)
    },

    get(req) {
        if (req.headers.cookie != null) {
            req.headers.cookie.split(';').forEach(item => {
                let key = item.split('=')[0]
                let value = item.split('=')[1]
                this.data[key] = value
            });
        }
        return this.data
    }
}

module.exports = cookie