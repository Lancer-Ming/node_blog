const Connection = require('../database/index')

class Model {
    constructor() {
        //sql语句
        this.sql = ''

        /** 查询条件
         * [
         *      'a = 1', 'b = 2', 'c < 1', 'd like %d%', 'e <> 3'
         * ]
         */
        this.condition = []

        this.order = ''

        // 要更新的字段和值
        this.updateHash = ''

        // 表名  如果 model类没有传 table 属性  默认为类名->转小写->把model去掉换成复数
        this.table = new.target.name.toLocaleLowerCase().replace('model', 's')

        // 需要查询的字段
        this.fields = '*'

         // 连接数据库
        this.connect = new Connection().getConnect()
    
    }

    where(param1 = '', param2 = '', param3 = '') {
        // 先判断参数个数  如果一个 则传的是对象
        if (arguments.length === 1 && Object.prototype.toString.call(param1) === '[object Object]') {
            for (let key in param1) {
                this.condition.push(`\`${key}\` = '${param1[key]}'`)
            }
            console.log(this.condition)

            return this
        }
        // 如果是两个参数的情况
        if (arguments.length === 2 && typeof param1 !== 'object'
            && typeof param2 !== 'object' && param1 && param2) {
            
            this.condition.push(`\`${param1}\` = "${param2}"`)
            return this
        }
        // 如果是三个参数的情况， 大于>  小于<  等于=  like 
        if (arguments.length === 3 && typeof param1 !== 'object'
            && typeof param2 !== 'object' && typeof param3 !== 'object'
            && param1 && param2 && param3) {
            
            this.condition.push(`\`${param1}\` ${param2} "${param3}"`)
            return this
        }
        
        // 都不是则报错
        console.error('where params is not the pattern')
    }

    /**
     * 排序
     * @param {field字段名} param1 
     * @param {排序，asc||desc} param2 
     */
    orderBy(param1, param2) {
        if (typeof param1 !== 'object' && typeof param2 !== 'object'
            && param1 && param2) {
            this.order = this.order
                ? `,${param1} ${param2}`
                : `order by ${param1} ${param2}`
        }
    }

    /**查询一条
     * 查询满足条件的第一条  返回的是对象
     */
    first() {
        let sql = this._handleQuerySql()
        // 返回一个promise 将结果返回给 controller
        return this.action(sql).then(result => {
            // 进行处理，将数组取出第一个对象返回出来
            if (result.length > 0) {
                return result[0]
            }
        })
    }

    /** 查询多条
     *  返回一个数组，里面包换对象数据
     */
    get() {
        let sql = this._handleQuerySql()
        // 返回一个promise 将结果返回给 controller
        return this.action(sql).then(result => {
            // 进行处理，将数组取出第一个对象返回出来
            return result
        })
    }

    /**
     * 根据主键进行查询
     * @param {主键id} id 
     */
    find(id) {
        let sql = ''
        // 解析查询字段
        sql += `select ${this.fields} `

        // 解析table名
        sql += `from ${this.getTableName()}`

        // 加上条件 id值
        sql += ` where id = ${id}`

        return this.action(sql).then(result => {
            // 进行处理，将数组取出第一个对象返回出来
            return result.length > 0 ? result[0] : []
        })

    }

    /**
     * 返回异步的查询mysql的promise
     * @param {完整的sql语句} sql 
     */
    action(sql) {
        return new Promise((resolve, reject) => {
            //开始执行sql
            this.connect.query(sql, (error, res) => {
                if (error) {
                    reject(error)
                    return
                }
                resolve(res)
            })
        })
    }


    insert(objectValue) {
        console.log(Object.prototype.toString.call(objectValue))
        if (Object.prototype.toString.call(objectValue) === '[object Object]') {
            this.sql += `insert into \`${this.getTableName()}\``
            // 用来存field
            let fields = '';
            // 用来存值
            let values = ''
            const keysArr = Object.keys(objectValue)
            console.log(keysArr)
            keysArr.forEach((item, index) => {
                if (index === 0) {
                    fields += `(\`${item}\`,`
                    values += `(\'${objectValue[item]}\',`
                } else if (index === keysArr.length - 1) {
                    fields += `\`${item}\`)`
                    values += `\'${objectValue[item]}\')`
                } else {
                    fields += `\`${item}\`,`
                    values += `\'${objectValue[item]}\',`
                }
            })
         
            this.sql += fields + ' values ' + values + ';'
       
            return this.action(this.sql).then(result => {
                // 进行处理，将数组取出第一个对象返回出来
                if (result.affectedRows > 0) {
                    return result.insertId
                }
                
            })
        } else {
            console.error('insert param is not access to ...')
        }
    }

    /**
     *  获取表名
     */
    getTableName() {
        return this.table
    }


    _handleQuerySql() {
        let sql = ''
        // 解析查询字段
        sql += `select ${this.fields} `

        // 解析table名
        sql += `from ${this.getTableName()}`
        
        // 解析orderBy
        if (this.order) {
            sql += ` ${this.order}`
        }

        // 解析where条件
        if (this.condition) {
            this.condition.forEach((item, index) => {
                if (index === 0) {
                    sql += ` where ${item}`
                }
                if (index > 0) {
                    sql += ` and ${item}`
                }
            }) 
        }

        console.log(sql)
        return sql
    }




}

module.exports = Model