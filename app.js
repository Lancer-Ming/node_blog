const Router = require('./bin/router/index')
const routerIndex = require('./src/router/index')
const cookie = require('./bin/http/cookie')
const session = require('./bin/http/session')

const handleServer = async (req, res) => {

    res.setHeader('Content-type', 'application/json')

    // 利用Promise获取post数据
    const postData = (req) => {
        return new Promise((resolve, reject) => {
            // 如果不是post方法，直接返回空
            // if (req.method !== 'POST') {
            //     resolve({})
            //     return
            // }
            // 如果content-type不是json，也返回空
            if (req.headers['content-type'] !== 'application/json') {
                resolve({})
                return
            }
            let postData = '';
            
            req.on('data', chunk => {
                postData += chunk
            })

            req.on('end', () => {
                if (! postData) {
                    resolve({})
                    return
                }
              
                resolve(
                    JSON.parse(postData)
                )
            })
        })
    }

    // 处理cookie
    const cookies = cookie.get(req)
    console.log('cookies:',cookies)
    if (Object.keys(cookies).length === 0) {
        cookie.set(res)
    }

    // 有cookie SESSIONID的话 解析session
    if (cookies.hasOwnProperty('SESSIONID')) {
        const session_key = cookies.SESSIONID
        session.init(session_key)

        await session.get(session_key).then(response => {
            console.log(response, 'session')
            req.session = response
        })
    }

    await postData(req).then(postData => {
        // 将post数据存储到req.body里
        req.body = postData
        // 实例化路由
        const router = new Router(req, res)
       
        // 注册路由
        routerIndex()

        // 进行匹配分发 返回的 promise
        const result = router.match()

        // 返回结果到页面
        if (result instanceof Promise) {
            result.then(response => {
                res.end(
                    JSON.stringify(response)
                )
            })
        } else {
            res.end(
                JSON.stringify(result)
            )
        }
       
        
       
    })
}

module.exports = handleServer