const Router = require('../../bin/router/index')
const blog = () => {
    Router.get('/api/blog/list', 'Blog@list')
    Router.post('/api/blog/create', 'Blog@create')
    Router.get('/api/blog/test', 'Blog@test')
}
module.exports = blog