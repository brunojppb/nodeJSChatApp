var http = require('http'); //built in HTTP module provides HTTP server and client functionality

var fs = require('fs'); //built in path module provides file-system path functionality
var path = require('path'); 

var mime = require('mime'); //add-on mime module provides ability to derive a MIME type based  on a filename extension

var cache = {}; //cache object is where the contents of cached files are stored

function send404(response){
    response.writeHead(404, {'Content-type': 'text/plain'});
    console.log("404: Resource not found! - Name: ");
    response.write('Error 404: Resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents){
    response.writeHead(
        200,
        {'content-type': mime.lookup(path.basename(filePath))}
    );

    response.end(fileContents);
}

function serverStatic(response, cache, absPath){
    if(cache[absPath]){
        sendFile(response, absPath, cache[absPath]);
    }
    else{
        fs.exists(absPath, function(exists){
            if(exists){
                fs.readFile(absPath, function(err, data){
                    if(err){
                        send404(response);
                    }
                    else{
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            }
            else{
                send404(response);
            }
        });
    }
}

//creating the HTTP Server
var server = http.createServer(function(request, response){
    var filePath = false;

    if(request.url == '/'){
        filePath = 'public/index.html';
    }
    else{
        filePath = 'public' + request.url;
    }

    var absPath = './' + filePath;
    serverStatic(response, cache, absPath);
});

server.listen(3000, function(){
    console.log("Server listening on port 3000.");
});

//setting up the Socket.IO server funcionality
var chatServer = require('./lib/chat_server');
chatServer.listen(server);


























