import { Text } from 'react-native';
import { Background } from '../../components';
const HomeScreen: React.FC = () => {
    return (
        <Background>
            <Text className="text-neutral tracking-widest font-handjet-black text-[150px]">
                Home
            </Text>
        </Background>
    );
};
export default HomeScreen;
