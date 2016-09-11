app.factory("today", [function() {
    function getDateString() {
        var today = new Date(),
            dd = today.getDate(),
            mm = today.getMonth() + 1,
            yyyy = today.getFullYear();
        if(dd < 10) {
            dd = '0' + dd
        }
        if(mm < 10) {
            mm = '0' + mm
        }
        return mm + '/' + dd + '/' + yyyy;
    }
    return {
        getDateString: getDateString
    }
}]);