import { BlurView } from 'expo-blur';
import { ScrollView, View } from 'react-native';
interface ICustomModal {
    intensity?: number;
    children?: React.ReactNode;
}
const CustomModal: React.FC<ICustomModal> = ({ intensity, children }) => {
    return (
        <BlurView
            intensity={intensity || 5}
            tint="dark"
            className="flex-1 w-full h-full text-center justify-center items-center overflow-hidden"
        >
            <View className="w-[65%] h-[65%] border-[1px] border-[#000] p-[6px] bg-[#151515] rounded-2xl overflow-hidden justify-center items-center">
                <ScrollView>{children}</ScrollView>
            </View>
        </BlurView>
    );
};
export default CustomModal;
