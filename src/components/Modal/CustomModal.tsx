import { AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { TouchableOpacity, Text,View } from 'react-native';
import { useGalleryContext } from '../../context';
import DesignSystem from '../../styles';
interface ICustomModal {
    intensity?: number;
    children?: React.ReactNode;
    className?: string;
    onPress?: () => void;
}
const CustomModal: React.FC<ICustomModal> = ({ onPress, className, intensity, children }) => {
    const { Colors } = DesignSystem();
    const { currentPicture, resetState } = useGalleryContext();

    const handleOnPressClose = () => {
        onPress && onPress();
        resetState();
    };

    return (
        <BlurView intensity={intensity || 5} tint="dark" className={className}>
            <View className="w-[75%] h-[75%] border-[1px] border-[#00ffff] p-[6px] bg-dark300 rounded-2xl overflow-hidden justify-center items-center">
                <TouchableOpacity
                    onPress={handleOnPressClose}
                    className="absolute top-2 right-2 w-[45px] h-[45px] justify-center items-center"
                >
                    <AntDesign name="closecircle" size={24} color={Colors.tertiary} />
                </TouchableOpacity>
                {
                    currentPicture &&
                    <View>
                            <Text className='text-white'>{currentPicture.firstName}</Text>
                            { children }
                    </View>
                }
            </View>
        </BlurView>
    );
};
export default CustomModal;
