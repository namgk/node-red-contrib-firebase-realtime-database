const assert = require('assert');
const chai = require('chai');

const expect = chai.expect;

const FirebaseAdminNode = require('../src/FirebaseAdminNode');
const serviceAccountJson = require('./my-firebase-service-credential.json');

describe('FirebaseAdminNode', function() {
  it('Can authenticate with Google Firebase', function(done) {
		let firebaseAdminNode = new FirebaseAdminNode({
			serviceAccountJson: serviceAccountJson
		});

		assert.notEqual(firebaseAdminNode._firebaseAdmin, null);
		assert.notEqual(firebaseAdminNode.database, null);

		firebaseAdminNode._firebaseAdmin.app().INTERNAL.getToken()
			.then((d)=>{
				expect(d).to.have.keys(['accessToken', 'expirationTime']);
				// clean up
		    let deletePromises = [];
				firebaseAdminNode._firebaseAdmin.apps.forEach((app) => {
		      deletePromises.push(app.delete());
		    });
		    Promise.all(deletePromises).then(()=>done());
			})
			.catch(e => {
		    // clean up and fail
		    let deletePromises = [];
				firebaseAdminNode._firebaseAdmin.apps.forEach((app) => {
		      deletePromises.push(app.delete());
		    });
		    Promise.all(deletePromises).then(done);
			})
  });

  it('Can close', function(done) {
  	this.timeout(3000);
		let firebaseAdminNode = new FirebaseAdminNode({
			serviceAccountJson: serviceAccountJson
		});

		firebaseAdminNode._firebaseAdmin.app().INTERNAL.getToken()
			.then((d)=>{
				firebaseAdminNode.onClose(null, ()=>{});
				setTimeout(()=>{
					try {
						firebaseAdminNode._firebaseAdmin.app();
					} catch (e){
						done();
					}
				}, 2000)
			})
			.catch(e => {
		    // clean up and fail
		    let deletePromises = [];
				firebaseAdminNode._firebaseAdmin.apps.forEach((app) => {
		      deletePromises.push(app.delete());
		    });
		    Promise.all(deletePromises).then(done);
			})
  });
});