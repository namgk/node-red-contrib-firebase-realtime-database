const FirebaseAdminNode = require('../src/FirebaseAdminNode');
const assert = require('assert');

const FirebaseInNode = require('../src/FirebaseInNode');
const serviceAccountJson = require('./my-firebase-service-credential.json');

describe('FirebaseInNode', function() {
	it('Fail without ref', function() {
  	const firebaseAdminNode = new FirebaseAdminNode({
			serviceAccountJson: serviceAccountJson
		});
  	try {
	  	const firebaseInNode = new FirebaseInNode({
	  		admin: firebaseAdminNode
	  	});
	  	assert.fail()
  	} catch (e){
      firebaseAdminNode.onClose(null, ()=>{});
  	}
  });

  it('Fail without admin', function() {
  	try {
	  	const firebaseInNode = new FirebaseInNode({
	  		ref: 'test'
	  	});
	  	assert.fail()
  	} catch (e){}
  });

  it('Can not get data from firebase', function(done) {
    this.timeout(3000);
  	const firebaseAdminNode = new FirebaseAdminNode({
			serviceAccountJson: serviceAccountJson
		});

  	const firebaseInNode = new FirebaseInNode({
  		admin: firebaseAdminNode,
  		ref: 'test'
  	});

    let doneCalled = false
  	firebaseInNode.setOutputCallback(d => {
      firebaseAdminNode.onClose(null, ()=>{
        doneCalled = true
        done(d)
      });
  	})

    setTimeout(()=>{
      if (!doneCalled){
        firebaseAdminNode.onClose(null, done);
      }
    }, 2000)
  });

  it('Can get data from firebase. NOTE!!! Put some data into the database first!!!', function(done) {
    this.timeout(2000);
    const firebaseAdminNode = new FirebaseAdminNode({
      serviceAccountJson: serviceAccountJson
    });

    const firebaseInNode = new FirebaseInNode({
      admin: firebaseAdminNode,
      ref: '/',
      dataAtStart: true
    });
    firebaseInNode.setOutputCallback(d => {
      firebaseAdminNode.onClose(null, done);
    })
  });
});