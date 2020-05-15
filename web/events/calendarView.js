import Helper from "./helper.js"

class CalendarView{
    constructor(element){
        this.element = element
        this.helper = new Helper()
        this.calendarDates = []
    }
    buildCalendar(events) {
        let today = new Date();
        for(let i = 0; i < 7; i++) {
            let dateCell = document.createElement('div')
            dateCell.className = 'divTableCell'
            let eventDates = events.filter(event => new Date(event.event.date).toDateString() === today.toDateString())
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
            this.element.appendChild(dateCell)
            this.calendarDates.push(today.toDateString())
            today.setDate(today.getDate() + 1)
        }
    }

    updateCalendar(newEvent, delEvent){
        let element = this.element.querySelectorAll('div.divTableCell')
        let eventAsDateString = new Date(newEvent.date).toDateString()
        const idx = this.calendarDates.findIndex(date => date === eventAsDateString)
        if(idx < 0){return}
        if(delEvent){
            let dayEvents = element[idx].getElementsByTagName('p')
            let delEvent = this.helper.findHtmlEvent(dayEvents,newEvent)
            if(delEvent){
                element[idx].removeChild(delEvent)
                this.calendarDates.remove(delEvent)
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
}
export default CalendarView