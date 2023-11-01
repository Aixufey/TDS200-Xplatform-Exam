import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLayoutEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Background } from '../../components';
import DesignSystem from '../../styles';

type GradientCoordinatesType = {
    start: { x: number; y: number };
    end: { x: number; y: number };
};
const GalleryScreen: React.FC = () => {
    const { Colors } = DesignSystem();
    const isFocused = useIsFocused();
    const [gradientCoordinates, setGradientCoordinates] = useState<GradientCoordinatesType>({
        start: { x: 0, y: 1 },
        end: { x: -1, y: 0 },
    });

    useLayoutEffect(() => {
        const angle = Math.random() * 360;
        const start = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
        const end = {
            x: Math.cos(angle + Math.PI),
            y: Math.sin(angle + Math.PI),
        };
        
        setGradientCoordinates({ start: start, end: end });
    }, [isFocused]);

    return (
        <Background>
            <View className="absolute w-[90%] h-[90%] bottom-[8%] border-[0.2px] border-tertiary300 rounded bg-dark300 opacity-50">
                <LinearGradient
                    colors={[
                        Colors.primary,
                        Colors.primary200,
                        Colors.primary300,
                        Colors.tertiary,
                        Colors.tertiary200,
                        Colors.tertiary300,
                    ]}
                    start={gradientCoordinates.start}
                    end={gradientCoordinates.end}
                    className="flex-1 opacity-10 w-[100%] h-[100%]  justify-center items-center flex-row"
                />
                <View className='absolute flex-1 w-full h-full justify-center items-center'>
                    <View>
                        <Text className='text-white font-handjet-regular text-3xl'>Gallery</Text>
                    </View>
                    <View className='flex-1'>

                    <Text className='text-white'>lol</Text>
                    </View>
                </View>
            </View>
        </Background>
    );
};
export default GalleryScreen;
