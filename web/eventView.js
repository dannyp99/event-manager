
import Helper from "./helper.js"

class View extends EventTarget{
    constructor(element){
        super()
        this.element = element
        this.event = {
            name: this.element.querySelector('[name=eventName]'),
            date: this.element.querySelector('[name=eventDate]')
        }
        this.addBut = this.element.querySelector('[name=addEvent]')
        this.delBut = this.element.querySelector('[name=removeEvent]')
        this.helper = new Helper()
        this.addBut.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent("add_event", {event: this.event}))
        })
        this.delBut.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent("del_event", {event: this.event}))
        })
    }

    updateEventModifier(event){
        const eventItems =  event.innerText.split(':')
        const htmlDate = this.helper.formatDate(eventItems[1])
        this.event.name.value = eventItems[0]
        this.event.date.value = htmlDate
    }

}
export default View