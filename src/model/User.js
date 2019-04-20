const BaseModel = require('./Base')

class UserModel extends BaseModel {
    constructor() {
        super()
        this.table = 'users'
    }
}


module.exports = UserModel