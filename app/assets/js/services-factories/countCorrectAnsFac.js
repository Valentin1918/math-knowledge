app.factory("countCorrectAns", [function() {
    function getNumber(ansArr) {
        var i,
            n = 0;
        for(i = ansArr.length; i--;) {
            if(ansArr[i].successAns) {
                n++;
            }
        }
        return n;
    }
    return {
        getNumber: getNumber
    }
}]);
