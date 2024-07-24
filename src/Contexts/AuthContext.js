import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const AuthContext = React.createContext()
const firestore = getFirestore();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();

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

    const signOutUser = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
        })

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signIn,
        signup,
        signOutUser
    }

    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    )
}