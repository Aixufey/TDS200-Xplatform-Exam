import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';

const CameraView: React.FC = () => {
    const [image, setImage] = useState<string | undefined>(undefined);

    
    useEffect(() => {
        pickImage();
    }, [image]);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View className="flex-1 w-full bottom-0 justify-center items-center">
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            <TouchableOpacity onPress={pickImage}>
                <Text className="text-white text-3xl">Click</Text>
            </TouchableOpacity>
        </View>
    );
};
export default CameraView;
