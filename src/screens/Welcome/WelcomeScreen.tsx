import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StatusBar, StyleProp, Text, View, ViewStyle } from 'react-native';
import Background from '../../components/Background/Background';
import { useCustomNavigation } from '../../hooks';

const WelcomeScreen: React.FC = () => {
    const { navigate } = useCustomNavigation();

    const stylePressed = (pressed: boolean, ...Styles: StyleProp<ViewStyle>[]) => {
        return [
            {
                opacity: pressed ? 0.7 : 1,
            },
            ...Styles,
        ];
    };

    return (
        <View className="bg-[#000] w-full h-full justify-center items-center">
            <StatusBar barStyle={'light-content'} />
            <Background>
                <View className="justify-center items-center">
                    <Text className="text-[66px] font-handjet-black">Enter the</Text>
                    <Text className="text-[66px] text-[#ff00AA] font-handjet-regular">void</Text>
                </View>
                <View>
                    <Pressable
                        onPress={() => navigate('RootRoutes')}
                        style={({ pressed }) => stylePressed(pressed, { padding: 5 })}
                    >
                        <LinearGradient
                            colors={['#0FFA', '#FF00AA', 'transparent']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            className="w-[100px] h-[100px] rounded-tl-3xl rounded-br-3xl justify-center items-center flex-row"
                        >
                            <Entypo name="login" size={24} color="#000" />
                        </LinearGradient>
                    </Pressable>
                </View>
            </Background>
        </View>
    );
};
export default WelcomeScreen;
