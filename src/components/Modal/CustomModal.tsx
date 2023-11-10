import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useGalleryContext, useUIContext } from '../../context';
import DesignSystem from '../../styles';
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
    const { currentPicture, resetGalleryState } = useGalleryContext();
    const { resetUIState } = useUIContext();
    const [flip, setFlip] = useState<boolean>(false);

    const handleOnPressClose = () => {
        onPress && onPress();
        // TODO: Clean instead of hard reset?
        resetUIState();
        resetGalleryState();

        toggleModal && toggleModal();
    };

    const handleFlip = () => {
        setFlip((prev) => !prev);
    };

    const renderBackView = () => {
        return <View className="flex-1 bg-dark500 w-full h-full absolute"></View>;
    };

    return (
        toggleModal && (
            <BlurView intensity={intensity || 5} tint="dark" className={className}>
                <View className="w-[75%] h-[75%] border-[1px] border-[#00ffff] bg-dark300 rounded-2xl overflow-hidden justify-center items-center">
                    {children}

                    {currentPicture && (
                        <View>
                            <Text className="text-white">
                                {currentPicture.id} - {currentPicture.firstName}
                            </Text>
                        </View>
                    )}

                    {flip && renderBackView()}

                    <View className="absolute top-0 right-0 h-[15%] flex-row justify-end items-center">
                        <TouchableOpacity
                            onPress={handleFlip}
                            className="w-[45px] h-[45px] justify-center items-center"
                        >
                            <MaterialIcons name="flip" size={28} color={Colors.tertiary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleOnPressClose}
                            className="w-[45px] h-[45px] justify-center items-center"
                        >
                            <AntDesign name="closecircle" size={24} color={Colors.tertiary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        )
    );
};
export default CustomModal;
