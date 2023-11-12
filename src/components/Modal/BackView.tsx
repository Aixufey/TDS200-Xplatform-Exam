import { Text, View } from 'react-native';
interface IBackView {
    id: string;
    uri: string;
    children?: React.ReactNode;
    longitude?: number | null;
    latitude?: number | null;
}
const BackView: React.FC<IBackView> = ({ children, id, uri, longitude, latitude }) => {
    return (
        <View className="flex-1 bg-dark500 w-full h-full absolute justify-center items-center">
            <View className='flex-auto h-full w-[95%] justify-center items-center p-5'>
                <Text className="text-neutral font-handjet-light">ID: {id}</Text>
                <Text className="text-neutral font-handjet-light">URI: {uri}</Text>
                <Text className="text-neutral font-handjet-light">
                    Long: {longitude} - Lat: {latitude}
                </Text>
            </View>
            <View className='flex-auto h-[50%] w-[95%] border-tertiary border-[0.3px] rounded-md justify-center items-center'>
                <Text className='font-handjet-light text-neutral'>Map</Text>
                {children}
            </View>
        </View>
    );
};
export default BackView;
