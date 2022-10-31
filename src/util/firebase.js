
/* firebase.js
   Setups up the cloud database Firebase initialisation
 */

import firebase from "firebase/app";
import "firebase/firestore";

// NOTE: Ideally these keys would be in node environment variables however, due
// to the whole team needing access to this code - everyone setting up a .env
// file seems like it may create more problems than it solves.

const firebaseConfig = {
  apiKey: "AIzaSyCEYHm_3bnLidfzK0Df2BlcXHYL6VTbdxE",
  authDomain: "database-18b2b.firebaseapp.com",
  projectId: "database-18b2b",
  storageBucket: "database-18b2b.appspot.com",
  appId: "1:464517801388:web:d27bb7d2869dbb05538609",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
