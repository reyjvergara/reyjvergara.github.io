//import { initializeApp } from 'firebase.app';

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
          const docRef = this.db.doc(`orders/${this.makeDocHash(20)}`);
          return docRef.set(val); 
      }
      async get(email, cb)  { 
          const docRef = this.db.collection(`orders`);
          const snapshot = await docRef.where('emailAddress', '==', email).get();
          return await snapshot.docs.map(e => e.data());
      }
      async getAll(cb)    { 
          const docRef = this.db.collection(`orders`);
          const snapshot = await docRef.get();
          return await snapshot.docs.map(e => e.data());
      }
      async remove(email)   { 
          const docRef = await this.db.collection(`orders`);
          const batch = this.db.batch();
          const snapshot = await docRef.where('emailAddress', '==', email).get();
          snapshot.forEach(doc => {
              batch.delete(doc.ref);
          });
          await batch.commit();
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