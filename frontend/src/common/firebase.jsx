// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB0JnOuRVrUaDRigutS-YfQtygTYb1_1ds",
  authDomain: "mern-blogs-b15a6.firebaseapp.com",
  projectId: "mern-blogs-b15a6",
  storageBucket: "mern-blogs-b15a6.appspot.com",
  messagingSenderId: "1053653614243",
  appId: "1:1053653614243:web:e27a3ed8502d91951c4916"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider=new GoogleAuthProvider()
const auth=getAuth()

export const authWithGoogle=async()=>{
    try {
    let user=null
    const result=await signInWithPopup(auth,provider)
    user=result.user
    return user

    } catch (error) {
        console.log(error)
    }
    
}