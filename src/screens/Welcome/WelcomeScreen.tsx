import { useState } from 'react';
import { StatusBar, View } from 'react-native';
import Background from '../../components/Background/Background';
import { SignIn, SignUp } from '../Auth';

const WelcomeScreen: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);

    const handleSignUpPress = () => {
        setIsSignUp((prev) => !prev);
    };

    return (
        <View className="bg-[#000] w-full h-full justify-center items-center">
            <StatusBar barStyle={'light-content'} />
            <Background>
                <View className="flex-1 w-full h-full justify-center items-center">
                    {isSignUp ? (
                        <SignUp signUp={handleSignUpPress} />
                    ) : (
                        <SignIn signUp={handleSignUpPress} />
                    )}
                </View>
            </Background>
        </View>
    );
};
export default WelcomeScreen;
