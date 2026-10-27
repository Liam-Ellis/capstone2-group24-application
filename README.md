Capstone 2 group 24's code.
there are likely some files here that aren't fully necessary or used

This app can also be localhosted for testing purposes, as all tests connect to localhost. You can run the frontend by going into the client folder and running the command “npm run dev”.
You can run the backend by going into the root folder and running the command “node .\app.js”. 
This will run the program on http://localhost:5173/ by default for the frontend and http://localhost:3000 by default for the backend. 
You will also need to go into client\src\backendURL.jsx and swap the backendURL by adding “//” to the start of the second line and removing “//” from the first line. 
Secondly you will need to set the db to the test db. Go to the file:
client\src\backendURL.jsx
Then move the starting “//” in line 8 to the start of line 9


Testing currently requires connecting to our database. since this is a public repo we will not be providing the env variables here. check the handover document for the env file we used for testing

