import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { MergedImageType } from '../useLaunchCamera';
import { useManipulateImage } from '../useManipulateImage';

const useImagePicker = () => {
    const [image, setImage] = useState<MergedImageType>();

    const pickImage = async (): Promise<ImagePicker.ImagePickerResult> => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.2,
            exif: true,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            let uri = result.assets.at(0)?.uri;
            if (uri) {
                const compressed = await useManipulateImage(uri);
                const date = new Date();
                const timestamp = `${date.getFullYear()}${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date
                    .getHours()
                    .toString()
                    .padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date
                    .getSeconds()
                    .toString()
                    .padStart(2, '0')}`;

                const compressedImage = {
                    id: timestamp,
                    ...compressed,
                };
                setImage(compressedImage);
            }
        }
        return result;
    };
    return {
        image,
        pickImage,
    };
};
export default useImagePicker;
