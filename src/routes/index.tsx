import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { Welcome } from '../screens';
import RootRoutes from './Root.routes';

const WelcomeRoutes: React.FC = () => {
    const { Navigator, Screen } = createStackNavigator();
    const noHeader = {
        headerShown: false,
    };
    return (
        <NavigationContainer independent={true}>
            <Navigator screenOptions={{ animationEnabled: false }}>
                <Screen name="Welcome" component={Welcome} options={noHeader} />
                <Screen name="RootRoutes" component={RootRoutes} options={noHeader} />
            </Navigator>
        </NavigationContainer>
    );
};
export default WelcomeRoutes;

const Test: React.FC = () => {
    return (
        <View className="bg-[#000] flex-1">
            <Text className="text-white font-handjet-regular text-[150px]">Test</Text>
        </View>
    );
};
