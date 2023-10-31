import { NavigationProp, useNavigation } from '@react-navigation/native';

// All the Screen names in the app
type RootProps = {
    Welcome: undefined;
    RootRoutes: undefined;
    HomeScreen: undefined;
};
type _NavigationProp = NavigationProp<RootProps>;

/**
 * Exposing native's useNavigation hook with some underlying logic for abstraction.
 * @returns
 */
const useCustomNavigation = () => {
    const navigation = useNavigation<_NavigationProp>();

    const navigate = (path: keyof RootProps) => {
        navigation.navigate(path);
    };

    const goBack = () => {
        navigation.goBack();
    };

    return {
        navigate,
        goBack,
    };
};
export default useCustomNavigation;
