class Base {
    constructor(resData, req, res) {
        this.postData = resData.postData
        this.query = resData.query
        this.req = req
        console.log(req.session, '123')
        this.res = res
    }

    request(str = '') {
        // 合并postData 和 query
        const data = Object.assign({}, this.postData, this.query)

        if (arguments.length === 0) {
            return data
        }
        if (typeof str !== 'string') {
            return ''
        }

        return data[str]
    }

    post(str = '') {
        if (arguments.length === 0) {
            return this.postData
        }
        if (typeof str !== 'string') {
            return ''
        }
        return this.postData[str]
    }

    get(str) {
        if (arguments.length === 0) {
            return this.query
        }
        if (typeof str !== 'string') {
            return ''
        }
        return this.query[str]
    }

    success(data = '') {
        if (!data) {
            return {
                errorno: 0
            }
        }
        return {
            errorno: 0,
            data
        }
    }

    error(msg = '') {
        if (!msg) {
            return {
                errorno: -1
            }
        }
        return {
            errorno: -1,
            msg
        }
    }
}

module.exports = Base