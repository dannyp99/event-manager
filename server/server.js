const Koa = require('koa')
const app = new Koa()
const Router = require('@koa/router')
const router = new Router()
const fetch = require('node-fetch')
const logger = require('koa-logger')
const KoaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const Sugar = require('sugar')
const sql = require('./database.js')
Sugar.extend()

let file_server = KoaStatic(`${__dirname}/../web`)
console.log(sql)

router.get('/events', async (context) => {
    let eventList = []
    const query = 'SELECT * FROM event_manager.event_table'
    try {
		const data = await sql.con.query(query);
        data.forEach(item => {
            eventList.push({id: item.event_id, name: item.event_name, date: item.event_date_str})
        })
	}
    catch (err) { console.log(err) }
    context.response.body = eventList
})

router.post("/events", async (context) => {
    let newEvent = context.request.body
    if(!(newEvent.name && newEvent.date)){return}
    let query = `INSERT INTO event_manager.event_table (event_name, event_date, event_date_str) 
        VALUES (${sql.con.escape(newEvent.name)}, NOW(), ${sql.con.escape(newEvent.date)})`
    try{
        let data = await sql.con.query(query)
        console.log(data)
    }catch(err){
        console.log(err)
    }
    
    query = 'SELECT * FROM event_manager.event_table ORDER BY event_id DESC LIMIT 1;'
    try{
        let addedEvent = await sql.con.query(query)
        console.log(addedEvent)
        context.response.status = 201
        context.response.body = addedEvent
    }catch(err){
        console.log(err)
    }
})

// router.put("/events/:id", async (context) => {
//     let eventID = Number(context.params.id)
//     let updatedEventData = context.request.body
  
//     let chosenEvent = eventList.find((event) => event.id === eventID )
  
//     chosenEvent.date = updatedEventData.date
//     chosenEvent.name = updatedEventData.name
  
//     context.response.status = 204
// })

router.delete("/events/:id", async (context) => {
    let eventID = Number(context.params.id)
    if(eventID < 0){return}
    let query = `SELECT * FROM event_manager.event_table WHERE event_id = ${sql.con.escape(eventID)}`
    try{
        let data = await sql.con.query(query)
        if(data.length === 1){
            query = `DELETE FROM event_manager.event_table WHERE event_id = ${sql.con.escape(eventID)}`
            try {
                await sql.con.query(query)
                context.response.status = 204
            }catch(err){
                console.log(err)
            }
        }else{
            if(data.length === 0){ console.log("No results returned") }
            else{ console.log("Several items returned for the same ID ERROR") }
        }
    }catch(err){
        console.log(err)
    }
  })

app.use(file_server)
app.use(logger())
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
    console.log("Server is running at localhost:3000")
})