import { ImageResult, SaveFormat, manipulateAsync } from 'expo-image-manipulator';

const useManipulateImage = async (uri: string): Promise<ImageResult> => {
    return await manipulateAsync(uri, [{ resize: { height: 500, width: 500 } }], {
        compress: 0.2,
        format: SaveFormat.JPEG,
    });
};
export default useManipulateImage;
