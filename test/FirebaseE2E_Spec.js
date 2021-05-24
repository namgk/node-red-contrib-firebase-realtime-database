const FirebaseAdminNode = require('node-red-contrib-firebase-admin-config');
const assert = require('assert');

const FirebaseInNode = require('../src/firebaseInNode');
const FirebaseOutNode = require('../src/firebaseOutNode');
const serviceAccountJson = require('./my-firebase-service-credential.json');

describe('Firebase e2e test', function() {
  it('Can get data from firebase, do processing, and save it back', function(done) {
    this.timeout(5000);

  	const firebaseAdminNode = new FirebaseAdminNode({
			serviceAccountJson: serviceAccountJson
		});

    const newRef = `${Math.floor(Math.random() * 100)}`

  	const firebaseInNode = new FirebaseInNode({
  		admin: firebaseAdminNode,
  		ref: newRef
  	});

    const firebaseOutNode = new FirebaseOutNode({
      admin: firebaseAdminNode,
      ref: newRef,
      operation: 'set'
    });

    const initialValue = Math.floor(Math.random() * 100);
    const updateValue = initialValue + 1;

    // retrieve the initialValue 
    firebaseInNode.setOutputCallback(d => {
      if (d.payload != initialValue){
        return;
      }

      // update it
      firebaseOutNode.onInput({
        payload: ++d.payload
      }, nd => {
        assert(nd.payload === updateValue);
        firebaseAdminNode.onClose(null, done);
      }, e => {
        firebaseAdminNode.onClose(null, ()=>{done(1)});
      });
    })

    // create the ref
    firebaseOutNode.onInput({
      payload: 0
    }, d => {
      // save the ref with initial value
      firebaseOutNode.onInput({
        payload: initialValue
      }, console.log, e => {
        firebaseAdminNode.onClose(null, ()=>{});
        done(1);
      })
    }, e => {
      firebaseAdminNode.onClose(null, ()=>{});
      done(1);
    });
  });
});
