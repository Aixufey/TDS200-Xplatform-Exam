import { Pressable, StatusBar, Text, View } from 'react-native';
import { useCustomNavigation } from '../../hooks';

const Welcome: React.FC = () => {
    const { navigate } = useCustomNavigation();
    return (
        <View className="bg-[#000] w-full h-full justify-center items-center">
            <StatusBar barStyle={'light-content'} />

            <Text className="text-[#ff00AA] border-2 border-[#123] self-center font-handjet-regular">
                Open up App.tsx to start working on your app!
            </Text>
            <Pressable className="bg-[#123] p-4 rounded-md mt-4" onPress={() => navigate('RootRoutes')}>
                <Text className="text-white text-3xl">Continue</Text>
            </Pressable>
        </View>
    );
};
export default Welcome;
