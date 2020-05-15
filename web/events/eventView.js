
import Helper from "./helper.js"

// This is used for the View where the user inputs the event they want to add or delete.
class View extends EventTarget{
    constructor(element){
        super()
        this.element = element
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
    }
    //Update the input fields to the event the user selected.
    updateEventModifier(event){
        const htmlDate = this.helper.formatDate(event.date)
        this.event.name.value = event.name
        this.event.date.value = htmlDate
    }

}
export default View