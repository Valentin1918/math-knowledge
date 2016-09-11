app.controller('HomePage', ['$cookies', 'localStorage', 'countCorrectAns', 'handleAcceptableProblems', 'httpPostQuery', 'today',
    function($cookies, localStorage, countCorrectAns, handleAcceptableProblems, httpPostQuery, today) {

    var scope = this;
/**-----------------------------------------------------LOGIN---------------------------------------------------------*/
//restore the session according with data in cookies or only initiate a scope.user object
    scope.initSession = function() {
        if($cookies.get('loginName')) {
            scope.user = {
                name: $cookies.get('loginName'),
                id: $cookies.get('pupilId'),
                grade: parseInt($cookies.get('grade')),
                password: '',
                logged: true,
                problems: []
            };
            var user = localStorage.getData('user');
            if(user) {
                if(user.problems.length > 0) {
                    scope.user.problems = user.problems;
                }
            }
            scope.user.correctAnsN = countCorrectAns.getNumber(scope.user.problems);
            scope.user.incorrectAnsN = scope.user.problems.length - scope.user.correctAnsN;
        }else {
            scope.user = {
                name: '',
                id: '',
                grade: '',
                password: '',
                logged: false,
                problems: []
            };
        }
        if($cookies.get('maxAns')) {
            scope.maxAnswer = $cookies.get('maxAns');
        }
        scope.userCurrentAns = '';
    };
/**--------------------------------------------------ALERT-PREPARING--------------------------------------------------*/
    scope.alerts = [];
    scope.closeAlert = function(index) {
        scope.alerts.splice(index, 1);
    };
/**---------------------------------------------------PROBLEMS-INIT---------------------------------------------------*/
//firstly all problems are selected
    scope.initProblems = function() {
        if(!localStorage.getData('selectedProblems')) {
            scope.acceptableProblems = [
                { name : "Addition", symbol : "+", selected : true, disabled: false },
                { name : "Subtraction", symbol : "-", selected : true, disabled: false },
                { name : "Multiplication", symbol : "*", selected : true, disabled: false },
                { name : "Division", symbol : "/", selected : true, disabled: false }
            ];
            localStorage.setData('selectedProblems', scope.acceptableProblems);
        }else {
            scope.acceptableProblems = localStorage.getData('selectedProblems');
        }
    };
//update problems selected parameter according with Setting tab
    scope.updateSelectedProblems = function() {
        scope.acceptableProblems = handleAcceptableProblems.enableAll(scope.acceptableProblems);
        var lastSelectedProblem = handleAcceptableProblems.getLastSelectedProblem(scope.acceptableProblems);
        if(lastSelectedProblem !== undefined) {
            scope.acceptableProblems[lastSelectedProblem].disabled = true;
        }
        localStorage.setData('selectedProblems', scope.acceptableProblems);
        scope.makeRandomProblem(scope.makeRandomAcceptableProblem());
    };
/**---------------------------------------------------INIT-PAGE-------------------------------------------------------*/
    scope.init = function() {
        scope.initSession();
        scope.initProblems();
    };
    scope.init();
/**----------------------------------------------------USER-----------------------------------------------------------*/
//during initial user login communicate with server and receive the reply
    scope.userLogIn = function(form) {
        var firstError = null;
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
                if (field[0] != '$') {
                    if (firstError === null && !form[field].$valid) {
                        firstError = form[field].$name;
                    }
                    if (form[field].$pristine) {
                        form[field].$dirty = true;
                    }
                }
            }
            angular.element('.ng-invalid[name=' + firstError + ']').focus();
            return;
        } else {
            scope.loginDataPromisePost = httpPostQuery.postData('/login', JSON.stringify(scope.user));
            scope.loginDataPromisePost.then(function(value) {
                console.log('object is send, reply is:');
                console.log(value);
                if(value.accessAllowed) {
                    $cookies.put('loginName', value.name);
                    $cookies.put('grade', value.grade);
                    $cookies.put('pupilId', value.id);
                    if(value.problems) {
                        scope.user.problems = value.problems;
                        localStorage.setData('user', scope.user);
                    }
                    scope.setMaxAns();
                    scope.makeRandomProblem(scope.makeRandomAcceptableProblem());
                    scope.initSession();
                }else {
                    console.warn('Login name or password are not correct!');
                    scope.alerts = [{msg: 'Login name or password are not correct!'}];
                }
            });
        }
    };
//user logout remove all data from cookies and from local storage
    scope.userLogOut = function(form) {
        $cookies.remove('loginName');
        $cookies.remove('grade');
        $cookies.remove('pupilId');
        $cookies.remove('maxAns');
        localStorage.deleteData('selectedProblems');
        localStorage.deleteData('user');
        scope.initSession();
        form.$setPristine();
    };
/**-----------------------------------------------PROBLEM-GENERATOR---------------------------------------------------*/
//depends on pupil grade set the maximum possible answer (complexity of the generated problems depends on this value)
    scope.setMaxAns = function() {
        var userCurrentGrade = parseInt($cookies.get('grade'));
        switch(userCurrentGrade) {
            case 1:
                scope.maxAnswer = 20;
                break;
            case 2:
                scope.maxAnswer = 70;
                break;
            case 3:
                scope.maxAnswer = 100;
                break;
            case 4:
                scope.maxAnswer = 300;
                break;
            case 5:
                scope.maxAnswer = 1000;
                break;
            default:
                scope.maxAnswer = 100;
        }
        $cookies.put('maxAns', scope.maxAnswer);
    };
//select the problem type between selected problems on Settings tab
    scope.makeRandomAcceptableProblem = function() {
        var selectedArr = [],
            i;
        for(i = scope.acceptableProblems.length; i--;) {
            if(scope.acceptableProblems[i].selected) {
                selectedArr.push(i);
            }
        }
        var randomProblemIndex = selectedArr[Math.floor(Math.random() * selectedArr.length)];
        return scope.acceptableProblems[randomProblemIndex];
    };
//generate a random problem according with random problem type and maximum answer
    scope.makeRandomProblem = function(type) {
        var problem = {};
        if(type.name !== 'Division' && type.name !== 'Multiplication') {
            problem.number1 = Math.floor(scope.maxAnswer * Math.random());
            if(type.name === 'Addition') {
                problem.number2 = Math.floor((scope.maxAnswer - problem.number1) * Math.random());
                problem.correctAns = problem.number1 + problem.number2;
            } else if(type.name === 'Subtraction') {
                problem.number2 = Math.floor(problem.number1 * Math.random());
                problem.correctAns = problem.number1 - problem.number2;
            }
        }else {
            if(type.name === 'Division') {
                problem.number2 = Math.ceil(Math.sqrt(scope.maxAnswer) * Math.random());
                problem.correctAns = Math.floor(Math.sqrt(scope.maxAnswer) * Math.random());
                problem.number1 = problem.number2 * problem.correctAns;
            } else if(type.name === 'Multiplication') {
                problem.number2 = Math.floor(Math.sqrt(scope.maxAnswer) * Math.random());
                problem.number1 = Math.floor(Math.sqrt(scope.maxAnswer) * Math.random());
                problem.correctAns = problem.number1 * problem.number2;
            }
        }
        problem.name = type.name;
        problem.symbol = type.symbol;
        scope.currentProblem = problem;
    };
    scope.makeRandomProblem(scope.makeRandomAcceptableProblem());
/**-----------------------------------------------------REPLY---------------------------------------------------------*/
//send to server the reply of the pupil, update the list of replied problems, update correct/incorrect answers counter, generate a new problem
    scope.reply = function(form) {
        var firstError = null;
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
                if (field[0] != '$') {
                    if (firstError === null && !form[field].$valid) {
                        firstError = form[field].$name;
                    }
                    if (form[field].$pristine) {
                        form[field].$dirty = true;
                    }
                }
            }
            angular.element('.ng-invalid[name=' + firstError + ']').focus();
            return;
        } else {
            scope.currentProblem.userAns = parseInt(scope.userCurrentAns);
            scope.currentProblem.successAns = scope.currentProblem.userAns === scope.currentProblem.correctAns;
            scope.currentProblem.date = today.getDateString();
            scope.user.problems.push(scope.currentProblem);
            scope.user.correctAnsN = countCorrectAns.getNumber(scope.user.problems);
            scope.user.incorrectAnsN = scope.user.problems.length - scope.user.correctAnsN;

            scope.problemDataPromisePost = httpPostQuery.postData('/problem', JSON.stringify(scope.user));
            scope.problemDataPromisePost.then(function(value) {
                console.log('object is send, reply is:');
                console.log(value);
            });

            localStorage.setData('user', scope.user);

            scope.userCurrentAns = '';
            form.$setPristine();
            scope.makeRandomProblem(scope.makeRandomAcceptableProblem());
        }
    };


}]);