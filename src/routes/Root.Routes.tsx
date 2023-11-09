import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useGalleryContext, useUIContext } from '../context';
import { useCustomNavigation } from '../hooks';
import { CameraScreen, GalleryScreen, HomeScreen } from '../screens';
import DesignSystem from '../styles';
const RootRoutes: React.FC = () => {
    const Tab = createBottomTabNavigator();
    const { toggleFavorite, selectedPictures, handleDeletePicture } = useGalleryContext();
    const { isLongPressMenu } = useUIContext();
    const { Colors } = DesignSystem();
    const { goBack } = useCustomNavigation();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            sceneContainerStyle={{ backgroundColor: 'rgba(0,0,0,1)' }}
            screenOptions={{
                tabBarActiveTintColor: Colors.secondary,
                tabBarInactiveTintColor: 'rgba(0,255,255,0.5)',
                tabBarStyle: [
                    {
                        height: 70,
                        backgroundColor: '#000',
                        borderTopColor: Colors.dark,
                        borderTopWidth: 2.5,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        position: 'absolute',
                        padding: 5,
                    },
                ],
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        !isLongPressMenu ? (
                            <Entypo
                                name="home"
                                size={24}
                                color={focused ? Colors.secondary : 'rgba(0,255,255,0.5)'}
                                style={{ bottom: focused ? 5 : 0 }}
                            />
                        ) : (
                            <MaterialIcons
                                onPress={() => goBack()}
                                name="arrow-back-ios"
                                size={24}
                                color={Colors.neutral}
                            />
                        ),
                    tabBarLabel: ({ focused }) => (
                        <Text
                            className="font-handjet-regular tracking-widest"
                            style={{
                                color: focused ? Colors.secondary : 'rgba(0,255,255,0.3)',
                                bottom: focused ? 5 : 0,
                            }}
                        >
                            {!isLongPressMenu && 'Home'}
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        !isLongPressMenu ? (
                            <Entypo
                                name="image"
                                size={24}
                                color={focused ? Colors.secondary : 'rgba(0,255,255,0.3)'}
                                style={{ bottom: focused ? 5 : 0 }}
                            />
                        ) : (
                            <MaterialIcons
                                onPress={() => toggleFavorite(selectedPictures)}
                                name="favorite-border"
                                size={24}
                                color={Colors.neutral}
                            />
                        ),
                    tabBarLabel: ({ focused }) => (
                        <Text
                            className="font-handjet-regular tracking-widest"
                            style={{
                                color: focused ? Colors.secondary : 'rgba(0,255,255,0.3)',
                                bottom: focused ? 5 : 0,
                            }}
                        >
                            {!isLongPressMenu && 'Gallery'}
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Camera"
                component={CameraScreen}
                listeners={({ navigation, route }) => ({
                    tabPress: (e) => {
                        isLongPressMenu ? e.preventDefault() : navigation.navigate('Camera');
                    },
                })}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        !isLongPressMenu ? (
                            <Entypo
                                name="camera"
                                size={24}
                                color={focused ? Colors.secondary : 'rgba(0,255,255,0.3)'}
                                style={{ bottom: focused ? 5 : 0 }}
                            />
                        ) : (
                            <AntDesign
                                onPress={() =>
                                    selectedPictures && selectedPictures.length > 0
                                        ? handleDeletePicture(selectedPictures)
                                        : null
                                }
                                name="delete"
                                size={24}
                                color={Colors.neutral}
                            />
                        ),
                    tabBarLabel: ({ focused, color }) => (
                        <Text
                            className="font-handjet-regular tracking-widest"
                            style={{
                                color: focused ? Colors.secondary : 'rgba(0,255,255,0.3)',
                                bottom: focused ? 5 : 0,
                            }}
                        >
                            {!isLongPressMenu && 'Camera'}
                        </Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
export default RootRoutes;
