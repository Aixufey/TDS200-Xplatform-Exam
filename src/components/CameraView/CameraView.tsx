import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { captionsDoc } from '../../constants';
import { useGalleryContext } from '../../context';
import { useFireBase } from '../../context/FireBaseContext';
import { useLaunchCamera } from '../../hooks';
import DesignSystem from '../../styles';
import { Button, IconButton } from '../Button';
import { CustomModal } from '../Modal';
const CameraView: React.FC = () => {
    const { handleLaunchCameraBro, broCameraRef, handleSubmitPhoto, updateCaptions, setCoords } =
        useLaunchCamera();
    const { currentPicture } = useGalleryContext();
    const [togglePreviewModal, setTogglePreviewModal] = useState<boolean>(false);
    const [togglePictureModal, setTogglePictureModal] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
    const [captions, setCaptions] = useState<string[]>([]);
    const { Colors } = DesignSystem();
    const { firebase_db } = useFireBase();
    const [location, setLocation] = useState<any>();
    // refactor this into hook and save localstorage for permission
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            // console.log(status);

            let location = await Location.getCurrentPositionAsync({
                //accuracy: Location.Accuracy.Highest,
            });
            console.log('lat ', location.coords.latitude);
            console.log('long ', location.coords.longitude);
            setCoords({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            setLocation(location);
        })();
    }, []);

    const handleTogglePreviewModal = () => {
        if (!currentPicture) return;
        setTogglePreviewModal((prev) => !prev);
    };

    const handleTogglePictureModal = () => {
        setTogglePictureModal((prev) => !prev);
    };

    const handleToggleCameraType = () => {
        setCameraType((curr) => (curr === CameraType.back ? CameraType.front : CameraType.back));
    };

    const handleCameraPress = () => {
        handleTogglePictureModal();
        handleLaunchCameraBro();
    };

    const handleCancelPress = () => {
        handleTogglePictureModal();
        setCaptions([]);
    };

    /**
     * Upload cacheData from taken snapshot on save
     * Upload captions if any
     * Close Picture modal
     * Imperative reset for new captions
     */
    const handleSavePress = () => {
        handleSubmitPhoto();
        updateFirestoreCaptions();
        handleTogglePictureModal();
        setCaptions([]);
    };

    const updateFirestoreCaptions = async () => {
        if (currentPicture?.id === undefined) {
            return alert('Picture does not exist');
        }
        const captionsRef = doc(firebase_db, captionsDoc, currentPicture.id);
        try {
            await setDoc(
                captionsRef,
                {
                    pictureId: currentPicture.id,
                    userId: 'User123',
                    captions,
                },
                { merge: true }
            );
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };

    /**
     *
     * Arbitrary decision to uplift the captions during submissions instead of making extra firebase calls
     * Usually you would normalize the table, but in this case this is the easiest solution🤷‍♂️
     * States in React are always async, so explicit returning the data will assure updateCaption receive most recent data.
     */
    const handleDeleteCaption = (item: string) => {
        setCaptions((prevCaptions) => {
            const updatedCaptions = prevCaptions.filter((i) => i !== item);
            updateCaptions(updatedCaptions);
            return updatedCaptions;
        });
    };
    const handleCaptionPress = () => {
        setCaptions((prevCaptions) => {
            const updatedCaptions = [input, ...prevCaptions];
            updateCaptions(updatedCaptions);
            return updatedCaptions;
        });
        setInput('');
    };

    const handleCaptionChange = (txt: string) => {
        let sanitize = txt.toLowerCase().trim();
        setInput(sanitize);
    };

    const renderPreviewModal = () => {
        return (
            togglePreviewModal && (
                <CustomModal
                    intensity={25}
                    toggleModal={handleTogglePreviewModal}
                    className="justify-center items-center absolute w-full h-full"
                />
            )
        );
    };

    const renderPictureModal = () => {
        return (
            togglePictureModal && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={togglePictureModal}
                    onRequestClose={handleTogglePictureModal}
                >
                    <View className="flex justify-evenly items-center w-[100%] h-[100%] border-[1px] border-tertiary rounded-xl bg-dark200">
                        <View>
                            <Text className="text-neutral font-handjet-light text-[30px]">
                                Caption
                            </Text>
                        </View>
                        <View className="py-2 w-[250px] h-[250px]">
                            <Image
                                className="w-full h-full"
                                source={{ uri: currentPicture?.uri }}
                            />
                        </View>
                        <View className="w-[85%] h-[20%] border-[0.5px] p-1 rounded-xl border-tertiary p-2">
                            <ScrollView className="">
                                <View className="justify-center items-center m-1 flex-row flex-wrap">
                                    {captions.length > 0 ? (
                                        captions.map((caption, index) => (
                                            <Text
                                                onPress={() => handleDeleteCaption(caption)}
                                                key={index}
                                                className="text-neutral p-1 font-handjet-light tracking-wide"
                                            >
                                                {`#${caption}`}
                                            </Text>
                                        ))
                                    ) : (
                                        <Text className="text-neutral p-1 font-handjet-light tracking-wide">
                                            No captions...
                                        </Text>
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                        <View className="w-[85%] h-[10%] flex-row justify-center items-center">
                            <View className="w-[85%] flex-wrap overflow-hidden">
                                <TextInput
                                    onChangeText={handleCaptionChange}
                                    className="w-[100%] text-neutral font-handjet-light tracking-widest"
                                    value={input}
                                    multiline={true}
                                    placeholder="Enter captions..."
                                    placeholderTextColor={Colors.tertiaryRei}
                                />
                            </View>

                            <IconButton
                                disabled={input ? false : true}
                                className={`${input ? 'opacity-1' : 'opacity-0'}`}
                                onPress={handleCaptionPress}
                                IconSet="Feather"
                                iconName="send"
                                iconSize={25}
                                iconColor={Colors.neutral100}
                            />
                        </View>
                        <View className="w-full h-[10%] justify-evenly items-center flex-row">
                            <Button
                                onPress={handleCancelPress}
                                text="Cancel"
                                className="w-[95px] h-[40px] rounded-xl justify-center items-center border-[1px] border-tertiary"
                            />
                            <Button
                                onPress={handleSavePress}
                                text="Save"
                                className="w-[95px] h-[40px] rounded-xl justify-center items-center border-[1px] border-tertiary"
                            />
                        </View>
                    </View>
                </Modal>
            )
        );
    };

    return (
        <View className="flex-1 justify-center items-center">
            <View className="absolute h-[450px] bg-dark500 items-center border-[0.5px] border-[#FFA]">
                <Camera
                    ratio="1:1"
                    className="w-[350px] h-[350px]"
                    ref={broCameraRef}
                    type={cameraType}
                />
                <View className="absolute w-full bottom-3 flex-row justify-evenly">
                    <View className="w-[20%] border-[0.5px] border-white bg-dark400">
                        <TouchableOpacity className="flex-1" onPress={handleTogglePreviewModal}>
                            {currentPicture && (
                                <Image
                                    source={{ uri: currentPicture?.uri }}
                                    className="absolute w-full h-full"
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    <IconButton
                        onPress={handleCameraPress}
                        className="opacity-90"
                        IconSet="MaterialIcons"
                        iconName="camera"
                        iconSize={65}
                        iconColor={Colors.neutral100}
                    />
                    <IconButton
                        onPress={handleToggleCameraType}
                        className="opacity-90"
                        IconSet="MaterialIcons"
                        iconName="flip-camera-ios"
                        iconSize={65}
                        iconColor={Colors.neutral100}
                    />
                </View>
                {renderPreviewModal()}
            </View>
            {renderPictureModal()}
        </View>
    );
};
export default CameraView;
