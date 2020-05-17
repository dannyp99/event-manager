import Helper from "./helper.js"

// Handles the View that lists all events
class EventListView extends EventTarget{
    constructor(element){
        super()
        this.element = element
        //Will contain all the events in their element
        this.eventElements = []
        this.events = []
        this.helper = new Helper()
    }
    // Build an html element for an event passed.
    buildEventElement(event){
        let eventContent = document.createElement('p')
        eventContent.id = event.id
        eventContent.innerText = `${event.name}: ${event.date}`
        // Add an event handler for when the user clicks on an event.
        eventContent.addEventListener('click', () => {
            let eventHtml = this.events.find(eventItem => eventItem.id === event.id)
            this.dispatchEvent(new CustomEvent('sel_event', {detail:{event: eventHtml}}))
        })
        return eventContent
    }
    // Given an event list create all html elements for each of them.
    createEventList(eventList){
        eventList.forEach(event => {
            let builtEvent = this.buildEventElement(event)
            // Add this to the list keeping track of them and to the page.
            this.events.push(event)
            this.eventElements.push(builtEvent)
            this.element.appendChild(builtEvent)
        });
    }
    
    addEventList(event){
        let newEvent = this.buildEventElement(event)
        this.events.push(event)
        this.eventElements.push(newEvent)
        this.element.appendChild(newEvent)
    }


    updateEvent(event){
        let idx = this.helper.findHtmlId(this.eventElements,event)
        let selEvent = this.helper.findHtmlEvent(this.eventElements,event)
        selEvent.innerText = `${event.name}: ${event.date}`
        this.eventElements[idx] = selEvent
        this.events[idx] = event
    }

    delEventList(event){
        //Find the element and delete it from the view.
        let selEvent = this.helper.findHtmlEvent(this.eventElements,event)
        if(selEvent){
            console.log(selEvent)
            this.element.removeChild(selEvent)
            this.eventElements.remove(selEvent)
            this.events.remove(event)
        }else{
            console.log('Failed to find event in event list')
        }
    }
}
export default EventListView