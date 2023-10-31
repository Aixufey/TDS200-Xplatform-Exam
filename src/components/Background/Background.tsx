import { ImageBackground, View } from 'react-native';

interface IBackgroundProps {
    children?: React.ReactNode;
}
const Background: React.FC<IBackgroundProps> = ({ children }) => {
    const imageName = `BG`;
    const image = require(`../../../assets/background/${imageName}.jpg`);
    return (
        <View className="flex-1 w-full h-full justify-center items-center">
            <ImageBackground
                source={image}
                resizeMode="cover"
                className="flex-1 absolute w-full h-full justify-center items-center opacity-40"
            />
            <View className="flex-1 w-full h-full justify-center items-center">{children}</View>
        </View>
    );
};
export default Background;
