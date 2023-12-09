import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context';
interface IUser {
    email: string;
    password: string;
}
const SignIn: React.FC = () => {
    const { firebase_auth, currentUser } = useAuth();
    const [user, setUser] = useState<IUser>({
        email: '',
        password: '',
    });

    const isEmailValid = (email: string): boolean => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };
    const isPasswordValid = (password: string): boolean => {
        const passPattern = password.length >= 6;
        return passPattern;
    };

    const handleSignInPress = async () => {
        try {
            const { email, password } = user;
            const isEmail = isEmailValid(email);
            if (!isEmail) {
                alert('Invalid email');
                return;
            }
            const isPassword = isPasswordValid(password);
            if (!isPassword) {
                alert('Password must be at least 6 characters');
                return;
            }
            const userCred = await signInWithEmailAndPassword(firebase_auth, email, password);
            console.info(userCred);
        } catch (e) {
            console.log(e);
        }
    };

    const handleSignInGuestPress = async () => {
        try {
            const guest = await signInAnonymously(firebase_auth);
            console.info(guest.user);
        } catch (e) {
            console.log(e);
        }
    };
    console.debug(currentUser);
    return (
        <View className="flex-1 justify-center items-center">
            <View className="border-2 border-white w-[50%] ">
                <TextInput
                    inputMode="email"
                    className="text-white"
                    placeholder="Email"
                    placeholderTextColor="gray"
                    onChangeText={(text) => setUser({ ...user, email: text })}
                    value={user.email}
                />
                <TextInput
                    secureTextEntry={true}
                    passwordRules="minlength: 6;"
                    className="text-white"
                    placeholderTextColor="gray"
                    placeholder="Password"
                    onChangeText={(text) => setUser({ ...user, password: text })}
                    value={user.password}
                />
            </View>
            <Text onPress={handleSignInPress} className="text-neutral">
                SignIn
            </Text>
            <Text onPress={handleSignInGuestPress} className="text-neutral">
                Guest
            </Text>
        </View>
    );
};
export default SignIn;
