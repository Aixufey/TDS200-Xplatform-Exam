import { createUserWithEmailAndPassword, reload, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context';
import DesignSystem from '../../styles';

interface IUser {
    name: string;
    email: string;
    password: string;
}
type SignUpProps = {
    className?: string;
    signUp: () => void;
};
const SignUp: React.FC<SignUpProps> = ({ className, signUp }) => {
    const { firebase_auth } = useAuth();
    const { Colors } = DesignSystem();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<IUser>({
        name: '',
        email: '',
        password: '',
    });

    const isNameValid = (name: string): boolean => {
        const namePattern = name.length >= 3;
        return namePattern;
    };

    const isEmailValid = (email: string): boolean => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const isPasswordValid = (password: string): boolean => {
        const passPattern = password.length >= 6;
        return passPattern;
    };

    const nameIndicator = () => {
        if (newUser.name.length > 0 && newUser.name.length < 3) {
            return 'border-2 border-rei';
        } else if (newUser.name.length >= 3) {
            return 'border-2 border-tertiary';
        } else {
            return 'border-neutral';
        }
    };

    const emailIndicator = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (newUser.email.length > 0 && !emailPattern.test(newUser.email)) {
            return 'border-2 border-rei';
        } else if (newUser.email.length > 0 && emailPattern.test(newUser.email)) {
            return 'border-2 border-tertiary';
        } else {
            return 'border-neutral';
        }
    };

    const passwordIndicator = () => {
        if (newUser.password.length > 0 && newUser.password.length < 6) {
            return 'border-2 border-rei';
        } else if (newUser.password.length >= 6) {
            return 'border-2 border-tertiary';
        } else {
            return 'border-neutral';
        }
    };

    const handleSignUpPress = async () => {
        try {
            const { name, email, password } = newUser;
            const isEmail = isEmailValid(email);
            const isName = isNameValid(name);
            const isPassword = isPasswordValid(password);
            if (!isName) return alert('Name is required');
            if (!isEmail) return alert('Email is required');
            if (!isPassword) return alert('Password is required');

            setIsLoading(true);
            await createUserWithEmailAndPassword(firebase_auth, newUser.email, newUser.password)
                .then(async (user) => {
                    await updateProfile(user.user, {
                        displayName: newUser.name
                            .slice(0, 1)
                            .toUpperCase()
                            .concat(newUser.name.slice(1)),
                    });
                    console.info(user.user);
                    await reload(user.user);
                    setIsLoading(false);
                })
                .catch((e) => {
                    console.error(e);
                    setIsLoading(false);
                });
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    };

    return (
        <View className="justify-center items-center">
            <View className={className ?? 'rounded p-1 w-[250px]'}>
                <View className="justify-center items-center">
                    <Text className="text-[42px] text-neutral font-handjet-regular tracking-widest">
                        Sign up
                    </Text>
                </View>
                <View className={`border-[0.3px] ${nameIndicator()} rounded p-1 bg-dark200`}>
                    <TextInput
                        className="text-neutral tracking-widest"
                        style={{ fontFamily: 'Handjet-Light' }}
                        onChangeText={(text) => setNewUser({ ...newUser, name: text.trim() })}
                        placeholder="Name"
                        placeholderTextColor={Colors.neutral400}
                        value={newUser.name}
                    />
                </View>
                <View className={`mt-2 border-[0.3px] ${emailIndicator()} rounded p-1 bg-dark200`}>
                    <TextInput
                        className="text-neutral tracking-widest"
                        style={{ fontFamily: 'Handjet-Light' }}
                        onChangeText={(text) => setNewUser({ ...newUser, email: text.trim() })}
                        placeholder="Email"
                        placeholderTextColor={Colors.neutral400}
                        value={newUser.email}
                    />
                </View>
                <View
                    className={`mt-2 border-[0.3px] ${passwordIndicator()} rounded p-1 bg-dark200`}
                >
                    <TextInput
                        style={{ fontFamily: 'Handjet-Light' }}
                        className="text-neutral tracking-widest"
                        secureTextEntry={true}
                        passwordRules="minlength: 6"
                        placeholderTextColor={Colors.neutral400}
                        placeholder="Password"
                        onChangeText={(text) => setNewUser({ ...newUser, password: text.trim() })}
                        value={newUser.password}
                    />
                </View>
                {isLoading ? (
                    <ActivityIndicator
                        className="mt-4"
                        size={'large'}
                        color={Colors.tertiary}
                        animating
                    />
                ) : (
                    <Pressable className="mt-4 h-[40px] border-2 border-rei rounded-xl bg-rei justify-center items-center">
                        <Text
                            className="text-neutral font-handjet-light tracking-widest"
                            onPress={handleSignUpPress}
                        >
                            Sign up
                        </Text>
                    </Pressable>
                )}
                <View className="mt-4 justify-evenly items-center flex-row overflow-hidden">
                    <View className="mr-6 border-b-[0.5px] border-white w-[50%]" />
                    <Text className="text-neutral font-handjet-light tracking-widest"> OR </Text>
                    <View className="ml-6 border-b-[0.5px] border-white w-[50%]" />
                </View>
                <View className="mt-6 justify-center items-center h-[50px] flex-row">
                    <Text className="text-neutral font-handjet-light tracking-widest">
                        Have an account?
                    </Text>
                    <Text
                        className="text-tertiary px-1 font-handjet-regular tracking-widest"
                        onPress={signUp}
                    >
                        Log in
                    </Text>
                </View>
            </View>
        </View>
    );
};
export default SignUp;
