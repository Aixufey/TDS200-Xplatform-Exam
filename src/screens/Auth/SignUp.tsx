import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context';
interface IUser {
    email: string;
    password: string;
}
const SignUp: React.FC = () => {
    const { firebase_auth } = useAuth();
    const [newUser, setNewUser] = useState<IUser>({
        email: '',
        password: '',
    });
    const signUpWithEmailAndPw = async () => {
        try {
            const userCred = await createUserWithEmailAndPassword(
                firebase_auth,
                newUser.email,
                newUser.password
            );
            console.log(userCred.user);
        } catch (e) {
            console.log(e);
        }
    };

    console.log(newUser);
    return (
        <View className="flex-1 justify-center items-center">
            <View className="border-2 border-white w-[50%]">
                <TextInput
                    className="text-neutral"
                    onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                    placeholder="Email"
                    placeholderTextColor="white"
                    value={newUser.email}
                />
                <TextInput
                    className="text-neutral"
                    onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                    placeholder="Password"
                    placeholderTextColor="white"
                    value={newUser.password}
                />
            </View>
            <Text onPress={signUpWithEmailAndPw} className="text-neutral">
                SignUp
            </Text>
        </View>
    );
};
export default SignUp;
