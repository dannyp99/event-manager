//Contains misc function that help with some of the logic in different views.
class Helper {
    // Convert the date I use "5/12/2020" to 2020-12-5
    formatDate(date) {
        var d = Date.create(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        return [year, month, day].join('-');
    }
    // Given the list of events determine if the inputed name and date already exist
    isDuplicateEvent(dupName, dupDate, events){
        //Search for the first occurence of that event
        const foundEvent = events.find(event => event.name === dupName && event.date === Date.create(dupDate).toLocaleDateString())
        //If something is found then we have a duplicate.
        if(foundEvent){
            return true
        //Else it's unique
        }else{
            return false
        }
    }
    // From the html list of elements find the event I want to delete.
    findHtmlEvent(htmlEvents,delEvent){
        let delEventId = delEvent.id.toString()
        for (let event of htmlEvents) {
            if(event.id === delEventId){
                return event
            }
        }
        return undefined
    }
    
    findHtmlId(htmlEvents, event){
        let idx = 0;
        const delEventId = event.id.toString()
        for(let event of htmlEvents){
            if(event.id === delEventId){
                return idx
            }else{
                idx += 1
            }
        }
        return -1
    }
}

export default Helper