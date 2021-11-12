(function (window) {
    'use strict';
  
    var App = window.App || {};
    var $ = window.jQuery;
  
    class FirebaseDataStore {
        constructor(SERVER_URL) {
          console.log('running the FireBaseDataStore function');
          //app = initializeApp(window.FirebaseConfig);
          this.db = firebase.firestore();
        }
  
        async add(key, val) {
            console.log('firebase add  ');
            const docRef = this.db.doc(`damage/${this.makeDocHash(20)}`);
            return docRef.set(val); 
        }

        async getAll(cb)    { 
            const docRef = this.db.collection(`damage`);
            const snapshot = await docRef.get();
            return await snapshot.docs.map(e => e.data());
        }
        makeDocHash(len) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < len; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }
    }
    App.FirebaseDataStore = FirebaseDataStore;
    window.App = App;
  
  })(window);