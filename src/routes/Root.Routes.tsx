import { Entypo } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { CameraScreen, GalleryScreen, HomeScreen } from '../screens';
import DesignSystem from '../styles';
const RootRoutes: React.FC = () => {
    const Tab = createBottomTabNavigator();
    const { Colors } = DesignSystem();
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
                    tabBarIcon: ({ focused }) => (
                        <Entypo
                            name="home"
                            size={24}
                            color={focused ? Colors.secondary : 'rgba(0,255,255,0.5)'}
                            style={{ bottom: focused ? 5 : 0 }}
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
                            Home
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Entypo
                            name="image"
                            size={24}
                            color={focused ? Colors.secondary : 'rgba(0,255,255,0.3)'}
                            style={{ bottom: focused ? 5 : 0 }}
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
                            Gallery
                        </Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Camera"
                component={CameraScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Entypo
                            name="camera"
                            size={24}
                            color={focused ? Colors.secondary : 'rgba(0,255,255,0.3)'}
                            style={{ bottom: focused ? 5 : 0 }}
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
                            Camera
                        </Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
export default RootRoutes;
