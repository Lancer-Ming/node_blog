const Base = require('./Base')
const UserModel = require('../model/User')
const BlogModel = require('../model/Blog')

class Blog extends Base{
    list() {
        const blogModel = new BlogModel()
        const data = blogModel.list()
        return this.success(data)
    }   

    async create() {
        const postData = this.post()  //获取post数据
        const blogModel = new BlogModel()
        const result = await blogModel.insert(postData)
        return result
    }
}

module.exports = Blog

