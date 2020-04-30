
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
}

eventListGet()
