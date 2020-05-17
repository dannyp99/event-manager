
import Helper from "./helper.js"

// This is used for the View where the user inputs the event they want to add or delete.
class View extends EventTarget{
    constructor(element){
        super()
        this.element = element
        this.selEventId = -1
        //Retrieve elements from the view.
        this.event = {
            name: this.element.querySelector('[name=eventName]'),
            date: this.element.querySelector('[name=eventDate]')
        }
        this.addBut = this.element.querySelector('[name=addEvent]')
        this.delBut = this.element.querySelector('[name=removeEvent]')
        this.helper = new Helper()
        //Create event handlers that dispatch an event that the controller catches.
        this.addBut.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent("add_event", {detail:{event: this.event}}))
        })
        this.delBut.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent("del_event", {detail:{event: this.event}}))
        })
        this.event.name.addEventListener('change', () => {
            let updateEvent = {id: this.selEventId, name: this.event.name.value, date: this.event.date.value}
            this.dispatchEvent(new CustomEvent('update', {detail:{event: updateEvent}}))
        })
        this.event.date.addEventListener('change', () => {
            let updateEvent = {id: this.selEventId, name: this.event.name.value, date: this.event.date.value}
            this.dispatchEvent(new CustomEvent('update', {detail:{event: updateEvent}}))
        })
    }
    //Update the input fields to the event the user selected.
    updateEventModifier(event){
        this.selEventId = event.id
        const htmlDate = this.helper.formatDate(event.date)
        this.event.name.value = event.name
        this.event.date.value = htmlDate
    }

}
export default View