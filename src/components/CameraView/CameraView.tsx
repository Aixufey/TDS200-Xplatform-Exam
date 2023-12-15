import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { captionsDoc } from '../../constants';
import { useAuth, useGalleryContext } from '../../context';
import { useFireBase } from '../../context/FireBaseContext';
import { useLaunchCamera, useLocation } from '../../hooks';
import DesignSystem from '../../styles';
import { Button, IconButton } from '../Button';
import { CustomModal } from '../Modal';
const CameraView: React.FC = () => {
    const { handleLaunchCameraBro, broCameraRef, handleSubmitPhoto, updateCaptions, setCoords } =
        useLaunchCamera();
    const { currentPicture } = useGalleryContext();
    const [isCaption, setIsCaption] = useState<boolean>(false);
    const [togglePreviewModal, setTogglePreviewModal] = useState<boolean>(false);
    const [togglePictureModal, setTogglePictureModal] = useState<boolean>(false);
    const [captionInput, setCaptionInput] = useState<string>('');
    const [descriptionInput, setDescriptionInput] = useState<string>('');
    const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
    const [captions, setCaptions] = useState<string[]>([]);
    const { Colors } = DesignSystem();
    const { firebase_db } = useFireBase();
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject>();
    const { getLocation } = useLocation();
    const descriptionOnBlurRef = useRef<TextInput>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchLocation = async () => {
            const location = await getLocation();
            setCurrentLocation(location);
            if (location) {
                setCoords({
                    latitude: location?.coords.latitude,
                    longitude: location?.coords.longitude,
                });
            }
        };
        fetchLocation();
    }, []);

    useEffect(() => {
        console.log(isCaption);
    }, [isCaption]);

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
        setIsCaption(false);
        setDescriptionInput('');
        setCaptions([]);
    };

    /**
     * Upload cacheData from taken snapshot on save
     * Upload captions if any
     * Close Picture modal
     * Imperative reset for new input
     */
    const handleSavePress = () => {
        handleSubmitPhoto();
        updateFirestoreCaptions();
        handleTogglePictureModal();
        setIsCaption(false);
        setDescriptionInput('');
        setCaptions([]);
    };

    /**
     * @description Upload to database, storing this picture's captions and description
     * Keeping database normalized.
     */
    const updateFirestoreCaptions = async () => {
        if (currentPicture?.id === undefined) {
            return alert('Picture does not exist');
        }
        if (currentUser === null) {
            return alert('User does not exist');
        }
        const captionsRef = doc(firebase_db, captionsDoc, currentPicture.id);
        try {
            await setDoc(
                captionsRef,
                {
                    pictureId: currentPicture.id,
                    userId: currentUser.displayName,
                    captions,
                    description: descriptionInput.trim(),
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
            const updatedCaptions = [captionInput.trim(), ...prevCaptions];
            updateCaptions(updatedCaptions);
            return updatedCaptions;
        });
        setCaptionInput('');
    };

    const handleCaptionChange = (txt: string) => {
        const sanitize = txt.trimStart();
        setCaptionInput(sanitize);
    };

    const handleDescriptionChange = (txt: string) => {
        const sanitize = txt.trimStart();
        setDescriptionInput(sanitize);
    };

    const handleIsCaptionPress = () => {
        setIsCaption((prev) => !prev);
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

    /**
     * @description Renders the modal for adding description and captions
     */
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
                                Description
                            </Text>
                        </View>
                        <View className="py-2 w-[250px] h-[250px]">
                            <Image
                                className="w-full h-full"
                                source={{ uri: currentPicture?.uri }}
                            />
                        </View>
                        <View className="w-[85%] flex-row justify-end items-center px-2">
                            <Text className="text-neutral font-handjet-light px-2">
                                {isCaption ? 'Close' : 'Add'} caption
                            </Text>
                            {isCaption ? (
                                <IconButton
                                    onPress={handleIsCaptionPress}
                                    IconSet="MaterialCommunityIcons"
                                    iconName="toggle-switch"
                                    iconSize={30}
                                    iconColor={Colors.secondary}
                                />
                            ) : (
                                <IconButton
                                    onPress={handleIsCaptionPress}
                                    IconSet="MaterialCommunityIcons"
                                    iconName="toggle-switch-off"
                                    iconSize={30}
                                    iconColor={Colors.tertiary500}
                                />
                            )}
                        </View>

                        {isCaption ? renderCaptionView() : renderDescriptionView()}

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
    /**
     * @description Renders the description input view logic
     */
    const renderDescriptionView = () => {
        return (
            <View className="w-[85%] h-[30%] border-[0.5px] border-tertiary rounded-xl justify-evenly items-center flex-row">
                <View className="w-[85%] h-[85%] flex-wrap overflow-hidden">
                    <TextInput
                        ref={descriptionOnBlurRef}
                        className="w-full h-full text-neutral font-ubuntu-regular tracking-widest"
                        onChangeText={handleDescriptionChange}
                        value={descriptionInput}
                        scrollEnabled={true}
                        cursorColor={Colors.secondary}
                        multiline={true}
                        placeholder="Enter description..."
                        placeholderTextColor={Colors.tertiaryRei}
                    />
                </View>
                <IconButton
                    disabled={descriptionInput ? false : true}
                    onPress={() => descriptionOnBlurRef.current?.blur()}
                    className={`${descriptionInput ? 'opacity-1' : 'opacity-0'}`}
                    IconSet="Feather"
                    iconName="send"
                    iconSize={25}
                    iconColor={Colors.tertiary}
                />
            </View>
        );
    };
    /**
     * @description Renders the caption input view logic
     */
    const renderCaptionView = () => {
        return (
            <View className="flex w-[85%] h-[30%] border-[0.5px] border-tertiary rounded-xl justify-evenly items-center">
                <View className="basis-auto w-[85%] max-h-[50%] overflow-hidden justify-evenly items-center">
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
                                <View className="basis-2/3 w-[85%] justify-evenly items-center">
                                    <Text className="text-neutral p-1 font-handjet-light tracking-wide">
                                        No captions...
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
                <View className="basis-1/3 w-[85%] flex-row justify-center items-center">
                    <View className="w-[85%] flex-wrap overflow-hidden">
                        <TextInput
                            cursorColor={Colors.secondary}
                            onChangeText={handleCaptionChange}
                            className="w-[100%] text-neutral font-ubuntu-regular tracking-widest"
                            value={captionInput}
                            multiline={true}
                            placeholder="Enter captions..."
                            placeholderTextColor={Colors.tertiaryRei}
                        />
                    </View>

                    <IconButton
                        disabled={captionInput ? false : true}
                        className={`${captionInput ? 'opacity-1' : 'opacity-0'}`}
                        onPress={handleCaptionPress}
                        IconSet="Feather"
                        iconName="send"
                        iconSize={25}
                        iconColor={Colors.tertiary}
                    />
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 justify-center items-center">
            <View className="absolute h-[450px] bg-dark500 items-center border-[0.5px] border-secondary">
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
