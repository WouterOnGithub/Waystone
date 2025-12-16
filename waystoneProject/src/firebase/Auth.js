import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import {doc, setDoc, serverTimestamp} from 'firebase/firestore'
import {auth,db} from './firebase'

export const signUp = async (email,password, username) => 
   {
    const userCredential =  await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "Users", userCredential.user.uid), {
    email: email,
    createdAt: serverTimestamp(),
    username: username,
  });
return userCredential

   };

export const signIn = (email,password) =>
{
    signInWithEmailAndPassword(auth, email, password);
}

export const logout = () => signOut(auth);

export const subscribeToAuth = (callback) =>
  onAuthStateChanged(auth, callback);

