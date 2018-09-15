function FirebaseOutNode(config) {
  if (!config.admin) {
    throw "No firebase admin specified";
  }

  if (!config.ref){
    throw 'Database ref Not Present';
  }

  this.ref = config.ref;
  this.database = config.admin.database;
	this.onStatus = ()=>{}
}

FirebaseOutNode.prototype.onInput = function(msg, out, errorcb) {
  const refPath = msg.ref || this.ref;
  // const ref = this.database.ref(refPath);

  this.database.ref().child(refPath).set(msg.payload, error => {
    if (error){
      errorcb(error);
    } else {
      out(msg);
    }
  });

  // let first = true
  // ref.on('value', snapshot => {
  //   // output on result, or immediately when there's no update
  //   if (!first || (msg.payload === snapshot.val())){
  //     out({payload: snapshot.val()})
  //     return;
  //   }
  //   first = false;
  //   if (!snapshot.exists()){
  //     this.database.ref().child(refPath).set(msg.payload, error => {
  //       if (error){
  //         errorcb(error)
  //       } 
  //     });
  //   } else {
  //     ref.set(msg.payload, error => {
  //       if (error){
  //         errorcb(error)
  //       } 
  //     });
  //   }
  // });
};

FirebaseOutNode.prototype.setStatusCallback = function(cb) {
	this.onStatus = cb;
};

module.exports = FirebaseOutNode