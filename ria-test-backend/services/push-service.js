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
    let topic = "articles";
    let message = {
        "topic":"articles",
        "message": {
            "topic": "articles",
            "notification": {
                "body":"У вас новые статьи! Посмотрите в рекомендации",
                "title":"ria.test.okpixels.ru"
            },
            "data" : {
                "url" : "http://ria.test.okpixels.ru/#articles"
              },
              "android":{
                "priority":"normal"
              },
              "apns":{
                "headers":{
                  "apns-priority":"5"
                }
              },
              "webpush": {
                "headers": {
                  "Urgency": "high"
                }
              }
        }
    };
    
    fireBaseAdmin.messaging().send( message).then((response) => {
        console.log(`Message ${response} successfully sended `);
    }).catch((error) => {
        console.error(`Error sending message. Reason :`, error);
    });
}


}
  
  module.exports = new PushService();