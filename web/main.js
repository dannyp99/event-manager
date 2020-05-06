function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
}

function isThisWeek(eventDate){
    let weekEnd = new Date()
    const weekStart = new Date()
    weekEnd.setDate(weekEnd.getDate() + 7)
    return weekEnd > eventDate && eventDate > weekStart
}

function isDuplicateEvent(eventName,eventDate){
    const foundEvent = events.find(event => event.name === eventName && event.date === eventDate.toLocaleDateString())
    if(foundEvent){
        return true
    }else{
        return false
    }
}

function buildEventElement(event){
    let newEvent = document.createElement('event-summary')
    let eventContent = document.createElement('p')
    eventContent.innerText = `${event.name}: ${event.date}`
    newEvent.appendChild(eventContent)
    eventContent.addEventListener('click', (event)=> {
        updateEventModifier(event.target)
    })
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
        let eventDates = events.filter(event => new Date(event.date).toDateString() === today.toDateString())
        if(eventDates.length > 0){
            dateCell.innerHTML = `<div class="divTableHead"><strong>${today.toDateString()}</strong></div>`
            eventDates.forEach(eventDate => {
                let event = document.createElement('p')
                event.innerText = `${eventDate.name} ${eventDate.date}`
                dateCell.appendChild(event)
            })
        
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
    if(isDuplicateEvent(eventName, eventDateAsDate)){return}
    const newEvent = {id: '', name: eventName, date: eventDateAsDate.toLocaleDateString()}
    let resp = await eventListPost(newEvent)
    if(resp.ok){
        let content = await resp.json()
        events.push(content)
        updateEventList(content)
        if(isThisWeek(eventDateAsDate)){
            updateCalendar(content)
        }
    }else{
        console.log(`Failed to add Event Error: ${resp.status}`)
    }
}

function updateEventModifier(eventSummary){
    let eventItems =  eventSummary.innerText.split(':')
    let htmlDate = formatDate(eventItems[1])
    document.getElementById('eventName').value = eventItems[0]
    document.getElementById('eventDate').value = htmlDate
}

async function deleteEventButton(){
    
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
    var deleteButton = document.getElementById('removeEvent')
    deleteButton.addEventListener('click', (event)=> {
        deleteEventButton()
    })
}
main()
