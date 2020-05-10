class Server {
    constructor(){

    }

    async eventListGet(){
        let eventsResponse = await fetch('/events')
        let eventList = await eventsResponse.json()
        
        let events = []
        for (let event of eventList){ events.push(event) }
        return events
    }

    async eventListPost(newEvent){
        let eventResponse = await fetch('/events', {
            method: "POST",
            body: JSON.stringify(newEvent),
            headers: {
                'Content-Type': 'application/json'
            }        
        })
        let eventList = await eventResponse.json()
        
        let events = []
        for (let event of eventList) { 
            let returnedEvent = {id: event.event_id, name: event.event_name, date: event.event_date_str }
            events.push(returnedEvent)
        }
        return events
    }

    async eventDelete(event){
        let resp = await fetch(`/events/${event.id}`, {
            method: "DELETE"
        })
        return resp
    }
}

export default Server