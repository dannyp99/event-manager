import Event from "./event.js"
import Sync from "./sync.js"
import Helper from "./helper.js"
import View from "./eventView.js"

class EventController {

    constructor(){
        this.sync = new Sync()
        this.helper = new Helper()
        this.events = []
        this.getEvents()
        this.view = new View(document.querySelector('calendar-view'))
        this.view.addEventListener('add_event', event => this.addEventButton(event.target.event.name.value, event.target.event.date.value))
        this.view.addEventListener('del_event', event => this.delEventButton(event.target.event.name.value, event.target.event.date.value))
    }

    async getEvents(){
        let fetchedEvents = (await this.sync.eventListGet()).map(event => new Event(event))
        console.log(fetchedEvents)
        this.events = fetchedEvents
        this.createEventList(this.events)
        this.calendarDates = this.buildCalendar()
    }

    buildEventElement(event){
        let eventContent = document.createElement('p')
        eventContent.id = event.id
        eventContent.innerText = `${event.name}: ${event.date}`
        eventContent.addEventListener('click', (event)=> {
            this.view.updateEventModifier(event.target)
        })
        return eventContent
    }

    createEventList(eventList){
        let eventListElement = document.querySelector('event-list')
        eventList.forEach(event => {
            let builtEvent = this.buildEventElement(event)
            eventListElement.appendChild(builtEvent)
        });
    }

    updateEventList(event,delEvent){
        let eventListElement = document.querySelector('event-list')
        if(delEvent){
            let dayEvents = eventListElement.getElementsByTagName('p')
            let delEvent = this.helper.findHtmlEvent(dayEvents,event)
            if(delEvent){
                eventListElement.removeChild(delEvent)
            }else{
                console.log('Failed to find event in event list')
            }
        }else{
            let newEvent = this.buildEventElement(event)
            eventListElement.appendChild(newEvent)
        }
    }

    buildCalendar() {
        let element = document.querySelector('div.divTableRow')
        let today = new Date();
        let weekDates = []
        for(let i = 0; i < 7; i++) {
            let dateCell = document.createElement('div')
            dateCell.className = 'divTableCell'
            let eventDates = this.events.filter(event => new Date(event.event.date).toDateString() === today.toDateString())
            if(eventDates.length > 0){
                dateCell.innerHTML = `<div class="divTableHead"><strong>${today.toDateString()}</strong></div>`
                eventDates.forEach(eventDate => {
                    let event = document.createElement('p')
                    event.id = eventDate.id
                    event.innerText = `${eventDate.name} ${eventDate.date}`
                    dateCell.appendChild(event)
                })
            
            }else{
                dateCell.innerHTML = `
                    <div class="divTableHead"><strong>${today.toDateString()}</strong></div>
                `
            }
            element.appendChild(dateCell)
            weekDates.push(today.toDateString())
            today.setDate(today.getDate() + 1)
        }
        return weekDates
    }

    updateCalendar(newEvent, delEvent){
        let element = document.querySelectorAll('div.divTableCell')
        let eventAsDateString = new Date(newEvent.date).toDateString()
        const idx = this.calendarDates.findIndex(date => date === eventAsDateString)
        if(idx < 0){return}
        if(delEvent){
            let dayEvents = element[idx].getElementsByTagName('p')
            let delEvent = this.helper.findHtmlEvent(dayEvents,newEvent)
            if(delEvent){
                element[idx].removeChild(delEvent)
            }else{
                console.log('Failed to calendar find event')
            }
        }else{
            let dateCell = document.createElement('p')
            dateCell.id = newEvent.id
            dateCell.innerText = `${newEvent.name}  ${newEvent.date}`
            element[idx].appendChild(dateCell)
        }
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
                this.updateEventList(content,false)
                if(this.helper.isThisWeek(eventDateAsDate)){
                    this.updateCalendar(content,false)
                }
            }else{
                console.log(`Failed to add Event Error: ${resp.status}`)
            }
        }
    }

    async delEventButton(eventName,eventDate){
        console.log(eventName)
        console.log(eventDate)
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
                this.updateCalendar(selEvent,true)
                this.updateEventList(selEvent,true)
            }else{
                console.log(`Failed to delete event error: ${resp.status}`)
            }
        }else{
            console.log('Event does not exist')
        }
    }
}

    export default EventController