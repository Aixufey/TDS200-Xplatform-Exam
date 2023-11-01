import { LinearGradient } from 'expo-linear-gradient';
import { useLayoutEffect, useState } from 'react';
import { Text, View } from 'react-native';
import DesignSystem from '../../styles';
import { randomGradient } from '../../utils';
interface IGalleryCanvas {
    children?: React.ReactNode;
    isFocused?: boolean;
    title?: string;
}
type GradientCoordinatesType = {
    start: { x: number; y: number };
    end: { x: number; y: number };
};
const DefaultCoordinates = {
    start: { x: 0, y: 1 },
    end: { x: -1, y: 0 },
};
const Canvas: React.FC<IGalleryCanvas> = ({ children, title, isFocused }) => {
    const { Colors } = DesignSystem();
    const [gradientCoordinates, setGradientCoordinates] =
        useState<GradientCoordinatesType>(DefaultCoordinates);

    useLayoutEffect(() => {
        setGradientCoordinates({ start: randomGradient().start, end: randomGradient().end });
    }, [isFocused]);

    return (
        <View id="Canvas-Container" className="w-full h-full justify-center items-center">
            <View id="Canvas-Body" className="w-[95%] h-[90%] justify-center items-center">
                <View
                    id="Canvas-BG"
                    className="absolute w-full h-full border-[0.2px] border-tertiary300 rounded bg-dark300 opacity-50"
                >
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
                        className="flex-1 opacity-10"
                    />
                </View>
                <View
                    id="Canvas-Content"
                    className="absolute w-full h-full justify-center items-center rounded"
                >
                    <View id="Canvas-Title" className="w-full items-center justify-start">
                        <Text className="text-neutral font-handjet-regular text-[32px] tracking-[10px]">
                            {title}
                        </Text>
                    </View>
                    <View
                        id="Canvas-Main"
                        className="flex-1 w-full h=full justify-center items-center"
                    >
                        {children}
                    </View>
                </View>
            </View>
        </View>
    );
};
export default Canvas;
