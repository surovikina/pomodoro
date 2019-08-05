import * as firebase from "firebase/app";

import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBeNcqQGQ3dhWM3tJeEbCoZD8o_AO74IlE",
    authDomain: "fe-lab-3a94a.firebaseapp.com",
    databaseURL: "https://fe-lab-3a94a.firebaseio.com",
    projectId: "fe-lab-3a94a",
    storageBucket: "fe-lab-3a94a.appspot.com",
    messagingSenderId: "144853144494",
    appId: "1:144853144494:web:7a90353742ff2808"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

export class FirebaseService {

    static getData(path, callback) {
        database.ref(path).once('value')
            .then(snapshot => snapshot.val())
            .then(callback);
    }

    static setData(path, data) {
        database.ref(path).set(data, (error) => {
            if (error) {
                console.error('Data was not saved to Firebase');
            } else {
                console.info('Data was saved successfully');
            }
        }).then();
    }

    static deleteData(path) {
        const targetElem = database.ref(path);
        targetElem.remove()
            .then(function () {
                console.log("Remove succeeded.")
            })
            .catch(function (error) {
                console.log("Remove failed: " + error.message)
            });
    }
}