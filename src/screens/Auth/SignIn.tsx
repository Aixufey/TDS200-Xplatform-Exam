import { Ionicons } from '@expo/vector-icons';
import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context';
import DesignSystem from '../../styles';

interface IUser {
    email: string;
    password: string;
}
type SignInProps = {
    className?: string;
    signUp: () => void;
};
const SignIn: React.FC<SignInProps> = ({ className, signUp }) => {
    const { firebase_auth, setCurrentUserDisplayName } = useAuth();
    const { Colors } = DesignSystem();
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
    const [isLoadingGuest, setIsLoadingGuest] = useState<boolean>(false);
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
            setIsLoadingUser(true);
            const userCred = await signInWithEmailAndPassword(firebase_auth, email, password);
            console.info(`User: ${userCred.user.displayName}, signed in`);
            setCurrentUserDisplayName((prev) => (prev = userCred.user.displayName ?? ''));
            setIsLoadingUser(false);
            //console.info(userCred);
        } catch (e) {
            console.info(e);
            alert('Authentication failed');
            setIsLoadingUser(false);
        }
    };

    const handleSignInGuestPress = async () => {
        try {
            setIsLoadingGuest(true);
            const guest = await signInAnonymously(firebase_auth);
            console.info(`Guest signed in`);
            setIsLoadingGuest(false);
            //console.info(guest.user);
        } catch (e) {
            console.info(e);
        }
    };

    return (
        <View className="justify-center items-center">
            <View className="justify-center items-center">
                <Text className="text-[42px] text-neutral font-handjet-regular tracking-widest">
                    Log in
                </Text>
            </View>
            <View className={className ?? 'rounded p-1 w-[250px]'}>
                <View className="border-[0.3px] border-neutral rounded p-1 bg-dark200">
                    <TextInput
                        style={{ fontFamily: 'Handjet-Light' }}
                        inputMode="email"
                        className="text-neutral font-handjet-light tracking-widest"
                        placeholder="Email..."
                        placeholderTextColor={Colors.neutral400}
                        onChangeText={(text) => setUser({ ...user, email: text.trim() })}
                        value={user.email}
                    />
                </View>
                <View className="mt-2 border-[0.3px] border-neutral rounded p-1 bg-dark200">
                    <TextInput
                        style={{ fontFamily: 'Handjet-Light' }}
                        secureTextEntry={true}
                        passwordRules="minlength: 6;"
                        className="text-neutral font-handjet-light tracking-widest"
                        placeholderTextColor={Colors.neutral400}
                        placeholder="Password..."
                        onChangeText={(text) => setUser({ ...user, password: text.trim() })}
                        value={user.password}
                    />
                </View>
                {isLoadingUser ? (
                    <ActivityIndicator
                        className="mt-4"
                        size="large"
                        color={Colors.tertiary}
                        animating
                    />
                ) : (
                    <Pressable className="mt-4 h-[40px] border-2 border-rei rounded-xl bg-rei justify-center items-center">
                        <Text
                            className="text-neutral font-handjet-light tracking-widest"
                            onPress={handleSignInPress}
                        >
                            Log in
                        </Text>
                    </Pressable>
                )}
                <View className="mt-4 justify-evenly items-center flex-row overflow-hidden">
                    <View className="mr-6 border-b-[0.5px] border-white w-[50%]" />
                    <Text className="text-neutral font-handjet-light tracking-widest"> OR </Text>
                    <View className="ml-6 border-b-[0.5px] border-white w-[50%]" />
                </View>
                {isLoadingGuest ? (
                    <ActivityIndicator
                        className="mt-4"
                        size="large"
                        color={Colors.tertiary}
                        animating
                    />
                ) : (
                    <View className="mt-4 justify-center items-center flex-row">
                        <View className="top-[-2px]">
                            <Ionicons name="md-person-outline" size={15} color={Colors.neutral} />
                        </View>
                        <Text
                            className="pl-1 text-neutral font-handjet-light tracking-widest text-xl"
                            onPress={handleSignInGuestPress}
                        >
                            Browse as guest
                        </Text>
                    </View>
                )}
                <View className="mt-6 justify-center items-center">
                    <Pressable onPress={() => console.log('Reset pw')}>
                        <Text className="text-neutral font-handjet-light tracking-widest">
                            Forgot password?
                        </Text>
                    </Pressable>
                </View>
                <View className="mt-6 justify-center items-center h-[50px] flex-row">
                    <Text className="text-neutral font-handjet-light tracking-widest">
                        Don't have an account?
                    </Text>
                    <Text
                        className="text-tertiary px-1 font-handjet-regular tracking-widest"
                        onPress={signUp}
                    >
                        Sign up
                    </Text>
                </View>
            </View>
        </View>
    );
};
export default SignIn;
