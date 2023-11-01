import { useIsFocused } from '@react-navigation/native';
import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import DATA from '../../../MOCK_DATA.json';
import { Background, Canvas, MemoizedItem } from '../../components';

const GalleryScreen: React.FC = () => {
    const isFocused = useIsFocused();

    

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
        </Background>
    );
};
export default GalleryScreen;
