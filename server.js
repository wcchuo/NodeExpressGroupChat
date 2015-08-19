// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
// static content 
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
});

var server = app.listen(8003, function() {
	console.log("Socket listening on port 8003")
});

var io = require('socket.io').listen(server)
var messages = [];
var allMessages = [];


io.sockets.on('connection', function (socket) {
	console.log("Group Chat connected!");
	console.log(socket.id);
    io.emit('all_messages', {
		messages: allMessages
    })

	socket.on('name', function (data){
		console.log('New user: '+data.name+' just joined on '+data.time)
		messages = ('<div class="welcome">'+data.name+' just joined on '+data.time+'. Please say hello to him/her!</div>');
	    allMessages.push(messages);

		socket.broadcast.emit('welcome_new_user', {
			messages: allMessages
		});

		console.log('Current chat record: ' + messages)
	})

	socket.on('send_message', function (data){
	    console.log(data.name + ' sent a message: "' + data.message +'", on '+ data.time);
	    messages = ('<span class="name">' + data.name + ' (' + data.time + ')</span>:<p class="message">&ldquo;' + data.message + '&rdquo;</p>');
	    allMessages.push(messages);
		
	    io.emit('all_messages', {
			messages: allMessages
	    })
	})
})
