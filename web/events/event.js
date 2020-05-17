//Event Class for the actual event
class Event extends EventTarget{
    constructor(data){
        super()
        this.eventData = data
    }

    get id(){
        return this.eventData.id
    }

    set id(new_value){
        this.eventData.id = new_value
    }

    get name(){
        return this.eventData.name
    }

    set name(new_value){
        this.eventData.name = new_value
    }

    get date(){
        return this.eventData.date
    }

    set date(new_value){
        this.eventData.date = new_value
    }
}

export default Event