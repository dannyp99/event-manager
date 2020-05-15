// Contains all of the fetches to the backend
class Server {
    constructor(){

    }
    //GET all events
    async eventListGet(){
        let eventsResponse = await fetch('/events')
        let eventList = await eventsResponse.json()
        
        let events = []
        for (let event of eventList){ events.push(event) }
        return events
    }
    //POST a new Event
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
        //It can get more than one since multiple can be sent back.
        for (let event of eventList) { 
            let returnedEvent = {id: event.event_id, name: event.event_name, date: event.event_date_str }
            events.push(returnedEvent)
        }
        //Return all of added event's should only return one
        return events
    }
    //DELETE event given the events id
    async eventDelete(event){
        let resp = await fetch(`/events/${event.id}`, {
            method: "DELETE"
        })
        return resp
    }
}

export default Server