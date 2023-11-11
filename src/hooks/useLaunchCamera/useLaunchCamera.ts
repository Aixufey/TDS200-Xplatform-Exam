import { Camera, CameraCapturedPicture } from 'expo-camera';
import { FlipType, SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import {
    CameraType,
    ImagePickerResult,
    PermissionStatus,
    launchCameraAsync,
    useCameraPermissions,
} from 'expo-image-picker';
import {
    Asset,
    addAssetsToAlbumAsync,
    createAlbumAsync,
    createAssetAsync,
    getAlbumAsync,
    usePermissions,
} from 'expo-media-library';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { TDS200 } from '../../constants';
import { useGalleryContext } from '../../context';
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
    const [mediaPerm, reqMediaPerm] = usePermissions();
    const broCameraRef = useRef<Camera>(null);

    const handlePermission = async () => {
        if (
            permission?.status === PermissionStatus.GRANTED &&
            mediaPerm?.status === PermissionStatus.GRANTED
        ) {
            return true;
        }
        if (
            permission?.status === PermissionStatus.UNDETERMINED ||
            mediaPerm?.status === PermissionStatus.UNDETERMINED
        ) {
            const responses = await Promise.all([requestPermission(), reqMediaPerm()]);
            return responses.every((response) => response.granted);
        }
        if (
            permission?.status === PermissionStatus.DENIED ||
            mediaPerm?.status === PermissionStatus.DENIED
        ) {
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
        const hasPermission = await handlePermission();
        if (!hasPermission) return;
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
