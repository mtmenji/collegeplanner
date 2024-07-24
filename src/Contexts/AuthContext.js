import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const AuthContext = React.createContext()
const firestore = getFirestore();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    const signup = async (email, password, name) => {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredentials.user

        await setDoc(doc(firestore, 'users', user.uid), {
            name: name,
            email: email
        });

        return user;
    }

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await setDoc(doc(firestore, 'users', user.uid), {
            name: user.displayName,
            email: user.email
        });

        return user;
    };

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    const signOutUser = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signIn,
        googleSignIn,
        signup,
        resetPassword,
        signOutUser
    }

    return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
    )
}