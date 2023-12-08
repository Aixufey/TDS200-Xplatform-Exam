import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useLayoutEffect as useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';
import {
    Background,
    Canvas,
    CustomModal,
    IconButton,
    PermissionView,
    Picture,
} from '../../components';
import { libPermission } from '../../constants';
import { useGalleryContext, useUIContext } from '../../context';
import { useFetchBucketList, useRequestPermission } from '../../hooks';
import DesignSystem from '../../styles';
const GalleryScreen: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const { favorite, resetGalleryState, updateData, data } = useGalleryContext();
    const { resetUIState, isPress, isLongPress } = useUIContext();
    const { hasPermission, requestPermission } = useRequestPermission();
    const [permissionSaved, setPermissionSaved] = useState<boolean>(false);
    const { bucket, fetchBucketList } = useFetchBucketList();
    const { Colors } = DesignSystem();
    const isFocused = useIsFocused();
    // Reconcile when memoized fetchAlbum is changed.
    // TODO: Pictures taken is not updated in UI - having it as dependency cause heavy rendering fix this?
    // 1. Fetch from firebase on load
    // 2. while screen is active, manipulation of data should be on a shallow copy - not on the original
    // 3. when unmounting - update the firebase by pushing changes to firebase.

    useLayoutEffect(() => {
        setIsLoading(true);
        const checkPermission = async () => {
            const permissionSaved = await AsyncStorage.getItem(libPermission);
            const permission = JSON.parse(permissionSaved ?? 'false');
            setPermissionSaved(permission);
            setIsLoading(false);
            if (!permission) {
                await requestPermission();
                await AsyncStorage.setItem(libPermission, JSON.stringify(hasPermission));
            }
        };
        const fetchData = async () => {
            await fetchBucketList();
            updateData(bucket);
        };
        checkPermission();
        fetchData();
    }, [isFocused, hasPermission]);

    useEffect(() => {
        return () => {
            // Reset states when leaving the screen
            // Reset drawer state, press state, long press state, all selected pictures
            resetUIState();
            resetGalleryState();
            // console.log('Unmounted Gallery Screen');
        };
    }, [isFocused]);

    useEffect(() => {
        // Open modal on item click.
        if (isPress && !isLongPress) {
            setToggleModal(true);
        }
        // Close modal on unmount.
        if (!isFocused) setToggleModal(false);
    }, [isPress, isFocused]);

    const handleToggleModal = () => {
        setToggleModal(false);
    };

    const handleTextChange = (input: string) => {
        let santize = input.toLowerCase().trim();
        setInput(input);
        if (input) {
            const filter = bucket.filter(
                (item) => item.captions?.some((cap) => cap.toLowerCase().trim().includes(santize))
            );
            updateData(filter);
        } else {
            updateData(bucket);
        }
    };

    const handleSearchPress = () => {
        if (input) {
            const filter = bucket.filter(
                (item) =>
                    item.captions?.some((cap) =>
                        cap.toLowerCase().trim().includes(input.toLowerCase().trim())
                    )
            );
            updateData(filter);
        } else {
            updateData(bucket);
        }
        setInput('');
    };

    return (
        <Background>
            <View className="flex-1 w-full bottom-[4.5%] justify-center items-center">
                {isLoading ? (
                    <ActivityIndicator size={'large'} color={Colors.rei} animating />
                ) : !permissionSaved ? (
                    <PermissionView />
                ) : (
                    <Canvas isFocused={isFocused} title={'Media'}>
                        <View className="w-full h-full overflow-hidden">
                            <View className="border-[0.3px] border-neutral w-full h-[25%] justify-center items-center">
                                <Text className="w-full p-2 text-neutral font-handjet-light">
                                    Favorites
                                </Text>

                                <FlatList
                                    data={favorite}
                                    keyExtractor={(item: any) => item.id}
                                    renderItem={({ item, index }) => (
                                        <Picture
                                            key={index}
                                            id={item.id}
                                            uri={
                                                item.uri ??
                                                'https://cdn-icons-png.flaticon.com/512/2333/2333464.png'
                                            }
                                            coordinates={{
                                                latitude: item.coordinates?.latitude,
                                                longitude: item.coordinates?.longitude,
                                            }}
                                        />
                                    )}
                                    removeClippedSubviews={true}
                                    showsVerticalScrollIndicator={false}
                                    initialNumToRender={10}
                                    maxToRenderPerBatch={10}
                                    windowSize={5}
                                    numColumns={4}
                                />
                            </View>
                            <View className="justify-center items-center py-1">
                                <Text className="w-full p-2 text-neutral font-handjet-light">
                                    Gallery
                                </Text>
                                <View className="h-[45px] w-[75%] flex-row justify-between overflow-hidden border-[0.3px] border-neutral rounded-xl m-1">
                                    <TextInput
                                        value={input}
                                        onChangeText={handleTextChange}
                                        maxLength={30}
                                        multiline={true}
                                        className="text-neutral
                                        font-handjet-regular m-1 w-[85%]"
                                        placeholder="Search..."
                                        placeholderTextColor={Colors.neutral400}
                                    />
                                    <IconButton
                                        onPress={handleSearchPress}
                                        className="top-2 h-full font-handjet-regular"
                                        IconSet="EvilIcons"
                                        iconName="search"
                                        iconSize={30}
                                        iconColor={Colors.neutral}
                                    />
                                </View>
                                {bucket && bucket.length > 0 ? (
                                    <FlatList
                                        className="h-[50%] w-[95%]"
                                        // If screen unmounts data assign fetched bucket else assign data due to async state update.
                                        data={data && data.length === 0 ? bucket : data}
                                        keyExtractor={(item: any) => item.id}
                                        renderItem={({ item, index }) => (
                                            <Picture
                                                key={index}
                                                id={item.id}
                                                uri={item.uri}
                                                coordinates={{
                                                    latitude: item.coordinates?.latitude,
                                                    longitude: item.coordinates?.longitude,
                                                }}
                                            />
                                        )}
                                        removeClippedSubviews={true}
                                        showsVerticalScrollIndicator={false}
                                        initialNumToRender={10}
                                        maxToRenderPerBatch={20}
                                        numColumns={4}
                                        windowSize={5}
                                    />
                                ) : (
                                    <View className="w-[50%] h-[50%] justify-center items-center">
                                        <ActivityIndicator
                                            size={'large'}
                                            color={Colors.rei}
                                            animating
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    </Canvas>
                )}
                {toggleModal ? (
                    <CustomModal
                        toggleModal={handleToggleModal}
                        onPress={handleToggleModal}
                        intensity={8}
                        className="absolute w-full h-[91%] justify-center items-center"
                    >
                        <Text className="text-neutral font-handjet-light text-xl">Picture</Text>
                    </CustomModal>
                ) : null}
            </View>
        </Background>
    );
};
export default GalleryScreen;
