import { Asset, PagedInfo, getAlbumsAsync, getAssetsAsync } from 'expo-media-library';

const fetchAlbum = async (): Promise<PagedInfo<Asset>> => {
    const album = await getAlbumsAsync();
    if (album) {
        const media = await getAssetsAsync({
            mediaType: 'photo',
            sortBy: 'modificationTime',
        });
        return media;
    }
    return album;
};
export default fetchAlbum;
