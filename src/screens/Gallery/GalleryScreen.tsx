import { useIsFocused } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Background, Canvas, Picture } from '../../components';
import BottomDrawer from '../../components/BottomDrawer';
import { useGalleryContext } from '../../context';

const GalleryScreen: React.FC = () => {
    const isFocused = useIsFocused();
    const { showBottomDrawer, resetState, data, favorite } = useGalleryContext();

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
                    <View className="border-[0.3px] border-white w-full h-[25%] justify-center items-center">
                        <FlatList
                            numColumns={4}
                            data={favorite}
                            keyExtractor={(item: any) => item.id.toString()}
                            renderItem={({ item, index }) => (
                                <Picture
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
            </View>
            {showBottomDrawer &&
                <BottomDrawer className="absolute bottom-[8%] bg-neutral rounded-xl h-[10%] w-full z-100 flex-row justify-evenly items-center " />
            }
        </Background>
        
    );
};
export default GalleryScreen;
