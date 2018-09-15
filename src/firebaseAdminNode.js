var firebaseAdmin = require('firebase-admin');

function FirebaseAdminNode(config) {
  if (!config.serviceAccountJson){
    throw 'Service Account Json Not Present';
  }

  this.app = firebaseAdmin.initializeApp({
	  credential: firebaseAdmin.credential.cert(config.serviceAccountJson),
	  databaseURL: `https://${config.serviceAccountJson.project_id}.firebaseio.com`
	});

	this._firebaseAdmin = firebaseAdmin;
	this.database = firebaseAdmin.database();
}

FirebaseAdminNode.prototype.onClose = function(removed, done) {
	let deletePromises = [];
	firebaseAdmin.apps.forEach((app) => {
    deletePromises.push(app.delete());
  });
  Promise.all(deletePromises)
  .then(()=>{
 		done()
 	})
 	.catch((e)=>{
  	console.log(e)
 		done()
 });
};

module.exports = FirebaseAdminNode