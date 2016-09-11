var express = require('express'),
    http = require('http'),
    app = express(),
    pg = require('pg'), //node module to work with PostgreSQL
    conString = "postgres://postgres:1@localhost/math-knowledge",// connection address, 1 - password, math-knowledge - DB name
    pgCamelCase = require('pg-camelcase'), //need to convert snake_case from DB to camelCase used in app
    revertCamelCase = pgCamelCase.inject(pg),
    bodyParser = require("body-parser"); //parse incoming request bodies in a middleware before your handlers, availabe under the req.body property.

app.use(express.static(__dirname + '/app')); //http://localhost:3000/index.html
app.use('/bower_components',  express.static(__dirname + '/bower_components')); //explicitly indicate the way to Bower components

app.use(bodyParser.json()); //parse application/json

app.use(bodyParser.urlencoded({ //parse application/x-www-form-urlencoded
    extended: true
}));

app.listen(3000, function(){
    console.log("Express server listening on port 3000");
});


pg.connect(conString, function(err, client, done) {
    /**PostgreSQL interprets " as being quotes for identifiers, ' as being quotes for strings.*/
    if(err) {
        return console.error('error fetching client from pool', err);
    }
    /**Create a table 'pupils' if it doesn't exist yet, and insert inside 3 pupils (Valik, Vasia and Vania)*/
    client.query("CREATE TABLE IF NOT EXISTS pupils " +
        "(pupil_id SERIAL, name text, password text, grade integer, CONSTRAINT pupil_pk PRIMARY KEY (pupil_id));", function(err, result) {
        if(err) {
            return console.error('error creating table pupils: ', err);
        }
    });
    client.query("SELECT * FROM pupils", function(err, result) {
        if(err) {
            return console.error('error selecting data from pupils table: ', err);
        }
        if(result.rows.length === 0) {
            client.query("INSERT INTO pupils (name, password, grade) VALUES " +
                "('Valik', '12345', 4)," +
                "('Vasia', '23456', 3)," +
                "('Vania', '34567', 3)", function(err, result) {
                if(err) {
                    return console.error('error inserting data to pupils table: ', err);
                }
            });
        }
    });

    /**Compare the data from client login form with data from pupils table. If some of item from the table match with the data from client,
     * check the corresponding problems of this user in table problems, send a reply with pupil data and his problems (if exist) to client*/
    app.post('/login', function (req, res) {
        client.query("SELECT * FROM pupils;", function(err, result) { // получаем логины и пароли с БД из таблицы pupils
            if(err) {
                return console.error('error selecting data from pupils table: ', err);
            } else if(result) {
                var i, reply = {};
                for(i = result.rows.length; i--;) {
                    if(result.rows[i].name === req.body.name && result.rows[i].password === req.body.password) {
                        console.log('Username and password are correct!');
                        reply.accessAllowed = true;
                        reply.name = result.rows[i].name;
                        reply.grade = result.rows[i].grade;
                        reply.id = result.rows[i].pupilId;

                        client.query("SELECT * FROM problems " +
                            "WHERE pupil_id =" + result.rows[i].pupilId + ";", function(err, result) {
                            if (err) {
                                res.end(JSON.stringify(reply));
                                return console.error('error selecting data from problems table: ', err);
                            } else if (result) {
                                reply.problems = result.rows;
                                res.end(JSON.stringify(reply));
                            }
                        });
                        break;
                    } else if(i === 0) {
                        console.log('Username or password are NOT correct!');
                        reply.accessAllowed  = false;
                        res.end(JSON.stringify(reply));
                    }
                }
            }
        });
    });

    /**Create a table problems (if it doesn't exist yet) and put inside new pupil answer*/
    app.post('/problem', function (req, res) {
        var lastProblem = req.body.problems[req.body.problems.length - 1];
        client.query("CREATE TABLE IF NOT EXISTS problems " +
            "(problem_id SERIAL, pupil_id integer, number1 integer, number2 integer, name text, symbol text, correct_ans integer, user_ans integer, success_ans boolean, date text, CONSTRAINT problem_pk PRIMARY KEY (problem_id));", function(err, result) {
            if(err) {
                return console.error('error creating table problems: ', err);
            }
        });
        client.query("INSERT INTO problems (pupil_id, number1, number2, name, symbol, correct_ans, user_ans, success_ans, date) VALUES " +
            "(" + req.body.id + "," + lastProblem.number1 + "," + lastProblem.number2 + "," + "'" + lastProblem.name + "'" + "," +
            "'" + lastProblem.symbol + "'" + "," + lastProblem.correctAns + "," + lastProblem.userAns + "," + lastProblem.successAns + "," +
            "'" + lastProblem.date + "'" + ")", function(err, result) {
            if(err) {
                return console.error('error inserting data in table problems: ', err);
            } else if(result) {
                res.end('New line was inserted in database!');
            }
        });
    });

});