import { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import FIREBASE, { IFIREBASE } from '../../../firebaseConfig';

type ProviderProps = {
    children: React.ReactNode;
};

interface IAuthContext {
    currentUser: User | null;
    currentUserDisplayName: string;
    setCurrentUserDisplayName: React.Dispatch<React.SetStateAction<string>>;
}

type AuthContextType = IAuthContext & Pick<IFIREBASE, 'firebase_auth'>;

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    currentUserDisplayName: '',
    setCurrentUserDisplayName: () => null,
    firebase_auth: FIREBASE.firebase_auth,
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(`${useAuth} must be used inside Provider`);
    }
    return context;
};

/**
 * @description Making an extra state for displaying signed in user's name
 * In edge cases where new user is created, the name is asynchronously updated.
 * Thus, having functional update for displaying name may solve the issue.
 */
const AuthContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentUserDisplayName, setCurrentUserDisplayName] = useState<string>('');

    const { firebase_auth } = FIREBASE;
    useEffect(() => {
        const unsubscribe = firebase_auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setCurrentUserDisplayName((prev) => (prev = user?.displayName ?? ''));
        });

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, []);

    const ContextValue = {
        firebase_auth,
        currentUser,
        currentUserDisplayName,
        setCurrentUserDisplayName,
    };

    return <AuthContext.Provider value={ContextValue}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
