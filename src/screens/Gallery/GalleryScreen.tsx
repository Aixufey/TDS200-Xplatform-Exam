import { useIsFocused } from '@react-navigation/native';
import { View } from 'react-native';
import { Background, Canvas } from '../../components';

const GalleryScreen: React.FC = () => {
    const isFocused = useIsFocused();

    return (
        <Background>
            <View className="flex-1 w-full bottom-[4.5%] justify-center items-center">
                <Canvas isFocused={isFocused} title={'Media'}></Canvas>
            </View>
        </Background>
    );
};
export default GalleryScreen;
