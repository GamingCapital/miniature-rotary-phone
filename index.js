var http = require('http');
var fs = require('fs');
var path = require('path');
var html = fs.readFileSync('index.html');
var mmm = require('mmmagic'),
    Magic = mmm.Magic;
var magic = new Magic(mmm.MAGIC_MIME_TYPE);

http.createServer(function (req, res) {
    if (req.url === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    } else {
        var cssPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(cssPath);
        magic.detectFile(cssPath, function (err, result) {
            if (err) {
                console.log(err);
                res.writeHead(404);
                res.end("Error NOT FOund");
            }
            if (req.url.endsWith(".css")) {
                result = result.replace("plain", "css")
            } else if (req.url.endsWith(".js")) {
                result = result.replace("plain", "javascript")
            }
            res.writeHead(200, { 'Content-Type': result });
            fileStream.pipe(res);
        })
    }
}).listen(8000);