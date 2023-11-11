import { requestPermissionsAsync } from 'expo-media-library';
import { useCallback, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { TDS200 } from '../../constants';
import { useGalleryContext } from '../../context';

/**
 * This hook is requesting for media library permissions and fetching the album for this Exam TDS200
 * @returns an object with the permission status and the memoized fetchAlbum function.
 * The memoize function will reconcile when dependency changes.
 * @example const {hasPermission, fetchAlbum} = useFetchAlbum();
 */
const useFetchAlbum = () => {
    const [hasPermission, setPermission] = useState<boolean>(false);
    const { updateData } = useGalleryContext();

    const fetchAlbum = useCallback(async () => {
        try {
            const response = await requestPermissionsAsync();
            if (response.status !== 'granted') {
                return setPermission(false);
            }
            setPermission(response.granted);
            const albums = await MediaLibrary.getAlbumsAsync();
            if (!albums || albums.length === 0) {
                return console.log(`No albums found`);
            }
            const targetAlbum = albums.find((album) => album.title === TDS200);
            if (!targetAlbum) {
                return console.log(`Album ${TDS200} not found`);
            }
            const media = await MediaLibrary.getAssetsAsync({
                first: 100,
                mediaType: 'photo',
                sortBy: 'creationTime',
                album: targetAlbum,
            });
            updateData(media.assets);
        } catch (e) {
            console.error(e);
        }
    }, [updateData]);
    return {
        hasPermission,
        fetchAlbum,
    };
};
export default useFetchAlbum;
