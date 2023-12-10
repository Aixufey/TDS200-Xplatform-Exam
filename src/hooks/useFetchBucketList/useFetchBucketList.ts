import { getDownloadURL, getMetadata, getStorage, listAll, ref } from 'firebase/storage';
import { useState } from 'react';
import { bucketURl } from '../../constants';
import { BucketListType } from '../useLaunchCamera';

/**
 * Pictures does not contain an unique ID, we use the timestamp as a natural id.
 * @returns Pictures from firebase
 */
const useFetchBucketList = <T extends BucketListType>() => {
    const [bucket, setBucket] = useState<T[]>([]);
    const storage = getStorage();
    const listRef = ref(storage, bucketURl);

    /**
     * @description Slighly modified the purpose of a hook, but this can fetch a promise and set the data synchronously
     * @returns a promise of the bucket list
     */
    const fetchBucketList = async (): Promise<T[]> =>
        listAll(listRef)
            .then(async (res) => {
                const promises = res.items.map(async (itemRef) => {
                    try {
                        const url = await getDownloadURL(itemRef);
                        const meta = await getMetadata(itemRef);
                        let captions = meta.customMetadata?.captions;
                        let coordinates = meta.customMetadata?.coordinates;
                        let id = meta.name;
                        let createdTime;
                        if (meta.customMetadata?.exif) {
                            const exif = JSON.parse(meta.customMetadata?.exif);
                            if (exif.DateTimeOriginal) {
                                createdTime = new Date(
                                    exif.DateTime.replace(/(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')
                                ).toLocaleDateString();
                            }
                        }
                        if (captions) {
                            captions = JSON.parse(captions);
                        }
                        if (coordinates) {
                            coordinates = JSON.parse(coordinates);
                        }
                        if (id) {
                            id = meta.name?.replace('.jpg', '').replace(/\s/g, '');
                        }
                        // Transforming the data back from bucket list
                        // Slapping on some meta
                        return {
                            id: id,
                            uri: url,
                            coordinates: coordinates,
                            captions: captions,
                            exif: createdTime,
                        } as T;
                    } catch (e) {
                        return console.error(e);
                    }
                });
                const result = await Promise.all(promises);
                const filteredResult = result.filter((item) => item !== null) as T[];
                setBucket(filteredResult);
                return filteredResult;
            })
            .catch((err) => {
                console.error(err);
                return [];
            });
    return {
        bucket,
        fetchBucketList,
    };
};
export default useFetchBucketList;
