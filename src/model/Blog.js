const BaseModel = require('./Base')

class BlogModel extends BaseModel {
    constructor() {
        super()
        this.table = 'blogs'
    }

    list() {
        return this.get()
    }

    getInfo(id) {
        return this.where('id', id).first()
    }
}

module.exports = BlogModel