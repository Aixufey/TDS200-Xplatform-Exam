import { useIsFocused } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { requestPermissionsAsync, PermissionStatus } from 'expo-media-library';
import React, { useCallback, useLayoutEffect as useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Background, Canvas, CustomModal, Picture } from '../../components';
import { useGalleryContext, useUIContext } from '../../context';
import { cameraPermission, imageAlbum } from '../../constants';
const GalleryScreen: React.FC = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const { data, favorite, updateData } = useGalleryContext();
    const { resetState, isPress, isLongPress } = useUIContext();

    // const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [hasPermission, setPermission] = useState<string>(PermissionStatus.UNDETERMINED);
    useEffect(() => {
        (async () => {
            // const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaPermission = await requestPermissionsAsync();
            // const result = await requestPermission()
            //console.log(cameraPermission);
            let result;
            switch (mediaPermission.status) {
                case PermissionStatus.GRANTED:
                    result = PermissionStatus.GRANTED;
                    break;
                case PermissionStatus.DENIED:
                    result = PermissionStatus.DENIED;
                    break;
                default:
                    result = PermissionStatus.UNDETERMINED;
                    break;
            }
            setPermission(result);
        })();
    }, []);

    // Memoize the fetchAlbum function and reconcile when dependency changes.
    const fetchAlbum = useCallback(async () => {
        console.log(hasPermission.toLowerCase());
        try {
            // const album = await MediaLibrary.getAlbumsAsync();
            // if (!album) return console.log(`Error loading album `, album);
            // const media = await MediaLibrary.getAssetsAsync({
            //     mediaType: 'photo',
            //     sortBy: 'creationTime',
            //     album: album.find((item) => item.title === imageAlbum),
            // });
            // updateData(media.assets);
        } catch (e) {
            console.error(e);
        }
    }, []);

    // Mount when memoized fetchAlbum is changed
    useEffect(() => {
        fetchAlbum();
    }, [fetchAlbum]);

    useEffect(() => {
        return () => {
            // Reset states when leaving the screen
            // Reset drawer state, press state, long press state, all selected pictures
            resetState();
            // console.log('Unmounted Gallery Screen');
        };
    }, [isFocused]);

    useEffect(() => {
        // Open modal on item click.
        if (isPress && !isLongPress) {
            setToggleModal(true);
        }
        // Close modal on unmount.
        if (!isFocused) setToggleModal(false);
    }, [isPress, isFocused]);

    const handleToggleModal = () => {
        setToggleModal(false);
    };

    return (
        <Background>
            <View className="flex-1 w-full bottom-[4.5%] justify-center items-center">
                {PermissionStatus.GRANTED ? (
                    <Text className='text-white text-3xl'>lol</Text>
                ) : PermissionStatus.UNDETERMINED ? (
                    <Text className='text-white text-3xl'>Requesting permission...</Text>
                ) : PermissionStatus.DENIED ? (
                    <Text className='text-white text-3xl'>Permission denied</Text>
                ) : null}
                {toggleModal ? (
                    <CustomModal
                        toggleModal={handleToggleModal}
                        onPress={handleToggleModal}
                        intensity={8}
                        className="absolute w-full h-[91%] justify-center items-center"
                    >
                        <Text className="justify-center items-center text-[#FbAA]">
                            Pass children here
                        </Text>
                    </CustomModal>
                ) : null}
            </View>
        </Background>
    );
};
export default GalleryScreen;
