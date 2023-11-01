import { Image, Text, View } from 'react-native';

interface IPicture {
    uri?: string;
}
const Picture: React.FC<IPicture> = ({ uri }) => {
    const fallBackUri = '../../../assets/images/cicada.png';
    return (
        <View className="w-[150px] h-[150px] border-2 border-white ">
            <Image source={{ uri: fallBackUri }} className='flex-1 w-full h-full bg-white'/>
        </View>
    );
};
export default Picture;
