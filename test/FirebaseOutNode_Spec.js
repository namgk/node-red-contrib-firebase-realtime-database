const FirebaseAdminNode = require('../src/FirebaseAdminNode');
const assert = require('assert');

const FirebaseOutNode = require('../src/FirebaseOutNode');
const serviceAccountJson = require('./my-firebase-service-credential.json');

describe('FirebaseOutNode', function() {
	it('Fail without ref', function() {
  	const firebaseAdminNode = new FirebaseAdminNode({
			serviceAccountJson: serviceAccountJson
		});
  	try {
	  	const firebaseOutNode = new FirebaseOutNode({
	  		admin: firebaseAdminNode
	  	});
	  	assert.fail()
  	} catch (e){
      firebaseAdminNode.onClose(null, ()=>{});
  	}
  });

  it('Fail without admin', function() {
  	try {
	  	const firebaseOutNode = new FirebaseOutNode({
	  		ref: 'test'
	  	});
	  	assert.fail()
  	} catch (e){}
  });

  it('Can set data to firebase', function(done) {
    this.timeout(3000);

  	const firebaseAdminNode = new FirebaseAdminNode({
			serviceAccountJson: serviceAccountJson
		});

  	const firebaseOutNode = new FirebaseOutNode({
  		admin: firebaseAdminNode,
  		ref: `${Math.floor(Math.random() * 100)}`
  	});

    const toBeUpdated = Math.floor(Math.random() * 100);

  	firebaseOutNode.onInput({
      payload: toBeUpdated
    }, d => {
      assert(d.payload === toBeUpdated);
      firebaseAdminNode.onClose(null, done);
    }, e => {
      firebaseAdminNode.onClose(null, ()=>{done(1)});
    });
  });
});