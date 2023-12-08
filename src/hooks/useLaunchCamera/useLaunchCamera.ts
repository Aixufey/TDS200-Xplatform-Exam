import { Camera } from 'expo-camera';
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
import { useManipulateImage } from '../useManipulateImage';
import { coordinates, useUploadImageToFirebase } from '../useUploadImageToFirebase';

// Type definitions is taken from Expo Camera
export type ProImageType = {
    id: string;
    uri: string;
    assetId?: string | null;
    width?: number;
    height?: number;
    type?: 'image' | 'video';
    fileName?: string | null;
    fileSize?: number;
    exif?: Partial<MediaTrackSettings> | any;
    base64?: string | null;
    duration?: number | null;
    coordinates?: {
        longitude?: number | undefined;
        latitude?: number | undefined;
    };
    captions?: string[];
};
export type BroImageType = {
    id: string;
    uri: string;
    width?: number;
    height?: number;
    base64?: string | null;
    exif?: Partial<MediaTrackSettings> | any;
    coordinates?: {
        longitude?: number | undefined;
        latitude?: number | undefined;
    };
    captions?: string[];
};
export type MergedImageType = BroImageType & ProImageType & Partial<ImagePickerAsset>;
export type BucketListType = Pick<
    MergedImageType,
    'id' | 'uri' | 'coordinates' | 'exif' | 'captions'
>;
type CacheData = {
    id: string;
    blob: Blob;
    exif: Partial<MediaTrackSettings> | any;
    coordinates: coordinates;
};
const useLaunchCamera = () => {
    const [DoesNotWorkUsingMyOwnState, requestPermission] = useCameraPermissions();
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const broCameraRef = useRef<Camera>(null);
    const { handleTakenPictures, setCurrentPicture, currentPicture } = useGalleryContext();
    const [cacheData, setCacheData] = useState<CacheData | undefined>(undefined);
    const [captions, setCaptions] = useState<string[]>([]);

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
        console.log(captions);
    }, [captions, fetchCamera, hasPermission]);

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
                longitude: 0.0,
                latitude: 0.0,
            };
            setCurrentPicture(proWithId);
            handleTakenPictures(proWithId);
        }
    };

    const updateCaptions = (input: string[]) => {
        setCaptions(input);
    };

    /**
     * Upload snapshot on save.
     * Could have solve it differently, but it works🤷‍♂️
     */
    const handleSubmitPhoto = async () => {
        if (cacheData === undefined) {
            return alert(`No cache data`);
        }
        console.log('saving captions to db', captions.length);
        await useUploadImageToFirebase(
            cacheData.id,
            cacheData.blob,
            cacheData.exif,
            {
                latitude: cacheData.coordinates.latitude,
                longitude: cacheData.coordinates.longitude,
            },
            captions
        );
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
                const { exif } = snapshot;
                // Bro don't have ID, so we slap on an ID using regex to rm all colons and trim whitespace
                const uniqueId: string = snapshot.exif.DateTime.replace(/[:\s]/g, '');
                console.log(uniqueId);
                // Bro too huge, we compress bro
                const compressedBro = await useManipulateImage(snapshot.uri);
                if (compressedBro) {
                    const { uri } = compressedBro;
                    // Bro looking smooth with ID
                    const compressedBroWithId = {
                        id: uniqueId,
                        ...compressedBro,
                        longitude: 0.0,
                        latitude: 0.0,
                    };
                    // For Modal preview
                    setCurrentPicture(compressedBroWithId);

                    /**
                     * Placeholder for all snapped pictures.
                     * The decision when to upload to firebase.
                     * 1. For synchronization - upload to firebase every time you snap a picture
                     * 2. Greener API - upload in batch when unmounting gallery screen, user can still see the snapped picture(s)
                     */
                    const resp = await fetch(uri);
                    const blob = await resp.blob();

                    // await useUploadImageToFirebase(compressedBroWithId.id, blob, exif, {
                    //     latitude: compressedBroWithId.latitude,
                    //     longitude: compressedBroWithId.longitude,
                    // });
                    handleTakenPictures(compressedBroWithId);
                    // Cache the data when user is satisfied with captions then save on demand.
                    setCacheData({
                        id: compressedBroWithId.id,
                        blob,
                        exif,
                        coordinates: {
                            latitude: compressedBroWithId.latitude,
                            longitude: compressedBroWithId.longitude,
                        },
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    return {
        broCameraRef,
        handleSubmitPhoto,
        handleLaunchCameraPro,
        handleLaunchCameraBro,
        updateCaptions,
    };
};
export default useLaunchCamera;
