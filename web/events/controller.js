import Event from "./event.js"
import Sync from "../sync.js"
import Helper from "./helper.js"
import CalendarView from "./calendarView.js"
import EventListView from "./eventListView.js"
import View from "./eventView.js"

class EventController {

    constructor(){
        this.sync = new Sync()
        this.helper = new Helper()
        this.events = []
        this.getEvents()
        this.calendarView = new CalendarView(document.querySelector('div.divTableRow'))
        this.eventListView = new EventListView(document.querySelector('event-list'))
        this.eventListView.addEventListener('sel_event', event => this.eventView.updateEventModifier(event.detail.event))
        this.eventView = new View(document.querySelector('event-view'))
        this.eventView.addEventListener('add_event', event => this.addEventButton(event.detail.event.name.value, event.detail.event.date.value))
        this.eventView.addEventListener('del_event', event => this.delEventButton(event.detail.event.name.value, event.detail.event.date.value))
    }

    async getEvents(){
        let fetchedEvents = (await this.sync.eventListGet()).map(event => new Event(event))
        this.events = fetchedEvents
        this.buildViews(this.events)
    }

    buildViews(events){
        this.eventListView.createEventList(events)
        this.calendarView.buildCalendar(events)
    }

    addToViews(event){
        this.calendarView.updateCalendar(event,false)
        this.eventListView.updateEventList(event,false)
    }

    delFromViews(event){
        this.calendarView.updateCalendar(event,true)
        this.eventListView.updateEventList(event,true)
    }

    async addEventButton(eventName, eventDate){
        if(eventName === '' || eventDate === ''){return}
        if(eventName && eventDate) {
            const eventDateAsDate = new Date(eventDate)
            eventDateAsDate.setDate(eventDateAsDate.getDate() + 1)
            if(this.helper.isDuplicateEvent(eventName, eventDateAsDate, this.events)){return}
            const newEvent = {id: 0, name: eventName, date: eventDateAsDate.toLocaleDateString()}
            let resp = await this.sync.eventListPost(newEvent)
            if(resp){
                const addedEvent = resp.map(event => new Event(event))
                this.events = this.events.concat(addedEvent)
                const content = addedEvent[0]
                this.addToViews(content)
            }else{
                console.log(`Failed to add Event Error: ${resp.status}`)
            }
        }
    }

    async delEventButton(eventName,eventDate){
        if(eventName === '' || eventDate === ''){return}
        const eventDateAsDate = new Date(eventDate)
        eventDateAsDate.setDate(eventDateAsDate.getDate() + 1)
        let selEvent = this.events.find(event => event.name === eventName && event.date === eventDateAsDate.toLocaleDateString())
        if(selEvent){
            let resp = await this.sync.eventDelete(selEvent)
            if(resp.ok){
                this.events.remove(selEvent)
                this.delFromViews(selEvent)
            }else{
                console.log(`Failed to delete event error: ${resp.status}`)
            }
        }else{
            console.log('Event does not exist')
        }
    }
}

    export default EventController