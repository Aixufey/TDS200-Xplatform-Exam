import { Camera } from "expo-camera";
import { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

const useOwnPermission = () => {
    const [permissions, setPermissions] = useState({
        camera: false,
        mediaLibrary: false,
    });
    useEffect(() => {
        const requestPermissions = async () => {
            // Requesting Camera Permission
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            console.log(cameraPermission)
            if (cameraPermission.status !== MediaLibrary.PermissionStatus.GRANTED) {
                Alert.alert('Camera permission is required to take pictures.');
            }
            console.log('here')

            // Requesting Media Library Permission
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            console.log(mediaLibraryPermission)
            if (mediaLibraryPermission.status !== MediaLibrary.PermissionStatus.GRANTED) {
                Alert.alert('Media library permission is required to save pictures.');
            }

            setPermissions({
                camera: cameraPermission.status === MediaLibrary.PermissionStatus.GRANTED,
                mediaLibrary: mediaLibraryPermission.status === MediaLibrary.PermissionStatus.GRANTED,
            });
        };

        requestPermissions();
    }, []);
    return permissions;
}
export default useOwnPermission;