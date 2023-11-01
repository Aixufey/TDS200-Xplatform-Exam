import { AntDesign, Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import { GestureResponderEvent, Image, Pressable, Text, View } from 'react-native';
import DesignSystem from '../../styles';
interface IPicture {
    uri?: string;
    longPressed?: boolean;
}
const Picture: React.FC<IPicture> = ({ uri }) => {
    const [longPressed, setLongPressed] = useState<boolean>(false);
    const [select, setSelect] = useState<boolean>(false);
    const { Colors } = DesignSystem();
    const fallBackUri = '../../../assets/images/cicada.png';

    const handlePress = (e: GestureResponderEvent) => {
        console.log(e.nativeEvent.target);

        if (longPressed) {
            handleSelect(e);
        }
    };
    const handleLongPress = (e: GestureResponderEvent) => {
        console.log(e.nativeEvent.target);
        setLongPressed((prev) => !prev);
    };
    const handleSelect = (e: GestureResponderEvent) => {
        console.log(e.nativeEvent.target);
        setSelect((prev) => !prev);
    };

    return (
        <Pressable onPress={handlePress} onLongPress={handleLongPress}>
            <View className="min-w-[75px] min-h-[75px] border-[0.5px] border-dark">
                <Image
                    source={require('../../../assets/images/cicada.png')}
                    className="absolute flex-1 w-full h-full bg-neutral300 "
                />
                {longPressed && !select ? (
                    <Entypo name="circle" size={14} style={{ color: Colors.secondary }} />
                ) : select ? (
                    <AntDesign name="checkcircle" size={12} style={{ color: Colors.secondary }} />
                ) : null}
            </View>
        </Pressable>
    );
};
export default Picture;

interface ILongPressMenu {
    children: React.ReactNode;
}
const LongPressMenu: React.FC<ILongPressMenu> = ({ children }) => {
    return (
        <View className="border-2 border-white bg-white w-full h-full">
            <Text>lol</Text>
            {children}
        </View>
    );
};
