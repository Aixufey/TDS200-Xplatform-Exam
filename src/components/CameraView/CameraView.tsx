import { MaterialIcons } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useLaunchCamera } from '../../hooks';
import DesignSystem from '../../styles';
import { CustomModal } from '../Modal';

const CameraView: React.FC = () => {
    const { handleLaunchCameraBro, broCameraRef, imageBro } = useLaunchCamera();
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);

    const handleToggleModal = () => {
        if (!imageBro) return;
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
                >
                    {imageBro && (
                        <Image source={{ uri: imageBro.uri }} className="absolute w-full h-full" />
                    )}
                </CustomModal>
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
                            {imageBro && (
                                <Image
                                    source={{ uri: imageBro.uri }}
                                    className="absolute w-full h-full"
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleLaunchCameraBro} className="opacity-90">
                        <MaterialIcons
                            name="camera"
                            size={65}
                            color={DesignSystem().Colors.neutral100}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleToggleCameraType} className="opacity-90">
                        <MaterialIcons
                            name="flip-camera-ios"
                            size={65}
                            color={DesignSystem().Colors.neutral100}
                        />
                    </TouchableOpacity>
                </View>
                {renderModal()}
            </View>
        </View>
    );
};
export default CameraView;
