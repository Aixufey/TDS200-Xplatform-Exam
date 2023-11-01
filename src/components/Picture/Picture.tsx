import { AntDesign, Entypo } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { GestureResponderEvent, Image, Pressable, View } from 'react-native';
import { useGalleryContext } from '../../context';
import DesignSystem from '../../styles';
interface IPicture {
    uri?: string;
    firstName?: string;
}
const Picture: React.FC<IPicture> = ({ uri, firstName }) => {
    const [select, setSelect] = useState<boolean>(false);
    const { Colors } = DesignSystem();
    const fallBackUri = '../../../assets/images/cicada.png';
    const { handleLongPress, isLongPress, setCurrentPicture } = useGalleryContext();

    useEffect(() => {
        if (!isLongPress) {
            setSelect(false);
        }
    }, [isLongPress]);

    const handlePressPicture = (e: GestureResponderEvent) => {
        // console.log(e.nativeEvent.target);
        // Selected Picture state needs to be at this level of granularity
        // Context -- single source of truth will provide ALL the pictures as 'selected' which is not what we want.
        console.log(`open`, e.nativeEvent.target);
        if (isLongPress) {
            setSelect((prev) => !prev);
            setCurrentPicture(firstName);
        }
    };

    return (
        <Pressable onPress={handlePressPicture} onLongPress={handleLongPress}>
            <View className="min-w-[75px] min-h-[75px] border-[0.5px] border-dark">
                <Image
                    source={require('../../../assets/images/cicada.png')}
                    className="absolute flex-1 w-full h-full bg-neutral300 "
                />
                {isLongPress &&
                    (!select ? (
                        <Entypo name="circle" size={12} style={{ color: Colors.secondary }} />
                    ) : (
                        <AntDesign
                            name="checkcircle"
                            size={12}
                            style={{ color: Colors.secondary }}
                        />
                    ))}
            </View>
        </Pressable>
    );
};
export default Picture;
