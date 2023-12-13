import { LocationObject } from 'expo-location';
import { Image, Text, View, ViewProps } from 'react-native';
import { MapItem } from '../MapItem';

interface IProPicture extends ViewProps {
    pictureUri: string;
    location: LocationObject | undefined;
}
const ProPicture: React.FC<IProPicture> = ({ pictureUri, location, className }) => {
    if (!location) return null;
    const { latitude, longitude } = location.coords;
    return (
        <View className={className ?? `w-[95%] h-[85%] justify-start items-center`}>
            <View>
                <Text className="text-neutral font-handjet-light">
                    Pro picture for display - insufficient cash for the cloud
                </Text>
            </View>
            <View className="w-[300px] h-[300px]">
                <Image className="w-full h-full" source={{ uri: pictureUri }} />
            </View>
            {location && (
                <MapItem
                    className="w-[300px] h-[150px]"
                    title={"You're here"}
                    description={'Taken with Pro Camera'}
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                    }}
                />
            )}
        </View>
    );
};
export default ProPicture;
