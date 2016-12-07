var token = 'thisismypermissiontoken';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello world');
});

app.listen(5000, function () {
  console.log('Listening on port 5000');
});

// respond to facebook's verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

// respond to post calls from facebook
app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var incomingText = event.message.text;
      console.log('You sent the message', incomingText);
      sendTextMessage(sender, "Text received, echo: "+ incomingText.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

function sendTextMessage(sender, text) {
  var access_token ='EAAEvYHvZBlOABANO5PCGYADnUitpSAZC8XhOzM1yMQug8AGPKKN8ABY3w07j2XmL0h4sXTNdtwjB4XZCrL5cEIpfKZC96r9V7p4FBoLuvwywumdTOZCWLDFPINOi9txG9YEduRyLw7fJIsVMrjoZBMoed7d2VpRdJkXqPsjY8JtwZDZD';
  var messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:access_token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
