var app = require('express')();
var http = require('http');
var io = require('socket.io')(http);

var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
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
