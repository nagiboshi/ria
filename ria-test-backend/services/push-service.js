const fireBaseAdmin = require('firebase-admin');

class PushService { 
    // iosPushOptions;
    constructor() {
        // this.iosPushOptions = {
        //     keyFile  : 'key.pem',
        //     certFile : 'cert.pem',
        //     debug    : true,
        //     gateway  : 'gateway.sandbox.push.apple.com',
        //     errorCallback : function(num, err) {
        //         console.error(err);
        //     }
        // };

        const serviceAccount = "./serviceAccountKey.json";

        fireBaseAdmin.initializeApp({
        credential: fireBaseAdmin.credential.cert(serviceAccount),
        databaseURL: "https://riatest-ec40b.firebaseio.com"
        });
    }


send(text) {
// See documentation on defining a message payload.
let topic = "articles";
var message = {
  data: {
    updated: true
  },
  topic: topic
};
fireBaseAdmin.messaging().send(message).then((response) => {
    console.log(`Message ${response} successfully sended `);
}).catch((error) => {
    console.error(`Error sending message. Reason :`, error);
});
     //   fireBaseAdmin.messaging().send()
}


}
  
  module.exports = new PushService();