import View from "./events/eventView.js"
import CalendarView from "./events/calendarView.js"
import EventListView from "./events/eventListView.js"

class MainView{
    constructor(){
        this.calendarView = new CalendarView(document.querySelector('div.divTableRow'))
        this.eventListView = new EventListView(document.querySelector('event-list'))
        this.eventListView.addEventListener('sel_event', event => this.eventView.updateEventModifier(event.detail.event))
        this.eventView = new View(document.querySelector('event-view'))
        this.eventView.addEventListener('add_event', event => this.addEventButton(event.target.event.name.value, event.target.event.date.value))
        this.eventView.addEventListener('del_event', event => this.delEventButton(event.detail.event.name.value, event.detail.event.date.value))
    }

    buildViews(events){
        this.eventListView.createEventList(events)
        this.calendarView.buildCalendar(events)
    }

    addToViews(event){
        this.calendarView.updateCalendar(event,true)
        this.eventListView.updateEventList(event,true)
    }

    delFromViews(event){
        this.calendarView.updateCalendar(event,false)
        this.eventListView.updateEventList(event,false)
    }


}
export default MainView