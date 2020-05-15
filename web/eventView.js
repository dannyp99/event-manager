
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
            this.dispatchEvent(new CustomEvent("add_event", {detail:{event: this.event}}))
        })
        this.delBut.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent("del_event", {detail:{event: this.event}}))
        })
    }

    updateEventModifier(event){
        const htmlDate = this.helper.formatDate(event.date)
        this.event.name.value = event.name
        this.event.date.value = htmlDate
    }

}
export default View