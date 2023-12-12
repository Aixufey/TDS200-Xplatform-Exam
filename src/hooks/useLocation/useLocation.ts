import * as Location from 'expo-location';
import { useState } from 'react';

/**
 * @description Custom hook to fetch the location
 * @returns a promise of location object of current geo location
 */
const useLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject>();
    const getLocation = async (): Promise<Location.LocationObject> => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });
        // console.info(`lat: ${location.coords.latitude} - long:${location.coords.longitude}`);
        setLocation(location);
        return location;
    };
    return { location, getLocation };
};
export default useLocation;
