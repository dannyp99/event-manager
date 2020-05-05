
function buildEventElement(event){
    let newEvent = document.createElement('event-summary')
    newEvent.innerHTML = `
    <p>${event.name}    ${event.date}</p>
    `
    return newEvent
}

function createEventList(eventList){
    let eventListElement = document.querySelector('event-list')
    eventList.forEach(event => {
        let builtEvent = buildEventElement(event)
        eventListElement.appendChild(builtEvent)
    });
}

async function eventListGet(){
    let eventsResponse = await fetch('/events', {method: "GET"})
    let eventList = await eventsResponse.json()
    createEventList(eventList)
    return eventList
}

function buildCalendar() {
    let element = document.querySelector('div.divTableRow')
    let today = new Date();
    for(let i = 0; i < 7; i++) {
        let dateCell = document.createElement('div')
        dateCell.className = 'divTableCell'
        let eventDate = events.find(event => new Date(event.date).toDateString() === today.toDateString())
        if(eventDate){
            dateCell.innerHTML = `
                <div class="divTableHead"><strong>${today.toDateString()}</strong></div>
                <p>${eventDate.name}    ${eventDate.date}</p>
            `
        }else{
            dateCell.innerHTML = `
                <div class="divTableHead"><strong>${today.toDateString()}</strong></div>
            `
        }
        element.appendChild(dateCell)
        today.setDate(today.getDate() + 1)
    }
}
let events = []
let main = async function() {
    events = await eventListGet()
    buildCalendar()
}
main()
