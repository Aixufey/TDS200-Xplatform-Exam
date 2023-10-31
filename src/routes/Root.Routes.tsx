import { Entypo } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CameraScreen, HomeScreen } from '../screens';
const RootRoutes: React.FC = () => {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            sceneContainerStyle={{ backgroundColor: '#151515' }}
            screenOptions={{
                tabBarActiveTintColor: '#FFEA00',
                tabBarInactiveTintColor: '#0FFA',
                tabBarStyle: [
                    {
                        backgroundColor: '#000',
                        borderTopColor: '#00FFFF',
                        borderTopWidth: 2,
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
                            color={focused ? 'rgba(255,233,0,1)' : 'rgba(0,255,255,0.3)'}
                        />
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
                            color={focused ? 'rgba(255,233,0,1)' : 'rgba(0,255,255,0.3)'}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
export default RootRoutes;
