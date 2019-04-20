const Base = require('./Base')
const session = require('../../bin/http/session')
const UserModel = require('../model/User')

class Blog extends Base{
    async login() {
        const postData = this.post()
        const User = new UserModel()
        const result = await User.where(postData).first();

        if (! result) {
            return this.error('用户名或者密码错误')
        }
        // 登录成功的话   存入session
        session.set('user', postData)
        return this.success()
    }

    async register() {
        return this.req.session
    }
}

module.exports = Blog

