const FirebaseAdminNode = require('node-red-contrib-firebase-admin-config');
const assert = require('assert');

const FirebaseOutNode = require('../src/firebaseOutNode');
const serviceAccountJson = require('./my-firebase-service-credential.json');

describe('FirebaseOutNode', function() {
	it('Fail without ref', function(done) {
  	const firebaseAdminNode = new FirebaseAdminNode({
			serviceAccountJson: serviceAccountJson
		});
  	try {
	  	const firebaseOutNode = new FirebaseOutNode({
        operation: 'set',
	  		admin: firebaseAdminNode
	  	});
	  	assert.fail()
  	} catch (e){
      firebaseAdminNode.onClose(null, done);
  	}
  });

  it('Fails without operation', function(done) {
    const firebaseAdminNode = new FirebaseAdminNode({
      serviceAccountJson: serviceAccountJson
    });
    try {
      const firebaseInNode = new FirebaseOutNode({
        ref: 'test',
        admin: firebaseAdminNode
      });
      assert.fail()
    } catch (e){
      firebaseAdminNode.onClose(null, done);
    }
  });

  it('Fail without admin', function() {
  	try {
	  	const firebaseOutNode = new FirebaseOutNode({
	  		ref: 'test',
        operation: 'set'
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
      operation: 'set',
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

  it('Can push data to firebase', function(done) {
    this.timeout(3000);

    const firebaseAdminNode = new FirebaseAdminNode({
      serviceAccountJson: serviceAccountJson
    });

    const firebaseOutNode = new FirebaseOutNode({
      admin: firebaseAdminNode,
      operation: 'push',
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
