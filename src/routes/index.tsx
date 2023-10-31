import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../screens';
import RootRoutes from './Root.Routes';

const WelcomeRoutes: React.FC = () => {
    const { Navigator, Screen } = createStackNavigator();
    const noHeader = {
        headerShown: false,
    };
    return (
        <NavigationContainer independent={true}>
            <Navigator screenOptions={{ animationEnabled: false }}>
                <Screen name="WelcomeScreen" component={WelcomeScreen} options={noHeader} />
                <Screen name="RootRoutes" component={RootRoutes} options={noHeader} />
            </Navigator>
        </NavigationContainer>
    );
};
export default WelcomeRoutes;
