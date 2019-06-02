const Koa = require('koa')
const app = new Koa()
const { connect, initSchemas } = require('./database/init')
const bodyParser = require('koa-bodyparser') // post请求
const router = require('./routes')
const cors = require('koa-cors') // 跨域
; (async () => {
    await connect()
    await initSchemas()
        app
            .use(cors())
            .use(bodyParser())
            .use(router.routes())
            .use(router.allowedMethods())
        app.listen(3001)
})()