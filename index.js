const net = require('net')
const frame = require('frame-stream')

var leader_node = null
var leader_encoder = null

var events = {}

function send_to_leader(message) {
  if (leader_encoder == null) {
    leader_encoder = frame.encode()
    leader_encoder.pipe(leader_node)
  }
  console.log('sending response:', message)
  leader_encoder.write(message)
}

function on_close(socket) {
  console.log('connection closed')
  if (socket == leader_node) {
    leader_node = null
    leader_encoder = null
  }
}

function on_message(socket, message) {

  console.log('new message:', message)

  if (message == '{"leader":true}') {
    console.log('new leader')
    leader_node = socket
    leader_encoder = null
    return
  } else if (leader_node == null) {
    console.log('no current leader')
    return
  }

  var node = JSON.parse(message)

  var callback = events[node.action]
  if (callback) {
    var node_action = node.action
    var data = node.data;
    delete node.action;
    delete node.data;
    var response = callback(node, data);
    if (response) {
      if (typeof response == "number" || typeof response == "string") {
        if (node_action == 'user_signup' || node_action == 'user_login') {
          response = { pubkey: node.public_key, user_id: response }
        } else if (node_action == 'new_node') {
          response = { pubkey: node.public_key, node_type: response }
        }
      }
      console.log('sending back to the leader:', response)
      send_to_leader(JSON.stringify(response))
    }
  } else {
    console.log('unhandled command:', node.action)
  }

}

exports.on = function(name,callback) {
  events[name] = callback;
}

exports.run = function(port,callback) {

  net.createServer(function(socket) {
    console.log('new connection')
    socket.pipe(frame.decode()).on('data', function(buf) {
      on_message(socket, buf.toString())
    })
    socket.on('close', function() {
      on_close(socket)
    })
  }).listen(port, callback);

}
