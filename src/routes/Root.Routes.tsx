import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens';

const RootRoutes: React.FC = () => {
    const Tab = createBottomTabNavigator();
    const noHeader = {
        headerShown: false,
    };

    return (
        <Tab.Navigator
            initialRouteName="Home"
            sceneContainerStyle={{ backgroundColor: '#AAFFAA' }}
            screenOptions={{
                tabBarActiveTintColor: '#FFAA',
                tabBarInactiveTintColor: '#AA00AA',
                tabBarStyle: [
                    {
                        backgroundColor: '#000',
                        borderTopColor: '#0FF',
                        borderTopWidth: 2,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        position: 'absolute',
                        padding: 10,
                    },
                ],
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={noHeader} />
        </Tab.Navigator>
    );
};
export default RootRoutes;
