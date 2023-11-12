import { Text, View } from 'react-native';
interface IBackView {
    id: string;
    uri: string;
    children?: React.ReactNode;
}
const BackView: React.FC<IBackView> = ({ children, id, uri }) => {
    return (
        <View className="flex-1 bg-dark500 w-full h-full absolute justify-center items-center">
            <Text className="text-white font-handjet-light">ID: {id}</Text>
            <Text className="text-white font-handjet-light">URI: {uri}</Text>
            {children}
        </View>
    );
};
export default BackView;
