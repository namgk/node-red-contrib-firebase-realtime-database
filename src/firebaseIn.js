const FirebaseInNode = require('./firebaseInNode');

function validateNodeConfig(n){
  if (!n.ref){
    throw "No ref specified";
  }

  if (!n.admin) {
    throw "No admin specified";
  }
}

module.exports = function(RED) {
  "use strict";

  function FirebaseIn(n) {
    validateNodeConfig(n)

    RED.nodes.createNode(this,n);
    var node = this;

    node.ref = n.ref;
    node.dataAtStart = n.dataAtStart;
    node.admin = RED.nodes.getNode(n.admin);

    const firebaseInNode = new FirebaseInNode(node)
    firebaseInNode.setOutputCallback(node.send.bind(node))
    firebaseInNode.setStatusCallback(node.status.bind(node))
  }

  RED.nodes.registerType("firebase realtime database in", FirebaseIn);
}


