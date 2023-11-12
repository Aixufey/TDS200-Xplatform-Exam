import * as ExpoIcons from '@expo/vector-icons';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
interface IIConButton extends TouchableOpacityProps {
    IconSet: keyof typeof ExpoIcons;
    iconName: string;
    iconSize: number;
    iconColor: string;
    children?: React.ReactNode;
    className?: string;
    onPress?: () => void;
}
/**
 * @param Default is MaterialIcons, icon name ?, icon size 24, icon color black
 * @returns HOC for creating a button with an Icon that use TouchableOpacity as a base component.
 * @example AntDesign, Entypo, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons, SimpleLineIcons, Zocial
 * @link https://icons.expo.fyi/Index
 */
const IconButton: React.FC<IIConButton> = ({
    IconSet = 'MaterialIcons',
    iconName,
    iconSize = 24,
    iconColor = 'black',
    children,
    className,
    onPress,
    ...props
}) => {
    // All available keys for ExpoIcons
    const IconComponent = ExpoIcons[IconSet];
    return (
        <TouchableOpacity
            onPress={onPress}
            className={className ?? 'justify-center items-center'}
            {...props}
        >
            {IconComponent && <IconComponent name={iconName} size={iconSize} color={iconColor} />}
        </TouchableOpacity>
    );
};
export default IconButton;
