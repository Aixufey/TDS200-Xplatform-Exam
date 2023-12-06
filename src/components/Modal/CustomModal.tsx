import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRef, useState } from 'react';
import { Image, NativeSyntheticEvent, Text, TextInput, TextInputChangeEventData, TouchableOpacity, View } from 'react-native';
import { useGalleryContext, useUIContext } from '../../context';
import DesignSystem from '../../styles';
import { IconButton } from '../Button';
import BackView from './BackView';
interface ICustomModal {
    intensity?: number;
    children?: React.ReactNode;
    className?: string;
    onPress?: () => void;
    toggleModal?: () => void;
}
const CustomModal: React.FC<ICustomModal> = ({
    onPress,
    className,
    intensity,
    toggleModal,
    children,
}) => {
    const { Colors } = DesignSystem();
    const { currentPicture } = useGalleryContext();
    const { resetUIState } = useUIContext();
    const [flip, setFlip] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");

    const handleOnPressClose = () => {
        onPress && onPress();
        resetUIState();
        toggleModal && toggleModal();
    };

    const handleFlip = () => {
        setFlip((prev) => !prev);
    };
    
    const handleCommentChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setComment(e.nativeEvent.text);
    }
    const handleSubmitPress = () => {
        console.log(comment)
    }

    return (
        toggleModal && (
            <BlurView intensity={intensity || 5} tint="dark" className={className}>
                <View className="absolute top-15 w-[75%] h-[460px] border-[1px] border-[#00ffff] bg-dark300 rounded-2xl overflow-hidden justify-center items-center">
                    <View className="w-full h-full justify-start items-center absolute">
                        {children}
                    </View>
                    {currentPicture && (
                        <View className="overflow-hidden justify-start h-[360px]">
                            <View className="overflow-hidden w-[250px] h-[250px] rounded-md">
                                <Image
                                    className="w-full h-full"
                                    source={{ uri: currentPicture?.uri }}
                                />
                            </View>
                            <View className="w-[250px] h-[50px] p-1 items-center flex-row">
                                <View className="px-2 flex-row">
                                    <AntDesign name="like2" size={24} color={Colors.tertiary} />
                                    <Text className="px-1 text-neutral font-handjet-light">1</Text>
                                </View>
                                <View className="px-2 flex-row">
                                    <AntDesign name="dislike2" size={24} color={Colors.tertiary} />
                                    <Text className="px-1 text-neutral font-handjet-light">0</Text>
                                </View>
                                <View className='px-2 flex-row'>
                                    <FontAwesome5 name="comment-alt" size={24} color={Colors.tertiary} />
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity>
                                    <Text className='px-1 text-neutral50'>View all comments</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="w-[250px] h-[60px] overflow-hidden flex-row">
                                <TextInput
                                    onChange={handleCommentChange}
                                    multiline={true}
                                    numberOfLines={10}
                                    placeholder="Write a comment..."
                                    placeholderTextColor={Colors.neutral700}
                                    className="px-1 text-neutral font-handjet-light w-[220px]"
                                />
                                {comment.length >= 1 &&
                                    <View className="w-100 justify-center items-center">
                                        <TouchableOpacity onPress={handleSubmitPress}>
                                            <Feather name="send" size={24} color={Colors.tertiary} />
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        </View>
                    )}

                    {flip && currentPicture && (
                        <BackView
                            id={currentPicture.id}
                            uri={currentPicture.uri}
                            coordinates={{
                                longitude: currentPicture.coordinates?.longitude,
                                latitude: currentPicture.coordinates?.latitude,
                            }}
                        />
                    )}

                    <View className="absolute top-0 right-0 h-[15%] flex-row justify-end items-center">
                        <IconButton
                            onPress={handleFlip}
                            className="w-[45px] h-[45px] justify-center items-center"
                            IconSet="MaterialIcons"
                            iconName="flip"
                            iconSize={28}
                            iconColor={Colors.tertiary}
                        />
                        <IconButton
                            onPress={handleOnPressClose}
                            className="w-[45px] h-[45px] justify-center items-center"
                            IconSet="AntDesign"
                            iconName="closecircle"
                            iconSize={24}
                            iconColor={Colors.tertiary}
                        />
                    </View>
                </View>
            </BlurView>
        )
    );
};
export default CustomModal;
