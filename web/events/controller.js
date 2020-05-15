import Event from "./event.js"
import Sync from "../sync.js"
import Helper from "./helper.js"

class EventController {

    constructor(mainView){
        this.mainView = mainView
        this.sync = new Sync()
        this.helper = new Helper()
        this.events = []
        this.getEvents()
    }

    async getEvents(){
        let fetchedEvents = (await this.sync.eventListGet()).map(event => new Event(event))
        console.log(fetchedEvents)
        this.events = fetchedEvents
        this.mainView.buildViews(this.events)
    }


    async addEventButton(eventName, eventDate){
        console.log(eventName)
        console.log(eventDate)
        if(eventName === '' || eventDate === ''){return}
        if(eventName && eventDate) {
            const eventDateAsDate = new Date(eventDate)
            eventDateAsDate.setDate(eventDateAsDate.getDate() + 1)
            if(this.helper.isDuplicateEvent(eventName, eventDateAsDate, this.events)){return}
            const newEvent = {id: 0, name: eventName, date: eventDateAsDate.toLocaleDateString()}
            let resp = await this.sync.eventListPost(newEvent)
            if(resp){
                console.log(resp)
                const addedEvent = resp.map(event => new Event(event))
                this.events = this.events.concat(addedEvent)
                const content = addedEvent[0]
                this.mainView.addToViews(content)
            }else{
                console.log(`Failed to add Event Error: ${resp.status}`)
            }
        }
    }

    async delEventButton(eventName,eventDate){
        if(eventName === '' || eventDate === ''){return}
        const eventDateAsDate = new Date(eventDate)
        eventDateAsDate.setDate(eventDateAsDate.getDate() + 1)
        console.log(this.events[0])
        let selEvent = this.events.find(event => event.name === eventName && event.date === eventDateAsDate.toLocaleDateString())
        if(selEvent){
            let resp = await this.sync.eventDelete(selEvent)
            console.log(resp)
            if(resp.ok){
                this.events.remove(selEvent)
                this.mainView.delFromViews(selEvent)
            }else{
                console.log(`Failed to delete event error: ${resp.status}`)
            }
        }else{
            console.log('Event does not exist')
        }
    }
}

    export default EventController