import { Text, View } from 'react-native';
interface IPermissionView {
    message?: string;
    children?: React.ReactNode;
}
const PermissionView: React.FC<IPermissionView> = ({ message, children }) => {
    return (
        <View className="absolute top-[25%] justify-center items-center">
            <Text className="text-white text-3xl font-handjet-regular text-justify">
                Grant access from device settings
            </Text>
            <Text className="mt-5 text-white text-xl font-handjet-regular text-center w-[50%]">
                {message ??
                    'Please grant the permission from your phone device settings or close and restart the application\nThis includes media and audio permissions.'}
            </Text>
            {children && children}
        </View>
    );
};
export default PermissionView;
