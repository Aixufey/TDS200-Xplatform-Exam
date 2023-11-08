import { Camera, CameraCapturedPicture } from 'expo-camera';
import {
    CameraType,
    ImagePickerResult,
    PermissionStatus,
    launchCameraAsync,
    useCameraPermissions,
} from 'expo-image-picker';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { createAssetAsync } from 'expo-media-library';

export type imageTypePro = {
    uri: string;
    assetId?: string | null;
    width: number;
    height: number;
    type?: 'image' | 'video';
    fileName?: string | null;
    fileSize?: number;
    exif?: Record<string, any> | null;
    base64?: string | null;
    duration?: number | null;
};
export type imageTypeBro = {
    width: number;
    height: number;
    uri: string;
    base64?: string;
    exif?: Partial<MediaTrackSettings> | any;
};
const useLaunchCamera = () => {
    const [imagePro, setImagePro] = useState<ImagePickerResult>();
    const [imageBro, setImageBro] = useState<CameraCapturedPicture>();
    const [permission, requestPermission] = useCameraPermissions();
    const broCameraRef = useRef<Camera>(null);

    const handlePermission = async () => {
        if (permission?.status === PermissionStatus.UNDETERMINED) {
            const resp = await requestPermission();
            return resp.granted;
        }
        if (permission?.status === PermissionStatus.DENIED) {
            Alert.alert('You need to grant camera access.');
            return false;
        }
        return true;
    };

    const handleLaunchCameraPro = async () => {
        const hasPermission = await handlePermission();
        if (!hasPermission) return;

        const snapshot = await launchCameraAsync({
            quality: 0.2,
            aspect: [1, 1],
            allowsEditing: true,
            exif: true,
            base64: false,
            cameraType: CameraType.back,
        });
        const { assets } = snapshot;
        setImagePro(snapshot);
    };
    
    

    const handleLaunchCameraBro = async () => {
        const hasPermission = await handlePermission();
        if (!hasPermission) return;
        try {
            if (broCameraRef.current) {
                let opt = {
                    skipProcessing: true,
                    quality: 0.2,
                    aspect: [1, 1],
                    allowsEditing: true,
                    exif: true,
                    base64: false,
                    cameraType: CameraType.back,
                };
                const snapshot = await broCameraRef.current.takePictureAsync(opt);
                setImageBro(snapshot as imageTypeBro);
                console.log(snapshot.exif);
                const asset = await createAssetAsync(snapshot.uri)
                console.log(asset);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return {
        broCameraRef,
        imagePro,
        imageBro,
        handleLaunchCameraPro,
        handleLaunchCameraBro,
    };
};
export default useLaunchCamera;
