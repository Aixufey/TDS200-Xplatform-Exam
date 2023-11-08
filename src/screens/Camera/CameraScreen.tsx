import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Background, Button, CameraView } from '../../components';
import { useLaunchCamera } from '../../hooks';

const CameraScreen: React.FC = () => {
    const { handleLaunchCameraPro } = useLaunchCamera();
    const [isBroCam, setIsBroCam] = useState<boolean>(false);
    const isFocused = useIsFocused();
    useEffect(() => {
        return () => setIsBroCam(false);
    }, [isFocused]);
    const handlePressBro = () => setIsBroCam((prev) => !prev);

    return (
        <Background>
            <View className="w-full h-full justify-center items-center">
                {isBroCam && (
                    <CameraView />
                )}
                <View className="absolute bottom-[10%] w-full justify-evenly items-center flex-row">
                    <Button
                        onPress={handleLaunchCameraPro}
                        text="Pro"
                        className="bg-cyan-400 justify-center items-center rounded-[10px] border-[0.5px] border-[#FFA] w-[85px] h-[55px]"
                    />
                    <Button
                        onPress={handlePressBro}
                        text="Bro"
                        className="bg-lime-300 justify-center items-center rounded-[10px] border-[0.5px] border-[#FFA] w-[85px] h-[55px]"
                    />
                </View>
            </View>
        </Background>
    );
};
export default CameraScreen;
