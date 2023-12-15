import { Text, View } from 'react-native';
import { MergedImageType } from '../../hooks';
interface IBackView extends MergedImageType {
    children?: React.ReactNode;
}
const BackView: React.FC<IBackView> = ({
    children,
    id,
    uri,
    exif,
    coordinates,
    captions,
    timeStamp,
}) => {
    return (
        <View className="flex-1 bg-dark500 w-full h-full absolute justify-center items-center">
            <View className="flex-auto h-[50%] w-[95%] justify-center items-center p-5">
                <Text className="text-neutral font-handjet-light">ID: {id}</Text>
                <Text className="text-neutral font-handjet-light">
                    Date: {new Date(exif.timeStamp).toLocaleString()}
                </Text>
                <Text className="text-neutral font-handjet-light">
                    Long: {coordinates?.longitude} - Lat: {coordinates?.latitude}
                </Text>
            </View>
            <Text className="font-handjet-light text-neutral">Map</Text>
            <View className="flex-auto h-[75%] w-[95%] border-tertiary border-[2px] mb-2 rounded-md justify-center items-center">
                {children}
            </View>
        </View>
    );
};
export default BackView;
