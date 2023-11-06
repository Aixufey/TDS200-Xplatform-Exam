import { View } from 'react-native';
import { Background, Button } from '../../components';

const CameraScreen: React.FC = () => {
    return (
        <Background>
            <View className="w-full h-[80%] justify-evenly items-end flex-row">
                <Button text="Pro" style={{ backgroundColor: 'azure' }} />
                <Button text="Bro" style={{ backgroundColor: 'lime' }} />
            </View>
        </Background>
    );
};
export default CameraScreen;
