import * as Font from 'expo-font';
import {
    HandjetBlack,
    HandjetLight,
    HandjetRegular,
    UbuntuItalic,
    UbuntuLight,
    UbuntuRegular,
} from '../../utils';

const useCustomFonts = () => {
    const [fontsLoaded] = Font.useFonts({
        'Handjet-Black': HandjetBlack,
        'Handjet-Light': HandjetLight,
        'Handjet-Regular': HandjetRegular,
        'Ubuntu-Italic': UbuntuItalic,
        'Ubuntu-Light': UbuntuLight,
        'Ubuntu-Regular': UbuntuRegular,
    });
    return fontsLoaded;
};
export default useCustomFonts;
