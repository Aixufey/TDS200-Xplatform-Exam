import { useIsFocused } from '@react-navigation/native';
import React, { useLayoutEffect as useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Background, Canvas, CustomModal, Picture } from '../../components';
import { useGalleryContext } from '../../context';

const GalleryScreen: React.FC = () => {
    const [toggleModal, setToggleModal] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const { resetState, data, favorite, isPress, isLongPress } = useGalleryContext();

    useEffect(() => {
        return () => {
            // Reset states when leaving the screen
            // Reset drawer state, press state, long press state, all selected pictures
            resetState();
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

    return (
        <Background>
            <View className="flex-1 w-full bottom-[4.5%] justify-center items-center">
                <Canvas isFocused={isFocused} title={'Media'}>
                    <View className="border-[0.3px] border-white w-full h-[25%] justify-center items-center">
                        <FlatList
                            numColumns={4}
                            data={favorite}
                            keyExtractor={(item: any) => item.id.toString()}
                            renderItem={({ item, index }) => (
                                <Picture
                                    uri="https://cdn-icons-png.flaticon.com/512/2333/2333464.png"
                                    key={index}
                                    id={item.id.toString()}
                                    firstName={item.firstName}
                                />
                            )}
                        />
                    </View>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <Picture
                                uri={item.uri}
                                key={index}
                                id={item.id.toString()}
                                firstName={item.first_name}
                            />
                        )}
                        removeClippedSubviews={true}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={10}
                        maxToRenderPerBatch={20}
                        numColumns={4}
                        windowSize={5}
                    />
                </Canvas>
                {toggleModal ? (
                    <CustomModal
                        onPress={handleToggleModal}
                        intensity={8}
                        className="absolute w-full h-[91%] justify-center items-center"
                    >
                        <Text className="justify-center items-center text-[#FbAA]">Children</Text>
                    </CustomModal>
                ) : null}
            </View>
        </Background>
    );
};
export default GalleryScreen;
