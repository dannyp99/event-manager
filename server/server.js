const Koa = require('koa')
const app = new Koa()
const Router = require('@koa/router')
const router = new Router()
const fetch = require('node-fetch')
const logger = require('koa-logger')
const KoaStatic = require('koa-static')

let file_server = KoaStatic("../web")

let eventList = [
    {id: 1, name: "Liam's Birthday", date:"5/3/20"},
    {id: 2, name: "Doctor's Appointment", date: "5/12/20"},
    {id: 3, name: "CSC 155 Final", date: "5/14/20"}
]

router.get('/events', async (context) => {
    context.response.body = eventList
})

router.post("/events", async (context) => {
    let newEvent = context.request.body
    newEvent.id = eventList.length + 1
    eventList.push(newEvent)
    context.response.status = 201
    context.response.body = newEvent
})

router.put("/events/:id", async (context) => {
    let eventID = Number(context.params.id)
    let updatedEventData = context.request.body
  
    let chosenEvent = eventList.find((event) => event.id === eventID )
  
    chosenEvent.date = updatedEventData.date
    chosenEvent.name = updatedEventData.name
  
    context.response.status = 204
})

router.delete("/events/:id", async (context) => {
    let eventID = Number(context.params.id)
  
    let chosenEvent = eventList.find((event) => event.id === eventID )
  
    eventList.remove(chosenEvent)
    context.response.status = 204
  })

app.use(file_server)
app.use(logger())
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
    console.log("Server is running at localhost:3000")
})