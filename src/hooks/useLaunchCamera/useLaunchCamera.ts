import { Camera } from 'expo-camera';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import {
    CameraType,
    ImagePickerAsset,
    launchCameraAsync,
    useCameraPermissions,
} from 'expo-image-picker';
import { Asset, addAssetsToAlbumAsync, createAlbumAsync, getAlbumAsync } from 'expo-media-library';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { TDS200 } from '../../constants';
import { useGalleryContext } from '../../context';
export type ProImageType = {
    id: string;
    uri: string;
    assetId?: string | null;
    width?: number;
    height?: number;
    type?: 'image' | 'video';
    fileName?: string | null;
    fileSize?: number;
    exif?: Record<string, any> | null;
    base64?: string | null;
    duration?: number | null;
};
export type BroImageType = {
    id: string;
    uri: string;
    width?: number;
    height?: number;
    base64?: string | null;
    exif?: Partial<MediaTrackSettings> | any;
};
export type MergedImageType = BroImageType & ProImageType & Partial<ImagePickerAsset>;
const useLaunchCamera = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const broCameraRef = useRef<Camera>(null);
    const { handlePictures, pictures, setCurrentPicture } = useGalleryContext();

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
        if (assets) {
            const uniqueId: string = snapshot.assets[0].exif?.DateTime.split(':').join('');
            const proWithId = {
                id: uniqueId,
                ...snapshot.assets[0],
            };
            setCurrentPicture(proWithId);
            handlePictures(proWithId);
        }
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
                // Bro don't have ID, so we slap on an ID
                const uniqueId: string = snapshot.exif.DateTime.split(':').join('');
                // Bro too huge, we compress bro
                const compressedBro = await manipulateAsync(
                    snapshot.uri,
                    [
                        {
                            resize: { height: 500, width: 500 },
                        },
                    ],
                    { compress: 0.2, format: SaveFormat.JPEG }
                );
                // Bro looking smooth with ID
                const compressedBroWithId = {
                    id: uniqueId,
                    ...compressedBro,
                };
                setCurrentPicture(compressedBroWithId);
                // setImageBro(compressedBro as BroImageType);
                // TODO: Upload broski to firebase
                // const asset = await createAssetAsync(compressedBro.uri);

                // handleSaveToAlbum(asset);
                handlePictures(compressedBroWithId);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return {
        broCameraRef,
        handleLaunchCameraPro,
        handleLaunchCameraBro,
    };
};
export default useLaunchCamera;
