import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GalleryContextProvider, UIContextProvider, useAuth } from '../context';
import { FireBaseContextProvider } from '../context/FireBaseContext';
import SharedContextProvider from '../context/SharedContext';
import { WelcomeScreen } from '../screens';
import RootRoutes from './Root.Routes';

/**
 * @description Separating stacks for security and smoother user experience.
 * @returns the stack navigator while listening to the observing context auth state.
 */
const WelcomeRoutes: React.FC = () => {
    const { currentUser } = useAuth();

    const AppStack = createStackNavigator();
    const AuthStack = createStackNavigator();

    const noHeader = {
        headerShown: false,
    };

    const AuthStackScreen = () => (
        <AuthStack.Navigator screenOptions={{ animationEnabled: false }}>
            <AuthStack.Screen name="WelcomeScreen" component={WelcomeScreen} options={noHeader} />
        </AuthStack.Navigator>
    );

    const AppStackScreen = () => (
        <FireBaseContextProvider>
            <UIContextProvider>
                <GalleryContextProvider>
                    <AppStack.Navigator screenOptions={{ animationEnabled: false }}>
                        <AppStack.Screen
                            name="RootRoutes"
                            component={RootRoutes}
                            options={noHeader}
                        />
                    </AppStack.Navigator>
                </GalleryContextProvider>
            </UIContextProvider>
        </FireBaseContextProvider>
    );

    return (
        <SharedContextProvider>
            <NavigationContainer independent={true}>
                {currentUser ? <AppStackScreen /> : <AuthStackScreen />}
            </NavigationContainer>
        </SharedContextProvider>
    );
};
export default WelcomeRoutes;
