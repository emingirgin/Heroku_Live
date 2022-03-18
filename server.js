"use strict";
exports.__esModule = true;
var http = require("http");
var fs = require("fs");
var mime = require("mime-types");
var hostname = 'localhost';
var port = 3000;
var lookup = mime.lookup; // alias for mime.lookup
// create a server object (Immutable)
var server = http.createServer(function (req, res) {
    var parsedURL = new URL(req.url, "http://" + hostname + ":" + port);
    var path = parsedURL.pathname.replace(/^\/+|\/+$/g, "");
    if (path == "") {
        path = "index.html";
    }
    var file = __dirname + "\\" + path;
    fs.readFile(file, function (err, content) {
        if (err) {
            res.writeHead(404); // file not found
            res.end(JSON.stringify(err));
            return;
        }
        res.setHeader("X-Content-Type-Options", "nosniff");
        var mimeType = lookup(path);
        res.writeHead(200, "", { "Content-Type": mimeType });
        res.end(content);
    });
});
// creating an event listener
server.listen(port, hostname, function () {
    console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});
