const blog = require('./blog')
const user = require('./user')

const RouterIndex = () => {
    blog()
    user()
}

module.exports = RouterIndex