import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { useGalleryContext } from '../../context';
interface IBottomDrawer {
    children?: React.ReactNode;
}

const BottomDrawer: React.FC<IBottomDrawer> = ({ children }) => {
    const { currentPicture, addToFavorites, removeFromFavorites } = useGalleryContext();
    return (
        <View className="bg-neutral rounded-tl-xl rounded-tr-xl w-full h-full z-100 flex-row justify-evenly items-center pb-5">
            <View>
                <Pressable
                    onPress={() => addToFavorites({ id: 1, firstName: currentPicture })}
                    className="justify-center items-center"
                >
                    <MaterialIcons name="favorite-border" size={24} color="black" />
                </Pressable>
            </View>
            <View>
                <Pressable
                    onPress={() => removeFromFavorites({ id: 1 })}
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
