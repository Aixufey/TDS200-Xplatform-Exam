import { LinearGradient } from 'expo-linear-gradient';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';
import DesignSystem from '../../styles';

interface IButton {
    className?: string;
    children?: React.ReactNode;
    text?: string;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}
const Button: React.FC<IButton> = ({ onPress, style, className, text, children }) => {
    const { Colors } = DesignSystem();
    return (
        <LinearGradient
            style={style}
            colors={[Colors.secondary, Colors.primary200, Colors.tertiary300, 'transparent']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            className={
                className ? className : 
                'justify-center items-center rounded-[10px] border-[0.5px] border-[#FFA] w-[85px] h-[55px]'
            }
        >
            <TouchableOpacity onPress={onPress}>
                {children ?? (
                    <Text className="text-[#FFA] text-3xl font-handjet-black">
                        {text ? text : 'Button'}
                    </Text>
                )}
            </TouchableOpacity>
        </LinearGradient>
    );
};
export default Button;
