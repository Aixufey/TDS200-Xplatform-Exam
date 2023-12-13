import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Background, Button, CameraView, ProPicture } from '../../components';
import { useGalleryContext } from '../../context';
import { useLaunchCamera, useLocation } from '../../hooks';

const CameraScreen: React.FC = () => {
    const { handleLaunchCameraPro } = useLaunchCamera();
    const [isBroCam, setIsBroCam] = useState<boolean>(false);
    const [isProCam, setIsProCam] = useState<boolean>(false);
    const { currentPicture } = useGalleryContext();
    const { getLocation, location } = useLocation();
    const isFocused = useIsFocused();

    useEffect(() => {
        return () => {
            setIsBroCam(false);
            setIsProCam(false);
        };
    }, [isFocused]);

    const handlePressBro = () => {
        setIsProCam(false);
        setIsBroCam((prev) => !prev)
    };

    const handlePressPro = async () => {
        setIsBroCam(false);
        setIsProCam(true);
        const loc = await getLocation();
        if (!loc) return alert('Camera needs location access');
       
        await handleLaunchCameraPro();
    };

    return (
        <Background>
            <View className="w-full h-full justify-center items-center">
                {currentPicture && isProCam && (
                    <ProPicture location={location} pictureUri={currentPicture.uri} />
                )}

                {isBroCam && <CameraView />}
                <View className="absolute bottom-[10%] w-full justify-evenly items-center flex-row">
                    <Button
                        onPress={handlePressPro}
                        text="Pro"
                        className="bg-cyan-400 justify-center items-center rounded-[10px] border-[1px] border-tertiary w-[85px] h-[55px]"
                    />
                    <Button
                        onPress={handlePressBro}
                        text="Bro"
                        className="bg-lime-300 justify-center items-center rounded-[10px] border-[1px] border-tertiary w-[85px] h-[55px]"
                    />
                </View>
            </View>
        </Background>
    );
};
export default CameraScreen;
