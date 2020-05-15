import Helper from "./helper.js"

class EventListView extends EventTarget{
    constructor(element){
        super()
        this.element = element
        this.eventElements = []
        this.helper = new Helper()
    }

    buildEventElement(event){
        let eventContent = document.createElement('p')
        eventContent.id = event.id
        eventContent.innerText = `${event.name}: ${event.date}`
        return eventContent
    }

    createEventList(eventList){
        eventList.forEach(event => {
            let builtEvent = this.buildEventElement(event)
            builtEvent.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('sel_event', {detail:{event: event}}))
            })
            this.eventElements.push(builtEvent)
            this.element.appendChild(builtEvent)
        });
    }

    updateEventList(event,delEvent){
        if(delEvent){
            let delEvent = this.helper.findHtmlEvent(this.eventElements,event)
            if(delEvent){
                this.element.removeChild(delEvent)
                this.eventElements.remove(delEvent)
            }else{
                console.log('Failed to find event in event list')
            }
        }else{
            let newEvent = this.buildEventElement(event)
            this.eventElements.push(newEvent)
            this.element.appendChild(newEvent)
        }
    }
}
export default EventListView