class Event{
    constructor(data){
        this.event = data
    }

    get id(){
        return this.event.id
    }

    set id(new_value){
        this.event.id = new_value
    }

    get name(){
        return this.event.name
    }

    set name(new_value){
        this.event.name = new_value
    }

    get date(){
        return this.event.date
    }

    set date(new_value){
        this.event.date = new_value
    }
}

export default Event