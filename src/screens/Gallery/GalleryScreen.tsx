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
import { useGalleryContext, useShared, useUIContext } from '../../context';
import {
    BucketListType,
    MergedImageType,
    useFetchBucketList,
    useRequestPermission,
} from '../../hooks';
import DesignSystem from '../../styles';
const GalleryScreen: React.FC = () => {
    const [permissionSaved, setPermissionSaved] = useState<boolean>(false);
    const [shallowCopyData, setShallowCopyData] = useState<BucketListType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const { favorite, resetGalleryState, data, updateData } = useGalleryContext();
    const { resetUIState, isPress, isLongPress } = useUIContext();
    const { updateSharedData } = useShared();
    const { hasPermission, requestPermission } = useRequestPermission();
    const { fetchBucketList } = useFetchBucketList();
    const isFocused = useIsFocused();
    const { Colors } = DesignSystem();

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
        /**
         * @description Fetch bucket list from firebase
         * Explicitly made it return a promise of BucketListType[] to gain more control over the data.
         */
        const fetchData = async () => {
            const bucketList = await fetchBucketList();
            const reverse = bucketList.reverse();
            updateData(reverse);
            setShallowCopyData(reverse);
        };
        checkPermission();
        fetchData();
    }, [isFocused, hasPermission]);

    useEffect(() => {
        // Observing changes in the data - GalleryContext is the source of truth
        if (data?.length) {
            setShallowCopyData(data);
            updateSharedData(data);
        }
        return () => {
            // Reset states when leaving the screen
            // Reset drawer state, press state, long press state, all selected pictures
            resetUIState();
            resetGalleryState();
            // console.log('Unmounted Gallery Screen');
        };
    }, [isFocused, data]);

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

    /**
     * @description Handle text change for search query
     * @param input search query
     */
    const handleTextChange = (input: string) => {
        let santize = input.toLowerCase().trim();
        setInput(input);
        if (input && data) {
            const filter = data.filter(
                (item: BucketListType) =>
                    item.captions?.some((cap) => cap.toLowerCase().trim().includes(santize))
            );
            setShallowCopyData(filter);
        } else if (data) {
            setShallowCopyData(data);
        }
    };

    /**
     * @description Press search for captions in the bucket list
     * Need explicit type as BucketListType to access captions array
     * If input and data exists, filter the data based on the input and update the data with filtered result.
     * else update the data with the copy of the original data.
     * The gotcha: FlatList is having a single source of truth, so the data should be updated in the same source. Otherwise, it will not update when we search and delete.
     */
    const handleSearchPress = () => {
        if (input && data) {
            console.log('has input');
            const filter = data.filter(
                (item: BucketListType) =>
                    item.captions?.some((cap) =>
                        cap.toLowerCase().trim().includes(input.toLowerCase().trim())
                    )
            );
            setShallowCopyData(filter);
        } else if (data) {
            console.log('pressed');
            setShallowCopyData(data);
        }
        setInput('');
    };

    /**
     * @description Conditional render for FlatList
     * If data exist, check if it's empty, if not empty, render the * FlatList, else render empty data.
     * Otherwise, render loading indicator.
     *
     * @returns FlatList of pictures
     */
    const conditionalRender = () => {
        return data ? (
            data.length > 0 ? (
                <FlatList
                    className="h-[50%] w-[95%]"
                    // If screen unmounts data assign fetched bucket else assign data due to async state update.
                    data={shallowCopyData}
                    keyExtractor={(item: BucketListType) => item.id}
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
                <View className="justify-center items-center  w-full h-[50%]">
                    <Text className="text-[28px] text-neutral font-handjet-light tracking-widest">
                        Data is empty
                    </Text>
                </View>
            )
        ) : (
            <View className="w-[50%] h-[50%] justify-center items-center">
                <ActivityIndicator size={'large'} color={Colors.tertiary} animating />
            </View>
        );
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
                                    keyExtractor={(item: MergedImageType) => item.id}
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
                                {conditionalRender()}
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
