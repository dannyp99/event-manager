
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

function updateEventList(event){
    let eventListElement = document.querySelector('event-list')
    let newEvent = buildEventElement(event)
    eventListElement.appendChild(newEvent)
}

async function eventListGet(){
    let eventsResponse = await fetch('/events')
    let eventList = await eventsResponse.json()
    createEventList(eventList)
    return eventList
}

async function eventListPost(newEvent){
    let eventResponse = await fetch('/events', {
        method: "POST",
        body: JSON.stringify(newEvent),
        headers: {
            'Content-Type': 'application/json'
        }        
    })
    return eventResponse
}

function buildCalendar() {
    let element = document.querySelector('div.divTableRow')
    let today = new Date();
    let weekDates = []
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
        weekDates.push(today.toDateString())
        today.setDate(today.getDate() + 1)
    }
    return weekDates
}

function updateCalendar(newEvent){
    let dateCell = document.createElement('p')
    dateCell.innerText = `${newEvent.name}  ${newEvent.date}`
    let element = document.querySelectorAll('div.divTableCell')
    let eventAsDateString = new Date(newEvent.date).toDateString()
    const idx = calendarDates.findIndex(date => date === eventAsDateString)
    element[idx].appendChild(dateCell)
}

async function addEventButton(){
    const eventName = document.getElementById('eventName').value
        const eventDate = document.getElementById('eventDate').value
        if(eventName === '' || eventDate === ''){return}
        const eventDateAsDate = new Date(eventDate)
        eventDateAsDate.setDate(eventDateAsDate.getDate() + 1)
        let weekEnd = new Date()
        weekEnd.setDate(weekEnd.getDate() + 7)
        const newEvent = {id: '', name: eventName, date: eventDateAsDate.toLocaleDateString()}
        let resp = await eventListPost(newEvent)
        if(resp.ok){
            let content = await resp.json()
            events.push(content)
            updateEventList(content)
            if(weekEnd > eventDateAsDate){
                updateCalendar(content)
            }
        }else{
            console.log(`Failed to add Event Error: ${resp.status}`)
        }
}

let events = []
let calendarDates = []
let main = async function() {
    events = await eventListGet()
    calendarDates = buildCalendar()
    var addButton = document.getElementById('addEvent')
    addButton.addEventListener('click', (event) => {
        addEventButton()
    })
}
main()
