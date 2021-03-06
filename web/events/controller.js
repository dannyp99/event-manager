import Event from "./event.js"
import Sync from "../sync.js"
import Helper from "./helper.js"
import CalendarView from "./calendarView.js"
import EventListView from "./eventListView.js"
import View from "./eventView.js"

// Initialize all views and handle add and delete events.
class EventController {

    constructor(){
        this.sync = new Sync()
        this.helper = new Helper()
        this.events = []
        this.getEvents()
        //Initialize all the views and listening for any events they might have.
        this.calendarView = new CalendarView(document.querySelector('div.divTableRow'))
        this.eventListView = new EventListView(document.querySelector('event-list'))
        this.eventListView.addEventListener('sel_event', event => this.eventView.updateEventModifier(event.detail.event))
        this.eventView = new View(document.querySelector('event-view'))
        this.eventView.addEventListener('update', event => this.updateEvent(event.detail.event))
        this.eventView.addEventListener('add_event', event => this.addEventButton(event.detail.event.name.value, event.detail.event.date.value))
        this.eventView.addEventListener('del_event', event => this.delEventButton(event.detail.event.name.value, event.detail.event.date.value))
    }
    // Get all events from DB and map to the Event obj.
    async getEvents(){
        let fetchedEvents = (await this.sync.eventListGet()).map(event => new Event(event))
        this.events = fetchedEvents
        //Build the views now that we have the events
        this.buildViews()
    }
    //Build the list and calendar with the list of events.
    buildViews(){
        this.eventListView.createEventList(this.events)
        this.calendarView.buildCalendar(this.events)
    }
    // Add Button is pressed.
    async addEventButton(eventName, eventDate){
        //If both fields are blank return
        if(eventName === '' || eventDate === ''){return}
        //If both parameters contain values actually do stuff.
        if(eventName && eventDate) {
            //Call Helper to check if the event entered is a duplcate.
            if(this.helper.isDuplicateEvent(eventName, eventDate, this.events)){return}
            const newEvent = {id: 0, name: eventName, date: eventDate}
            //Create a new Event and send it to be added to the DB
            let resp = await this.sync.eventListPost(newEvent)
            //It returns the Event that was added to the DB.
            if(resp){
                //If we get that event back, then update our list and views.
                const addedEvent = resp.map(event => new Event(event))
                this.events = this.events.concat(addedEvent)
                //Technically we can get back a List of events, but it should only ever return one.
                const content = addedEvent[0]
                this.calendarView.addCalendar(content)
                this.eventListView.addEventList(content)
                this.eventView.selEventId = content.id
            }else{
                //If we get nothing back then the event was not added.
                console.log(`Failed to add Event Error: ${resp.status}`)
            }
        }
    }
    //Del Button is pressed.
    async delEventButton(eventName,eventDate){
        //If the fields are empty return
        if(eventName === '' || eventDate === ''){return}
        const eventDateAsDate = Date.create(eventDate)
        //Using the input name and date, find the event that matches the one entered.
        let selEvent = this.events.find(event => event.name === eventName && event.date === eventDateAsDate.toLocaleDateString())
        //If an event is found that matches
        if(selEvent){
            //Send that event to be deleted
            let resp = await this.sync.eventDelete(selEvent)
            //If we successfully remove from the DB, then update the front-end.
            if(resp.ok){
                //Remove from the events list and views.
                this.events.remove(selEvent)
                this.calendarView.delCalendar(selEvent)
                this.eventListView.delEventList(selEvent)
            }else{
                //Let me know that it failed to delete from DB.
                console.log(`Failed to delete event error: ${resp.status}`)
            }
        }else{
            //Just let me know that the event doesn't exist.
            console.log('Event does not exist')
        }
    }

    async updateEvent(updateEvent){
        if(this.helper.isDuplicateEvent(updateEvent.name, updateEvent.date, this.events)){return}
        let idx = this.events.findIndex(event => event.id === updateEvent.id)
        if(idx > 0){
            let resp = await this.sync.eventPut(updateEvent)

            if(resp.ok){
                updateEvent.date = Date.create(updateEvent.date).toLocaleDateString()
                this.eventListView.updateEvent(updateEvent)
                this.calendarView.updateEvent(this.events[idx], updateEvent)
                this.events[idx] = updateEvent
            }
        }
    }
}

    export default EventController