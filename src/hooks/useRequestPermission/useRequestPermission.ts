import { requestPermissionsAsync } from 'expo-media-library';
import { useCallback, useState } from 'react';
/**
 * 
 * @returns permission response and request for permission function
 */
const useRequestPermission = () => {
    const [hasPermission, setPermission] = useState<boolean>(false);
    const requestPermission = useCallback(async () => {
        try {
            const response = await requestPermissionsAsync();
            if (response.status !== 'granted') {
                return setPermission(false);
            }
            setPermission(response.granted);
        } catch (e) {
            console.error(e);
        }
    }, []);
    return {
        hasPermission,
        requestPermission,
    };
};
export default useRequestPermission;
