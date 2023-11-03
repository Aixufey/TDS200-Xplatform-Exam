import { useIsFocused } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { FlatList, View } from 'react-native';
import DATA from '../../../MOCK_DATA.json';
import { Background, Canvas, MemoizedItem } from '../../components';
import BottomDrawer from '../../components/BottomDrawer';
import { useGalleryContext } from '../../context';

const GalleryScreen: React.FC = () => {
    const isFocused = useIsFocused();
    const { showBottomDrawer, resetState } = useGalleryContext();

    useLayoutEffect(() => {
        return () => {
            // Reset states when leaving the screen
            // Reset drawer state, press state, long press state
            resetState();
        };
    }, [isFocused]);
    return (
        <Background>
            <View className="flex-1 w-full bottom-[4.5%] justify-center items-center">
                <Canvas isFocused={isFocused} title={'Media'}>
                    <FlatList
                        data={DATA}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={(item) => <MemoizedItem firstName={item.item.first_name} />}
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
                {showBottomDrawer && <BottomDrawer />}
                {/* <BottomDrawer /> */}
            </View>
        </Background>
    );
};
export default GalleryScreen;
