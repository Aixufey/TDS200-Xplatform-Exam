import { Camera, CameraCapturedPicture } from 'expo-camera';
import { FlipType, SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import {
    CameraType,
    ImagePickerResult,
    launchCameraAsync,
    useCameraPermissions,
} from 'expo-image-picker';
import {
    Asset,
    addAssetsToAlbumAsync,
    createAlbumAsync,
    createAssetAsync,
    getAlbumAsync,
} from 'expo-media-library';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { TDS200 } from '../../constants';
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
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const broCameraRef = useRef<Camera>(null);

    const fetchCamera = useCallback(async () => {
        try {
            const response = await requestPermission();
            if (response.status !== 'granted') {
                Alert.alert('You need to grant camera access.');
                return setHasPermission(false);
            }
            setHasPermission(response.granted);
        } catch (e) {
            console.log(`Camera Permission not granted `, e);
        }
    }, []);

    useEffect(() => {
        fetchCamera();
    }, [fetchCamera, hasPermission]);

    const handleLaunchCameraPro = async () => {
        if (!hasPermission) return Alert.alert(`Camera access not granted.`);

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

    /**
     *
     * @param asset Expecting an image asset
     */
    const handleSaveToAlbum = async (asset: Asset) => {
        let album;
        try {
            album = await getAlbumAsync(TDS200);
            // console.log(album);
            // console.log(album.assetCount)
            if (album === null) {
                album = await createAlbumAsync(TDS200, asset, false);
            } else {
                await addAssetsToAlbumAsync([asset], album, false);
            }
        } catch (error) {
            console.log(`Error saving to album `, album);
        }
    };

    const handleLaunchCameraBro = async () => {
        if (!hasPermission) return Alert.alert(`Camera access not granted.`);
        try {
            if (broCameraRef.current) {
                let opt = {
                    skipProcessing: true,
                    quality: 0.2,
                    aspect: [1, 1],
                    allowsEditing: false,
                    exif: true,
                    base64: false,
                    cameraType: CameraType.back,
                };
                const snapshot = await broCameraRef.current.takePictureAsync(opt);
                const compressedBro = await manipulateAsync(
                    snapshot.uri,
                    [
                        {
                            resize: { height: 800, width: 800 },
                        },
                        {
                            flip: FlipType.Horizontal,
                        },
                    ],
                    { compress: 0.2, format: SaveFormat.JPEG }
                );
                setImageBro(compressedBro as imageTypeBro);
                // TODO: Upload broski to firebase
                const asset = await createAssetAsync(compressedBro.uri);

                handleSaveToAlbum(asset);
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
