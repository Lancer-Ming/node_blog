const Router = require('../../bin/router/index')
const user = () => {
    Router.get('/api/login', 'User@login')
    Router.get('/api/register', 'User@register')

}
module.exports = user