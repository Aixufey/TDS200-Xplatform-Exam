import { Entypo } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLayoutEffect, useState } from 'react';
import { Pressable, StatusBar, StyleProp, Text, View, ViewStyle } from 'react-native';
import Background from '../../components/Background/Background';
import { DefaultCoordinates, GradientCoordinatesType } from '../../components/Canvas/Canvas';
import { useCustomNavigation } from '../../hooks';
import DesignSystem from '../../styles';
import { randomGradient } from '../../utils';
import getRandomColorKey from '../../utils/randomColorKeys';

const WelcomeScreen: React.FC = () => {
    const [gradientCoordinates, setGradientCoordinates] =
        useState<GradientCoordinatesType>(DefaultCoordinates);
    const { navigate } = useCustomNavigation();
    const isFocused = useIsFocused();
    const { Colors } = DesignSystem();

    useLayoutEffect(() => {
        setGradientCoordinates({ start: randomGradient().start, end: randomGradient().end });
    }, [isFocused]);

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
                <View className="flex-1 w-full h-full justify-center items-center">
                    <View className="flex-auto h-[60%] justify-center items-center">
                        <Text className="text-[66px] text-neutral300 tracking-widest uppercase font-handjet-light">
                            Enter the
                        </Text>
                        <Text
                            className={`text-[66px] text-tertiary900 tracking-widest uppercase font-handjet-light`}
                        >
                            void
                        </Text>
                    </View>
                    <View className="flex-auto h-[20%]">
                        <Pressable
                            className="w-[100px] h-[100px] justify-center items-center"
                            onPress={() => navigate('RootRoutes')}
                            style={({ pressed }) => stylePressed(pressed, { padding: 5 })}
                        >
                            <LinearGradient
                                colors={[Colors.rei, Colors.yottsu, Colors.itsutsu]}
                                start={gradientCoordinates.start}
                                end={gradientCoordinates.end}
                                className="absolute w-full h-full opacity-65 rounded-tl-3xl rounded-br-3xl justify-center items-center flex-row"
                            />
                            <Entypo name="login" size={24} color={Colors.neutral} />
                        </Pressable>
                    </View>
                </View>
            </Background>
        </View>
    );
};
export default WelcomeScreen;
