# Upgrading to version 1.x.x
New versions starting from 1.0.0 externalize the admin configuration node, so you need to install node-red-contrib-firebase-admin-config before installing and using this node:

    npm i node-red-contrib-firebase-admin-config
    
Also due to naming conflicts, some of the node names have been changed, if you seen a node is not found when starting Node-RED, just delete them from the editor and re-add them from the pallete.

# Communicate with Google Firebase real-time database

These nodes use the new firebase-admin API and service account json is used for authentication.

## To run test, create a file in the test folder:

    cd test && touch my-firebase-service-credential.json

Setup a firebase project, get and paste the service account json to this file.

Then do

    npm run test

