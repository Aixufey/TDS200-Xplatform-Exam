import { signOut } from 'firebase/auth';
import { Text, View } from 'react-native';
import { Background, Button } from '../../components';
import { useAuth } from '../../context';
const HomeScreen: React.FC = () => {
    const { currentUser, firebase_auth } = useAuth();

    const handleSignOutPress = async () => {
        signOut(firebase_auth);
    };
    return (
        <Background>
            <View className="flex-1 w-full h-full justify-evenly items-center">
                <View className="m-2 basis-12 justify-center">
                    {currentUser && (
                        <Text className="text-neutral font-handjet-light text-xl">
                            Welcome{currentUser.isAnonymous ? ', ' : ' back, '}
                            <Text className="text-secondary font-handjet-light">
                                {currentUser.isAnonymous
                                    ? 'Anonymous one'
                                    : currentUser.displayName}
                            </Text>
                        </Text>
                    )}
                </View>
                <View className="basis-4/5 w-full items-center">
                    <Text className="text-neutral tracking-widest font-handjet-black text-[150px]">
                        Home
                    </Text>
                </View>
                <Button
                    className="absolute bottom-[100px] rounded-xl border-[1px] border-tertiary w-[120px] h-[50px] justify-center items-center"
                    onPress={handleSignOutPress}
                    text="Sign Out"
                />
            </View>
        </Background>
    );
};
export default HomeScreen;
