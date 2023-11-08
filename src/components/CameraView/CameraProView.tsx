import { Camera, CameraType } from 'expo-camera';
import { ImagePickerResult, PermissionStatus, launchCameraAsync, useCameraPermissions } from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

interface ICameraView {
    className?: string;
}
const CameraProView: React.FC<ICameraView> = ({ className }) => {
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);
    const [image, setImage] = useState<ImagePickerResult | undefined>(undefined);
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<Camera>(null);

    const handlePermission = async () => {
        if (cameraPermissionInformation?.status === PermissionStatus.UNDETERMINED) {
            const resp = await requestPermission();

            return resp.granted;
        }
        if (cameraPermissionInformation?.status === PermissionStatus.DENIED) {
            Alert.alert(`'Insufficient permission!',
            'You need to grant camera access to use this app'`);
            return false;
        }
        return true;
    };
    // const handlePressCamera = async () => {
    //     try {
    //         if (cameraRef.current) {
    //             let options = {
    //                 quality: 0.2,
    //                 aspect: [1, 1],
    //                 base64: false,
    //                 exif: true,
    //                 skipProcessing: true,
    //             };
    //             const picture = await cameraRef.current.takePictureAsync(options);
    //             console.log(picture.exif);
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };
    const handlePressCamera = async () => {
        const hasPermission = await handlePermission();
        if (!hasPermission) {
            return;
        }

        const result = await launchCameraAsync({
            quality: 0.2,
            aspect: [1, 1],
            allowsEditing: true,
            exif: true,
            base64: false,
            cameraType: CameraType.back,
        });
        setImage(result);

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    return (
        <View className="w-full h-full justify-center items-center">
            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
            <TouchableOpacity onPress={handlePressCamera}>
                <Text className="text-white text-3xl">Click</Text>
            </TouchableOpacity>
        </View>
    );
};
export default CameraProView;
