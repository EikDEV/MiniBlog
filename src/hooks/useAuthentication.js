import { db } from '../firebase/config';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth';

import { useState, useEffect } from 'react';

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const [cancelled, setCancelled] = useState(false);
    const auth = getAuth();

    function checkIfIsCancelled() {
        if(cancelled) {
            return;
        };
    };

    const createUser = async (data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError("");

        try {
            const {user} = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            await updateProfile(user, {
                displayName: data.displayName
            })

            setLoading(false);

            return user;

        } catch (error) {
            let systemErrorMessage;

            if(error.message.includes("Password")) {
                systemErrorMessage = "A senha deve ter no mínimo 6 caracteres!";
            }else if(error.message.includes("email-already")) {
                systemErrorMessage = "Usuário já cadastrado!";
            }else if(error.message.includes("invalid")) {
                systemErrorMessage = "E-mail inválido!";
            }else {
                systemErrorMessage = "Algo deu errado, tente novamente mais tarde! =(";
            };
            
            setLoading(false);
            setError(systemErrorMessage);
        }
    };

    const logout = () => {
        checkIfIsCancelled();
        signOut(auth);
    };

    const login = async(data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError(false);

        try {

            await signInWithEmailAndPassword(auth, data.email, data.password);
            setLoading(false);

        } catch (error) {
            let systemErrorMessage;

            if(error.message.includes("user-not-found")) {
                systemErrorMessage = "Usuário não encontrado.";
            }else if(error.message.includes("wrong-password")) {
                systemErrorMessage = "E-mail ou senha inválidos.";
            }else {
                systemErrorMessage = "Algo deu errado, tente novamente mais tarde. =(";
            }

            setError(systemErrorMessage);
            setLoading(false);

        }
    };

    useEffect(() => {
        return () => setCancelled(true); 
    }, []);

    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login
    };
};