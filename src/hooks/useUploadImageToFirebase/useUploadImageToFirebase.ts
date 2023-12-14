import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { bucketURl } from '../../constants';

/**
 * Helper: Expecting a binary large object and upload to fire storage
 * @param blob
 */
export interface ICoordinates {
    latitude: number;
    longitude: number;
}
const useUploadImageToFirebase = async (
    name: string,
    blob: Blob,
    exif: Partial<MediaTrackSettings> | any,
    coordinates: ICoordinates,
    captions: string[],
    timeStamp: Date,
) => {
    try {
        const storage = await getStorage();
        const picturesRef = await ref(storage, `${bucketURl}${name}.jpg`);
        const coordinatesMeta = {
            latitude: coordinates?.latitude.toString() || '',
            longitude: coordinates?.longitude.toString() || '',
        };
        uploadBytesResumable(picturesRef, blob, {
            contentType: 'image/jpeg',
            customMetadata: {
                exif: JSON.stringify(exif ?? ''),
                coordinates: JSON.stringify(coordinatesMeta),
                captions: JSON.stringify(captions),
                timeStamp: timeStamp.toISOString(),
            },
        })
            .then(async (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Uploaded Blob -- ${progress}% done!`);

                const downloadURL = await getDownloadURL(picturesRef);
                console.log(`Download URL: ${downloadURL}`);
            })
            .catch((err) => {
                console.error('Error', err);
            });
    } catch (err) {
        console.log(err);
    }
};
export default useUploadImageToFirebase;
