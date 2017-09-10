var express = require('express');
var reload = require('reload');
var app = express();
var dataFile = require('./data/data.json');
var io = require('socket.io')();
var bodyParser = require('body-parser');
var validator = require('express-validator');

app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = 'Roux Meetups';

app.locals.allSpeakers = dataFile.speakers;

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/register'));
app.use(require('./routes/catfishGallery'));
app.use(require('./routes/upload_video_route'));
app.use(require('./routes/team'));
app.use(require('./routes/feedback'));
app.use(require('./routes/titlePage'));
app.use(require('./routes/chat'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});

server.timeout = 900000000; //ms

io.attach(server);
io.on('connection', function(socket) {
  socket.on('postMessage', function(data) {
    io.emit('updateMessages', data);
  });
});

reload(server, app);
