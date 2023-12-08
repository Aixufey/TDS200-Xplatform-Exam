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

    const fetchBucketList = async () => {
        listAll(listRef)
            .then(async (res) => {
                const promises = res.items.map(async (itemRef) => {
                    try {
                        const url = await getDownloadURL(itemRef);
                        const meta = await getMetadata(itemRef);
                        let captions = meta.customMetadata?.captions;
                        let coordinates = meta.customMetadata?.coordinates;
                        let id = meta.name;
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
                        } as T;
                    } catch (e) {
                        return console.error(e);
                    }
                });
                const result = await Promise.all(promises);
                const filteredResult = result.filter((item) => item !== undefined) as T[];
                setBucket(filteredResult);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    return {
        bucket,
        fetchBucketList,
    };
};
export default useFetchBucketList;
