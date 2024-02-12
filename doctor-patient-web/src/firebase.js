import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJhrud4NIHNDruKxUVVQ_obKVzkiBGa5s",
  authDomain: "mbdochub.firebaseapp.com",
  projectId: "mbdochub",
  storageBucket: "mbdochub.appspot.com",
  messagingSenderId: "906511986702",
  appId: "1:906511986702:web:76e98f58a55aacabca8c5f",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { storage };
