// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


(function (window) {
    'use strict';
    var App = window.App || {};
    
/*       window.FirebaseConfig = {
        apiKey: "a string from Firestore",
        authDomain: "a string from Firestore",
        projectId: "a string from Firestore",
        storageBucket: "a string from Firestore",
        messagingSenderId: "a string from Firestore",
        appId: "a string from Firestore",
        measurementId: "a string from Firestore"
      };
     App.FirebaseConfig = FirebaseConfig;
     firebase.initilalizeApp(App.FirebaseConfig); */

     var FirebaseConfig = {
      apiKey: "AIzaSyBRqyAEILftq7myUHbPtOFYVTPjbrM8tes",
      authDomain: "coffeerun-b1451.firebaseapp.com",
      projectId: "coffeerun-b1451",
      storageBucket: "coffeerun-b1451.appspot.com",
      messagingSenderId: "259549141119",
      appId: "1:259549141119:web:68158f3e70453ceac9474a",
      measurementId: "G-ZECMD00HRZ"
    };
    
    // Initialize Firebase
    App.FirebaseConfig = FirebaseConfig;
    firebase.initializeApp(App.FirebaseConfig);

    window.App = App;
  
  })(window);
