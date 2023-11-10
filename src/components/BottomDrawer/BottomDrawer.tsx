import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { useGalleryContext } from '../../context';
interface IBottomDrawer {
    children?: React.ReactNode;
    className?: string;
    style?: StyleProp<ViewStyle>;
}

const BottomDrawer: React.FC<IBottomDrawer> = ({ children, className, style }) => {
    const { selectedPictures, currentPicture, toggleFavorite, handleDeletePicture } =
        useGalleryContext();
    return (
        <View
            style={style}
            className={
                className ??
                'bg-neutral rounded-tl-xl rounded-tr-xl w-full h-full z-100 flex-row justify-evenly items-center pb-5'
            }
        >
            <View>
                <Pressable
                    onPress={() => toggleFavorite(selectedPictures)}
                    className="justify-center items-center"
                >
                    <MaterialIcons name="favorite-border" size={24} color="black" />
                </Pressable>
            </View>
            <View>
                <Pressable
                    onPress={() => handleDeletePicture(selectedPictures)}
                    className="justify-center items-center"
                >
                    <AntDesign name="delete" size={24} color="black" />
                </Pressable>
            </View>
            {children}
        </View>
    );
};
export default BottomDrawer;
