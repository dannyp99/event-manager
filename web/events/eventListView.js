import Helper from "./helper.js"

// Handles the View that lists all events
class EventListView extends EventTarget{
    constructor(element){
        super()
        this.element = element
        //Will contain all the events in their element
        this.eventElements = []
        this.helper = new Helper()
    }
    // Build an html element for an event passed.
    buildEventElement(event){
        let eventContent = document.createElement('p')
        eventContent.id = event.id
        eventContent.innerText = `${event.name}: ${event.date}`
        // Add an event handler for when the user clicks on an event.
        eventContent.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('sel_event', {detail:{event: event}}))
        })
        return eventContent
    }
    // Given an event list create all html elements for each of them.
    createEventList(eventList){
        eventList.forEach(event => {
            let builtEvent = this.buildEventElement(event)
            // Add this to the list keeping track of them and to the page.
            this.eventElements.push(builtEvent)
            this.element.appendChild(builtEvent)
        });
    }
    // Update the List View, delete them if delEvent is true.
    updateEventList(event,delEvent){
        //If set for deleting delete the items from the view.
        if(delEvent){
            //Find the element and delete it from the view.
            let selEvent = this.helper.findHtmlEvent(this.eventElements,event)
            if(selEvent){
                this.element.removeChild(selEvent)
                this.eventElements.remove(selEvent)
            }else{
                console.log('Failed to find event in event list')
            }
        //Otherwise add it to the view.
        }else{
            let newEvent = this.buildEventElement(event)
            this.eventElements.push(newEvent)
            this.element.appendChild(newEvent)
        }
    }
}
export default EventListView