import React from 'react';
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ISafeViewProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
    className?: string | undefined;
}
const SafeView: React.FC<ISafeViewProps> = ({ style, children, onLayout, className }) => {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={[style && style, { paddingTop: insets.top }]}
            onLayout={onLayout && onLayout}
            className={className && className}
        >
            {children}
        </View>
    )
};
export default SafeView;