app.factory("handleAcceptableProblems", [function() {
    function getLastSelectedProblem(acceptableProblemsArr) {
        var i,
            ni,
            n = 0;
        for(i = acceptableProblemsArr.length; i--;) {
            if(acceptableProblemsArr[i].selected) {
                n++;
                ni = i;
            }
        }
        if(n === 1) {
            return ni;
        }
    }
    function enableAll(acceptableProblemsArr) {
        var i;
        for(i = acceptableProblemsArr.length; i--;) {
            acceptableProblemsArr[i].disabled = false;
        }
        return acceptableProblemsArr;
    }
    return {
        getLastSelectedProblem: getLastSelectedProblem,
        enableAll: enableAll
    }
}]);
