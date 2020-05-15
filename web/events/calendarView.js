import Helper from "./helper.js"

class CalendarView{
    constructor(element){
        this.element = element
        this.helper = new Helper()
        this.calendarDates = []
    }
    //Build The calendar view.
    buildCalendar(events) {
        let today = new Date();
        for(let i = 0; i < 7; i++) {
            let dateCell = document.createElement('div')
            dateCell.className = 'divTableCell'
            //Only build events from list that are a part of this day. For each day of the week.
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
            //Append to the View and list that keeps track of all the dates of this week
            this.element.appendChild(dateCell)
            this.calendarDates.push(today.toDateString())
            today.setDate(today.getDate() + 1)
        }
    }
    //Add or Delete event from calendar.
    updateCalendar(newEvent, delEvent){
        let element = this.element.querySelectorAll('div.divTableCell')
        let eventAsDateString = new Date(newEvent.date).toDateString()
        //Find the location of the day you want to update
        const idx = this.calendarDates.findIndex(date => date === eventAsDateString)
        //If it doesn't find it, (idx will be -1) then just return
        if(idx < 0){return}
        //If delEvent is true
        if(delEvent){
            //Get the Html for that day and get the actual html for the events
            let dayEvents = element[idx].getElementsByTagName('p')
            //
            let selEvent = this.helper.findHtmlEvent(dayEvents,newEvent)
            //Get that specific event from those events
            if(selEvent){
                element[idx].removeChild(selEvent)
                this.calendarDates.remove(selEvent)
            //Otherwise let me know that it wasn't found
            }else{
                console.log('Failed to calendar find event')
            }
        //Otherwise add the event to that specific day.
        }else{
            let dateCell = document.createElement('p')
            dateCell.id = newEvent.id
            dateCell.innerText = `${newEvent.name}  ${newEvent.date}`
            element[idx].appendChild(dateCell)
        }
    }
}
export default CalendarView