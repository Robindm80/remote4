var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('index.html');
});
server.listen(process.env.PORT);


io.on('connection', (socket) => {
	socket.join('gameroom', () => {
    
	socket.username = 'gameroom';
	
	console.log(socket.username);
	
	countclients();
		
	io.sockets.in('waiting room').emit('connectToRoom', "You are in the waitingroom");
	io.sockets.in('gameroom').emit('connectToRoom', "You are in the gameroom");
	}
	
    socket.on('right', function (data) {
		socket.broadcast.emit('right', data);
		console.log('right is being broadcasted');
	});
	
	socket.on('left', function (data) {
		socket.broadcast.emit('left', data);
		console.log('left is being broadcasted');
	});
	
	socket.on('explode', function (data) {
		socket.broadcast.emit('explode', data);
		console.log('explode is being broadcasted');
	});
	
	socket.on('implode', function (data) {
		socket.broadcast.emit('implode', data);
		console.log('implode is being broadcasted');
	});
	
	socket.on('blok', function (data) {
		socket.broadcast.emit('blok', data);
		console.log('blok is being broadcasted');
	});
	
	socket.on('reader', function (data) {
		socket.broadcast.emit('reader', data);
		console.log('reader is being broadcasted');
	});
	
	socket.on('color', function (data) {
		socket.broadcast.emit('color', data);
		console.log('color is being broadcasted');
	});

    socket.on('disconnect', function () {
        console.log('disconnect.');
		leaverooms();
    });
});

	function leaverooms(){
	  if (socket.username === "gameroom"){ 
			console.log("player left gameroom");
			moveplayers();
		}
		else if (socket.username === "waitingroom"){  
			console.log("player left waitingroom");
			var i = allClients.indexOf(socket);
			allClients[i].leave('waiting room');
			allClients.splice(i, 1);
			console.log(allClients[0].id);
		}
	}
  function countclients(){
	if(io.nsps['/'].adapter.rooms['gameroom'].length > 2){
		socket.leave('gameroom');
		socket.join('waiting room');
		socket.username = 'waitingroom';
		allClients.push(socket);
		
		console.log(socket.username);
				
		io.sockets.in('waiting room').emit('connectToRoom', "You are in the waitingroom");
		io.sockets.in('gameroom').emit('connectToRoom', "You are in the gameroom");
	}
  }
  
  
	function moveplayers(){
	if (io.nsps['/'].adapter.rooms['waiting room'] != undefined){
		if(io.nsps['/'].adapter.rooms['gameroom'].length < 2 && io.nsps['/'].adapter.rooms['waiting room'].length > 0) {
			console.log('true');
			var i = 0;
			allClients[i].leave('waiting room');
			allClients[i].join('gameroom');
			allClients[i].username = 'gameroom';
			
			console.log(allClients[i].username);
		
			allClients.splice(i, 1);
		}
   }
  
	io.sockets.in('waiting room').emit('connectToRoom', "You are in the waitingroom");
	io.sockets.in('gameroom').emit('connectToRoom', "You are in the gameroom");
  
	for(var i = 0; i < allClients.length; i++){
		console.log(allClients[i].id)
		console.log("the id of client 0: "+ allClients[0].id);
	}
  }

});
