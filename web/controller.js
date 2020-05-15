import Event from "./event.js"
import Sync from "./sync.js"
import Helper from "./helper.js"
import View from "./eventView.js"
import CalendarView from "./calendarView.js"
import EventListView from "./eventListView.js"

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
        this.eventView.addEventListener('add_event', event => this.addEventButton(event.target.event.name.value, event.target.event.date.value))
        this.eventView.addEventListener('del_event', event => this.delEventButton(event.detail.event.name.value, event.detail.event.date.value))
    }

    async getEvents(){
        let fetchedEvents = (await this.sync.eventListGet()).map(event => new Event(event))
        console.log(fetchedEvents)
        this.events = fetchedEvents
        this.eventListView.createEventList(this.events)
        this.calendarView.buildCalendar(this.events)
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
                this.eventListView.updateEventList(content,false)
                if(this.helper.isThisWeek(eventDateAsDate)){
                    this.calendarView.updateCalendar(content,false)
                }
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
                this.calendarView.updateCalendar(selEvent,true)
                this.eventListView.updateEventList(selEvent,true)
            }else{
                console.log(`Failed to delete event error: ${resp.status}`)
            }
        }else{
            console.log('Event does not exist')
        }
    }
}

    export default EventController