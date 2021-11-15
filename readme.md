# routes

For the routes:

1. static routes are endpoints for main page
2. lobby routes are endpoints in the lobby which mainly about the create/join/leave game room and chat in lobby
3. game routes are the endpoints for inital, load/reload, and other game action during the game period.

* (GET) / &emsp; &check;

* (POST)&emsp;/login  &emsp; &check;

* (POST) &emsp;/signup  &emsp; (need to add tos validation)

* (GET)&emsp;/about &emsp; &cross;

* (GET)&emsp;/transition &emsp; &check;

* (GET)&emsp;/test &emsp;&emsp; This is for test backend routes

* (POST) &emsp;/user/signup   &emsp; &check;

* (POST)&emsp;/user/login   &emsp;&check;

* (POST)&emsp;/user/chang_password &emsp;&check;

* (GET)&emsp;/user/profile  &emsp;&check;

* (GET)&emsp;/lobby/  &emsp;&check;

* (POST)&emsp;/lobby/chat  &emsp;&check; 

* (POST)&emsp;/lobby/createGame &emsp;&check;

* (POST)&emsp;/lobby/joinGame  &emsp;&check;

* (POST)&emsp;/lobby/leaveGame &emsp;&check;


* (GET)&emsp; /game/game_state &emsp;&emsp; Return a JSON game_state to test in frontend
  
* (POST)&emsp;/game/initial &emsp;&check;
  
* (POST)&emsp;/game/load  &emsp; &check; (need to decide render to a new page or return a json);
* /game &emsp;&emsp; under construction
  
# Project Organization
- config 
- controllers 
   - core &emsp;&emsp;&emsp; controllers for non static endpoints
   - static &emsp;&emsp;&emsp; controllers for static endpoints
- db 
   - drivers &emsp;&emsp;&emsp; driver for db query
   - index.js &emsp;&emsp;&cross; Not used anymore
- middleware 
- migrations
- models
- public
   - css
   - images
   - lobby &emsp;&emsp;&emsp; js file for lobby events
   - validation &emsp;&emsp;&emsp; data format validation file
- routes
- seeders
- socket 
   - sock.js &emsp;&emsp;&emsp; instance of server socket, share with each request
   - events.js &emsp;&emsp;&emsp; events of server socket
- util &emsp;&emsp;&emsp; help tools
- views &emsp;&emsp;&emsp; pug engine templates
- volatile &emsp;&emsp;&emsp; volatile data manager
  
