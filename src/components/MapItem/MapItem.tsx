import { View } from 'react-native';
import MapView, { MapMarker, PROVIDER_GOOGLE } from 'react-native-maps';

type MapItemProps = {
    className?: string;
    title: string;
    description: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
};
const MapItem: React.FC<MapItemProps> = ({ className, title, description, coordinate }) => {
    let latitude = isNaN(coordinate.latitude) ? 39.01972053389763 : coordinate.latitude;
    let longitude = isNaN(coordinate.longitude) ? 125.75310718337947 : coordinate.longitude;
    return (
        <View
            className={
                className ??
                'flex-1 absolute top-0 bottom-0 left-0 right-0 border-2 border-primary w-[250px] h-[250px]'
            }
        >
            <MapView
                showsCompass={true}
                showsBuildings={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
                className="flex-1"
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 39.01972053389763,
                    longitude: 125.75310718337947,
                    latitudeDelta: 0.0045,
                    longitudeDelta: 0.0045,
                }}
                initialCamera={{
                    center: {
                        latitude: 39.01972053389763,
                        longitude: 125.75310718337947,
                    },
                    pitch: 30,
                    heading: 10,
                    altitude: 100,
                    zoom: 50,
                }}
                region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.0045,
                    longitudeDelta: 0.0045,
                }}
            >
                <MapMarker
                    title={title ?? 'Pyongyang'}
                    description={description ?? ''}
                    draggable={true}
                    icon={require('../../../assets/pin.png')}
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                    }}
                />
            </MapView>
        </View>
    );
};
export default MapItem;
