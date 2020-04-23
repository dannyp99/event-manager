const Koa = require('koa')
const app = new Koa()
const Router = require('@koa/router')
const router = new Router()
const fetch = require('node-fetch')
const logger = require('koa-logger')
const KoaStatic = require('koa-static')

let file_server = KoaStatic("../web")

app.use(file_server)
app.use(logger())
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
    console.log("Server is running at localhost:3000")
})