# Chat App (MERN STACK) with sockets for Bi-directional data flow

# frontend
-> I used react as frontend framework and with TailwindCSS i have done styling the components. 

-> with the controlled form, both login and signup pages are created and data is caputured from form with react useState hook.

-> protrected routing is done with protected.jsx component, so that only loggedin users can access home component, and other cannot access home component by directly entering route

-> with react-redux, global state of user is stored, and user state is changed upon on login, so this information protected routing is done.

-> in home component, userinfo, all otherUsers info and conversations are dispalyed in column wise

-> with socker.io-client npm, for events like sendMessage and getMessage, its definations are written, and upon sending and receiving messages these events are called and msg audio is played upon receiving msg

# backend
->with express node moudule, server is setup

->perfect file structure is maintained,i.e models contains mongoose models, controllers contains function definations which executes upon accessing the route, routes contains route for different functions.

->in database passwords are not stored as it is, it is hashed with bcrypt.js and stored in database, so it maintains database security.

->with socket.io module requried events are written to handle msgs sent.

# database
-> 3 models i.e users contains users info, conversation contains ids for users who are in conversation, message conatins message and ids of users sent and received,  with all these msgs are displayed according to 
it in order
