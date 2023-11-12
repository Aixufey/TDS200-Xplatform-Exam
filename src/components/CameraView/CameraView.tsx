import { Camera, CameraType } from 'expo-camera';
import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useGalleryContext } from '../../context';
import { useLaunchCamera } from '../../hooks';
import DesignSystem from '../../styles';
import { IconButton } from '../Button';
import { CustomModal } from '../Modal';

const CameraView: React.FC = () => {
    const { handleLaunchCameraBro, broCameraRef } = useLaunchCamera();
    const { currentPicture } = useGalleryContext();
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
    const { Colors } = DesignSystem();
    const handleToggleModal = () => {
        if (!currentPicture) return;
        setToggleModal((prev) => !prev);
    };

    const handleToggleCameraType = () => {
        setCameraType((curr) => (curr === CameraType.back ? CameraType.front : CameraType.back));
    };
    const renderModal = () => {
        return (
            toggleModal && (
                <CustomModal
                    intensity={25}
                    toggleModal={handleToggleModal}
                    className="justify-center items-center absolute w-full h-full"
                />
            )
        );
    };

    return (
        <View className="flex-1 justify-center items-center">
            <View className="absolute h-[450px] bg-dark500 items-center border-[0.5px] border-[#FFA]">
                <Camera
                    ratio="1:1"
                    className="w-[350px] h-[350px]"
                    ref={broCameraRef}
                    type={cameraType}
                />
                <View className="absolute w-full bottom-3 flex-row justify-evenly">
                    <View className="w-[20%] border-[0.5px] border-white bg-dark400">
                        <TouchableOpacity className="flex-1" onPress={handleToggleModal}>
                            {currentPicture && (
                                <Image
                                    source={{ uri: currentPicture?.uri }}
                                    className="absolute w-full h-full"
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    <IconButton
                        onPress={handleLaunchCameraBro}
                        className="opacity-90"
                        IconSet="MaterialIcons"
                        iconName="camera"
                        iconSize={65}
                        iconColor={Colors.neutral100}
                    />
                    <IconButton
                        onPress={handleToggleCameraType}
                        className="opacity-90"
                        IconSet="MaterialIcons"
                        iconName="flip-camera-ios"
                        iconSize={65}
                        iconColor={Colors.neutral100}
                    />
                </View>
                {renderModal()}
            </View>
        </View>
    );
};
export default CameraView;
