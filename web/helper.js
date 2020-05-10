class Helper {

    formatDate(date) {
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

    isThisWeek(eventDate){
        let weekEnd = new Date()
        const weekStart = new Date()
        weekEnd.setDate(weekEnd.getDate() + 7)
        return weekEnd > eventDate && eventDate > weekStart
    }

    isDuplicateEvent(dupName, dupDate, events){
        const foundEvent = events.find(event => event.name === dupName && event.date === dupDate.toLocaleDateString())
        if(foundEvent){
            return true
        }else{
            return false
        }
    }

    findHtmlEvent(htmlEvents,delEvent){
        let delEventId = delEvent.id.toString()
        for (let event of htmlEvents) {
            if(event.id === delEventId){
                return event
            }
        }
        return undefined
    }
}

export default Helper