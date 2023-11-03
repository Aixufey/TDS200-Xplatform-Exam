import { AntDesign, Entypo } from '@expo/vector-icons';
import React, { memo, useEffect, useState } from 'react';
import { GestureResponderEvent, Image, Pressable, Text, View } from 'react-native';
import { useGalleryContext } from '../../context';
import DesignSystem from '../../styles';

interface IPicture {
    uri?: string;
    id?: string;
    firstName?: string;
}
const Picture: React.FC<IPicture> = memo(({ uri, id, firstName }) => {
    const [select, setSelect] = useState<boolean>(false);
    const { Colors } = DesignSystem();
    const fallback = require('../../../assets/images/cicada.png');
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
            setCurrentPicture({ id: id, firstName: firstName });
        }
    };

    return (
        <View id="Picture-Container" className="justify-center items-center p-[6px]">
            <View id="Picture-Body" className="max-w-[75px] max-h-[75px] overflow-hidden">
                <Pressable onPress={handlePressPicture} onLongPress={handleLongPress}>
                    <View
                        id="Picture-Content"
                        className="min-w-[75px] min-h-[75px] border-[0.5px] border-dark"
                    >
                        <Image
                            source={uri ? { uri } : fallback}
                            className="absolute flex-1 w-full h-full bg-neutral300"
                        />
                        {isLongPress &&
                            (!select ? (
                                <Entypo
                                    name="circle"
                                    size={12}
                                    style={{ color: Colors.secondary }}
                                />
                            ) : (
                                <AntDesign
                                    name="checkcircle"
                                    size={12}
                                    style={{ color: Colors.secondary }}
                                />
                            ))}
                        <Text>{firstName}</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
});
export default Picture;
