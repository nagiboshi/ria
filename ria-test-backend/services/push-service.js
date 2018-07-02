const fireBaseAdmin = require('firebase-admin');

class PushService { 
    // iosPushOptions;
    constructor() {
            const serviceAccount = "./serviceAccountKey.json";

        fireBaseAdmin.initializeApp({
        credential: fireBaseAdmin.credential.cert(serviceAccount),
        databaseURL: "https://riatest-ec40b.firebaseio.com"
        });
    }


send(text) {
    let topic = "articles";
    let message = {
            "topic": "articles",
            "notification": {
                "body":"У вас новые статьи! Посмотрите в рекомендации",
                "title":"ria.test.okpixels.ru"
            },
            "data" : {
                "url" : "http://ria.test.okpixels.ru/#articles"
            },
    };
    
    fireBaseAdmin.messaging().send( message).then((response) => {
        console.log(`Message ${response} successfully sended `);
    }).catch((error) => {
        console.error(`Error sending message. Reason :`, error);
    });
}


}
  
  module.exports = new PushService();