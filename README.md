# Math knowledge project
Math knowledge project made on NodeJS, AngularJS and Bootstrap


## Initial steps:


### 0) Before start install postgreSQL, node and npm on your computer!

### 1) In postgreSQL create a DB "math-knowledge"

### 2) Your "connect to server password" in postgreSQL need to be equal 1
if not, go to server.js and on the 5-th line change 1 to your own password inside conString

### 3) Install Bower (If you haven't Bower in your computer):

*__npm install -g bower__*

## Go to the project folder and:

### 4) Install the project dependencies listed in bower.json:

*__bower install__*

If your command line throw an error during *__bower install__* -- try *__bower cache clean__* and do it again

If it will be proposed to chose the Angular version -- select answer ? __4__

### 5) Install the node modules listed in package.json:

*__npm install__*

### 6) run *__node server.js__* in your command line.

### 7) go to *__http://localhost:3000/index.html__* in your browser.


## Using:

During first server run will be created created table "pupils" with columns: pupil_id, name, password and grade:
1 Valik 12345 4
2 Vasia 23456 3
3 Vania 34567 3
Use them to login
Grade influence on complexity of the generated problems

After login you can select needed problems type in Settings tab and use the main app functionality in Task tab
All answers are visualised in table below the generated problem and correct/incorrect answers counter.
The same time each answer is saved in "problems" table in DB (in case of first answer this table creates).
After that you can logout (all cookies and local storage data is removes).
During next login you will see all your previous result (with answers counters and all answers).
The data which is stored in linked "pupils" and "problems" tables will be enough to procure all indicated in task SQL queries.