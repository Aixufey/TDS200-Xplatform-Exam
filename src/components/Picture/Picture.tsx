import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React, { memo, useEffect, useState } from 'react';
import { GestureResponderEvent, Image, Pressable, Text, View } from 'react-native';
import { useGalleryContext, useUIContext } from '../../context';
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
    const { setCurrentPicture, favorite } = useGalleryContext();
    const { isLongPress, handleLongPress, handlePress } = useUIContext();

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

        // Open Modal
        handlePress();

        // Select picture(s)
        setCurrentPicture({ id: id, uri: uri });

        // Multi select
        if (isLongPress) {
            setSelect((prev) => !prev);
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
                                <View className="absolute left-[3%] top-[3%]">
                                    <FontAwesome
                                        name="circle-o"
                                        size={14}
                                        style={{ color: Colors.secondary }}
                                    />
                                </View>
                            ) : (
                                <View className="absolute left-[3%] top-[3%]">
                                    <AntDesign
                                        name="checkcircle"
                                        size={12}
                                        style={{ color: Colors.secondary }}
                                    />
                                </View>
                            ))}

                        {favorite &&
                            favorite.map((item, index) => {
                                return item.id == id ? (
                                    <View key={index} className="absolute right-[3%] top-[3%]">
                                        <MaterialIcons
                                            key={index}
                                            name="favorite"
                                            size={14}
                                            style={{ color: 'crimson' }}
                                        />
                                    </View>
                                ) : null;
                            })}
                        <Text className="self-center text-white bottom-0 absolute">
                            {firstName}
                        </Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
});
export default Picture;
