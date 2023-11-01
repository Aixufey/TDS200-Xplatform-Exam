import React, { memo } from 'react';
import { Text, View } from 'react-native';
import Picture from './Picture';

type MemoizedType = {
    firstName: string;
};
const MemoizedItem: React.FC<MemoizedType> = memo(({ firstName }) => {
    return (
        <View className="justify-center items-center p-[6px]">
            <View className="max-w-[75px] max-h-[75px] overflow-hidden">
                <Picture firstName={firstName} />
                <Text className="bottom-0 absolute">{firstName}</Text>
            </View>
        </View>
    );
});
export default MemoizedItem;
