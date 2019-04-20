const querystring = require('querystring')
class Router {
    constructor(req = '', res = '') {
        if (req) {
            // 处理路径
            this.url = req.url
            // 处理path
            this.path = this.url.split('?')[0]
            // 处理query
            this.query = querystring.parse(this.url.split('?')[1])
            // 处理方法
            this.method = req.method
            // 用来存储query和postData
            this.resData = {}
        }
        this.res = res
        this.req = req
    
        // 存储query和postData
        this.resData.query = this.query
        this.resData.postData = req.body

        // 定义属性

        //匹配到的url
        this.matchedPath = ''

        // 匹配到的控制器
        this.matchedController = ''

        // 匹配到的方法
        this.matchedfunction = ''
    }

    /**
     *  静态get路由规则
     * @param {用户请求地址} path 
     * @param {控制器路径@方法} methodPath 
     */
    static get(path, methodPath) {
        const rules = {}
        rules.path = path
        rules.method = 'GET'

        if (methodPath.split('@').length === 2) {
            rules.controller = methodPath.split('@')[0]
            rules.function = methodPath.split('@')[1]
        } else {
            console.error('router format is error')
            return
        }

        Router.collection.push(rules)

    }

    /**
     * 静态post路由规则
     * @param {用户请求地址} path 
     * @param {控制器路径@方法} methodPath 
     */
    static post(path, methodPath) {
        const rules = {}
        rules.path = path
        rules.method = 'POST'

        if (methodPath.split('@').length === 2) {
            rules.controller = methodPath.split('@')[0]
            rules.function = methodPath.split('@')[1]
        } else {
            console.error('router format is error')
            return
        }

        Router.collection.push(rules)
    }


    /**
     * 匹配
     */
    match() {
        Router.collection.forEach(item => {
            if (item.path === this.path && item.method === this.method) {
                this.matchedPath = item.path
                this.matchedController = item.controller
                this.matchedfunction = item.function
            }
        })

        if (!this.matchedPath) {
            // 如果没有匹配到，返回404
            if (this.res) {
                this.res.writeHeader(404)
            } else {
                return console.error('出错')
            }
            return
        }


        // 引入 命中的controller
        const Controller = require(`../../src/controller/${this.matchedController}`)
        
        const instance = new Controller(this.resData, this.req, this.res)

        // 返回调用的结果
        return instance[this.matchedfunction]()
    }
}



// 定义静态属性
Router.collection = []  //规则集合

module.exports = Router