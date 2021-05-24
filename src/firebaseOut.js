const FirebaseOutNode = require('./firebaseOutNode');

function validateNodeConfig(n){
  if (!n.ref){
    throw "No ref specified";
  }

  if (!n.operation){
    throw "No operation specified";
  }

  if (!n.admin) {
    throw "No admin specified";
  }
}

module.exports = function(RED) {
  "use strict";

  function FirebaseOut(n) {
    validateNodeConfig(n)

    RED.nodes.createNode(this,n);
    var node = this;

    node.ref = n.ref;
    node.operation = n.operation;
    node.admin = RED.nodes.getNode(n.admin);

    const firebaseOutNode = new FirebaseOutNode(node)
    firebaseOutNode.setStatusCallback(node.status.bind(node))

    node.on('input', msg => {
      node.error(msg);
      firebaseOutNode.onInput(msg, node.send.bind(node), node.error.bind(node))
    })
  }

  RED.nodes.registerType("firebase realtime database out", FirebaseOut);
}


