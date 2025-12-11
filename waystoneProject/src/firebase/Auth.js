import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth();

export const signUp = (email,password) => 
   {
    const userCredential =  createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

   }

export const signIn = (email,password) =>
{
    signInWithEmailAndPassword(auth, email, password);
}

export const logout = () => signOut(auth);

export const subscribeToAuth = (callback) =>
  onAuthStateChanged(auth, callback);

