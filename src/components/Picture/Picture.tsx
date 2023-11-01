import { Image, View } from 'react-native';

interface IPicture {
    uri?: string;
}
const Picture: React.FC<IPicture> = ({ uri }) => {
    const fallBackUri = '../../../assets/images/cicada.png';
    return (
        <View className="min-w-[75px] min-h-[75px] border-[0.5px] border-dark">
            <Image
                source={require('../../../assets/images/cicada.png')}
                className="flex-1 w-full h-full bg-neutral300 "
            />
        </View>
    );
};
export default Picture;
