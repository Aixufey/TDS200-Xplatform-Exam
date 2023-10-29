// Handjet
import HandjetBlack from "../../assets/fonts/Handjet-Black.ttf";
import HandjetBold from "../../assets/fonts/Handjet-Bold.ttf";
import HandjetExtraBold from "../../assets/fonts/Handjet-ExtraBold.ttf";
import HandjetExtraLight from "../../assets/fonts/Handjet-ExtraLight.ttf";
import HandjetLight from "../../assets/fonts/Handjet-Light.ttf";
import HandjetMedium from "../../assets/fonts/Handjet-Medium.ttf";
import HandjetRegular from "../../assets/fonts/Handjet-Regular.ttf";
import HandjetSemiBold from "../../assets/fonts/Handjet-SemiBold.ttf";
import HandjetThin from "../../assets/fonts/Handjet-Thin.ttf";
// // Ubuntu
import UbuntuBold from "../../assets/fonts/Ubuntu-Bold.ttf";
import UbuntuBoldItalic from "../../assets/fonts/Ubuntu-BoldItalic.ttf";
import UbuntuItalic from "../../assets/fonts/Ubuntu-Italic.ttf";
import UbuntuLight from "../../assets/fonts/Ubuntu-Light.ttf";
import UbuntuLightItalic from "../../assets/fonts/Ubuntu-LightItalic.ttf";
import UbuntuMedium from "../../assets/fonts/Ubuntu-Medium.ttf";
import UbuntuMediumItalic from "../../assets/fonts/Ubuntu-MediumItalic.ttf";
import UbuntuRegular from "../../assets/fonts/Ubuntu-Regular.ttf";

export {
    HandjetBlack,
    HandjetExtraBold,
    HandjetExtraLight,
    HandjetLight,
    HandjetMedium,
    HandjetRegular,
    HandjetSemiBold,
    HandjetThin,
    UbuntuBold,
    UbuntuBoldItalic,
    UbuntuItalic,
    UbuntuLight,
    UbuntuLightItalic,
    UbuntuMedium,
    UbuntuMediumItalic,
    UbuntuRegular,
};

const FontAssetsUtil = () => {
    // Legacy method 👴
    // return require('../../assets/fonts/Handjet-Black.ttf');
    return {
        HandjetBlack,
        HandjetBold,
        HandjetExtraBold,
        HandjetExtraLight,
        HandjetLight,
        HandjetMedium,
        HandjetRegular,
        HandjetSemiBold,
        HandjetThin,
        UbuntuBold,
        UbuntuBoldItalic,
        UbuntuItalic,
        UbuntuLight,
        UbuntuLightItalic,
        UbuntuMedium,
        UbuntuMediumItalic,
        UbuntuRegular,
    };
};
export default FontAssetsUtil;

// Class export with static members for fun 🤷‍♂️
export class FontAssets {
    static HandjetBlack = HandjetBlack;
}
