import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { Image, View } from 'react-native';
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

    const handleOnPressClose = () => {
        onPress && onPress();
        resetUIState();
        toggleModal && toggleModal();
    };

    const handleFlip = () => {
        setFlip((prev) => !prev);
    };

    return (
        toggleModal && (
            <BlurView intensity={intensity || 5} tint="dark" className={className}>
                <View className="w-[75%] h-[75%] border-[1px] border-[#00ffff] bg-dark300 rounded-2xl overflow-hidden justify-center items-center">
                    <View className="w-full h-full justify-start items-center absolute">
                        {children}
                    </View>
                    {currentPicture && (
                        <View className="overflow-hidden w-[250px] h-[250px] rounded-md">
                            <Image
                                className="w-full h-full"
                                source={{ uri: currentPicture?.uri }}
                            />
                        </View>
                    )}

                    {flip && currentPicture && (
                        <BackView
                            id={currentPicture.id}
                            uri={currentPicture.uri}
                            coordinates={{
                                longitude: currentPicture.coordinates?.longitude,
                                latitude: currentPicture.coordinates?.latitude
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
