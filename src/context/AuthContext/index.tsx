import { User, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import FIREBASE, { IFIREBASE } from '../../../firebaseConfig';

type ProviderProps = {
    children: React.ReactNode;
};

interface IAuthContext {
    currentUser: User | null;
}

type AuthContextType = IAuthContext & Pick<IFIREBASE, 'firebase_auth'>;

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    firebase_auth: FIREBASE.firebase_auth,
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(`${useAuth} must be used inside Provider`);
    }
    return context;
};

const AuthContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { firebase_auth } = FIREBASE;   
    useEffect(() => {
        //signOut(firebase_auth);
        const unsubscribe = firebase_auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, []);

    const ContextValue = {
        firebase_auth,
        currentUser,
    };

    return <AuthContext.Provider value={ContextValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
