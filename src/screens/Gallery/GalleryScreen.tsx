import { useIsFocused } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Background, Canvas, Picture } from '../../components';
import BottomDrawer from '../../components/BottomDrawer';
import { useGalleryContext } from '../../context';

const GalleryScreen: React.FC = () => {
    const isFocused = useIsFocused();
    const { showBottomDrawer, resetState, data } = useGalleryContext();

    useLayoutEffect(() => {
        return () => {
            // Reset states when leaving the screen
            // Reset drawer state, press state, long press state, all selected pictures
            resetState();
            // console.log('Unmounted Gallery Screen');
        };
    }, [isFocused]);

    return (
        <Background>
            <View className="flex-1 w-full bottom-[4.5%] justify-center items-center">
                <Canvas isFocused={isFocused} title={'Media'}>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <Picture id={item.id.toString()} firstName={item.first_name} />
                        )}
                        removeClippedSubviews={true}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={10}
                        maxToRenderPerBatch={20}
                        numColumns={4}
                        windowSize={5}
                    />
                </Canvas>
            </View>
            <View className="absolute bottom-[50px] h-[10%] w-[100%]">
                {/* {showBottomDrawer && <BottomDrawer />} */}
                <BottomDrawer />
            </View>
        </Background>
    );
};
export default GalleryScreen;
