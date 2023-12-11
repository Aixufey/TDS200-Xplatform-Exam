import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-media-library';
import { deleteObject, ref } from 'firebase/storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { bucketURl, favoriteItems } from '../../constants';
import { MergedImageType } from '../../hooks';
import { useFireBase } from '../FireBaseContext';
import { useUIContext } from '../UIContext';
type GalleryContextProviderProp = {
    children: React.ReactNode;
};
/**
 * data can be either album or images directly taken with camera.
 * Asset[] type is from Expo's Media Library that we get from album with assets
 * @example const media = await MediaLibrary.getAssetsAsync()
 */
export interface IGalleryContext {
    data: Asset[] | MergedImageType[] | null;
    updateData: (data: Asset[] | MergedImageType[]) => void;
    selectedPictures: MergedImageType[];
    setSelectedPictures: (pictures: MergedImageType[]) => void;
    currentPicture: MergedImageType | null;
    setCurrentPicture: (picture: MergedImageType | null) => void;
    toggleFavorite: (picture: MergedImageType[]) => void;
    favorite: MergedImageType[];
    resetGalleryState: () => void;
    handleDeletePicture: (picture: MergedImageType[]) => void;
    handleTakenPictures: (picture: MergedImageType) => void;
    pictures: MergedImageType[];
    deletePictures: (picture: MergedImageType[]) => void;
}

const GalleryContext = createContext<IGalleryContext>({
    data: [],
    updateData: () => {},
    selectedPictures: [],
    setSelectedPictures: () => {},
    currentPicture: null,
    setCurrentPicture: () => {},
    toggleFavorite: () => {},
    favorite: [],
    resetGalleryState: () => {},
    handleDeletePicture: () => {},
    handleTakenPictures: () => {},
    pictures: [],
    deletePictures: () => {},
});

export const useGalleryContext = () => useContext(GalleryContext);

const GalleryContextProvider: React.FC<GalleryContextProviderProp> = ({ children }) => {
    const [data, setData] = useState<Asset[] | MergedImageType[] | null>(null);
    const [currentPicture, setCurrentPicture] = useState<MergedImageType | null>(null);
    const [selectedPictures, setSelectedPictures] = useState<MergedImageType[]>([]);
    const [favorite, setFavorite] = useState<MergedImageType[]>([]);
    const [takenPictures, setTakenPictures] = useState<MergedImageType[]>([]);
    const { isLongPress, isPress, setIsLongPress, setIsLongPressMenu } = useUIContext();
    const { storageRef } = useFireBase();

    // Load favorites
    useEffect(() => {
        handleGetStoredFavorite();
    }, []);

    useEffect(() => {
        if (isLongPress) {
            if (currentPicture === null) return;
            setSelectedPictures((prevSelected) => {
                if (prevSelected.some((dupes) => dupes.id === currentPicture?.id)) {
                    return prevSelected;
                } else {
                    return [currentPicture, ...prevSelected];
                }
            });
        }
    }, [currentPicture]);

    // Debugging
    useEffect(() => {
        // console.log(`Pressed `, isPress)
        // console.log(`LongPress `, isLongPress)
        console.log("data length ", data?.length);
        // console.log('Current selected length ', selectedPictures.length);
        // console.log('current Picture? ', currentPicture);
        // console.log('Favorites', favorite);
        // console.log('favorite length', favorite.length);
        // console.log(`pictures `, pictures.length);
        // console.log('Current selected length', selectedPictures.length);
        // console.log('Current selected', selectedPictures);
    }, [takenPictures, data, currentPicture, isLongPress, isPress, selectedPictures]);

    /**
     *
     * @param data is expected of type Asset[] or MergedImageType[]
     * @example
     * > If setting assets from phone MediaLibrary then data will be Asset.
     * > Else the type collection may be from camera and firebase.
     */
    const updateData = (data: Asset[] | MergedImageType[]) => {
        setData(data);
    };

    /**
     *
     * @param picture object of three combined types. The most important keys are **id**, **uri**, and **exif?**
     * > ```ts
     * > type MergedImageType = BroImageType & ProImageType & Partial<ImagePickerAsset>
     * > ```
     * @returns current selected picture
     */
    const updateCurrentPicture = (picture: MergedImageType | null) => {
        // console.log(picture);
        if (!picture) return;

        setCurrentPicture(picture);
    };

    /**
     * @param input contains the selected pictures and using hash table to delete if key exist else put it back to table.
     * @returns filtered favorites
     */
    const toggleFavorite = (input: MergedImageType[]) => {
        if (!input || input.length == 0) return;

        setFavorite((prevFavs) => {
            // Hash table has O(1) for lookup
            const oldFavorites = new Map(prevFavs.map((fav) => [fav.id, fav]));

            input.forEach((item) => {
                if (oldFavorites.has(item.id)) {
                    oldFavorites.delete(item.id);
                } else {
                    oldFavorites.set(item.id, item);
                }
            });

            // Convert the map back to an array with values
            const newFavs = [...oldFavorites.values()];
            handleStoreFavorite(newFavs);
            return newFavs;
        });

        // Clean selections
        cleanSelections();
    };

    /**
     * @description Refactored helper func to delete pictures
     * @param input selected pictures to be deleted from firebase storage
     */
    const deletePictures = async (input: MergedImageType[]) => {
        await deleteFirebasePictures(input);
        await handleDeletePicture(input);
    };

    /**
     * @description Delete selected pictures from firebase storage
     * @param input selected pictures to be deleted from firebase storage
     */
    const deleteFirebasePictures = async (input: MergedImageType[]) => {
        if (!Array.isArray(input) || input.length === 0) return;
        await Promise.all(
            input.map(async (picture) => {
                let path = bucketURl.concat(picture.id).concat('.jpg');
                const pictureRef = ref(storageRef, path);
                console.log('pictureRef', pictureRef);
                try {
                    await deleteObject(pictureRef);
                } catch (e) {
                    console.error(`Failed to delete picture with id ${picture.id}`, e);
                }
            })
        );
    };

    /**
     *
     * @param input contains the selected pictures and using hash table to delete if key exist else put it back to table.
     * > Updating setData if data exist else return an empty array.
     * @returns filtered pictures
     */
    const handleDeletePicture = async (input: MergedImageType[]) => {
        // Early return if input is empty or not an array
        if (!Array.isArray(input) || input.length === 0) return;

        // Set has also O(1) for lookup
        const inputIds = new Set(input.map((item) => item.id));

        // Filter data and favorites
        setData((prevData) => (prevData ? prevData.filter((item) => !inputIds.has(item.id)) : []));

        setFavorite((prevFavs) => {
            // Preparing a new Map for quick deletion all input ids
            const favsMap = new Map(prevFavs.map((fav) => [fav.id, fav]));

            inputIds.forEach((id) => favsMap.delete(id));

            const newFavs = [...favsMap.values()];
            handleStoreFavorite(newFavs);
            return newFavs;
        });

        // Clean selections
        setSelectedPictures([]);
        setCurrentPicture(null);
    };

    /**
     * Used to set the taken pictures
     * @param picture is the current taken picture being added to a collection of taken pictures of this session.
     * > The session is indicating the lifecycle of this GalleryContext, so long it's active the taken pictures is cached.
     */
    const handleTakenPictures = (picture: MergedImageType) => {
        setTakenPictures((prev) => {
            return [picture, ...prev];
        });
    };

    /**
     * Refactored helper func to set favorite
     * @param input
     */
    const handleStoreFavorite = async (input: MergedImageType[]) => {
        await AsyncStorage.setItem(favoriteItems, JSON.stringify(input));
    };

    /**
     * Refactored helper func to get stored favorite
     */
    const handleGetStoredFavorite = async () => {
        try {
            const result = await AsyncStorage.getItem(favoriteItems);
            if (result) {
                const parsed = JSON.parse(result);
                setFavorite(parsed);
            }
        } catch (e) {
            console.log(e);
        }
    };

    /**
     * Reset the gallery state
     */
    const resetGalleryState = () => {
        setSelectedPictures([]);
        setCurrentPicture(null);
    };

    /**
     * Clean selections Gallery & UI!
     */
    const cleanSelections = () => {
        setSelectedPictures([]);
        setCurrentPicture(null);
        setIsLongPress(false);
        setIsLongPressMenu(false);
    };

    const contextValue = useMemo(() => {
        return {
            data,
            updateData,
            selectedPictures,
            setSelectedPictures,
            currentPicture,
            setCurrentPicture: updateCurrentPicture,
            favorite,
            toggleFavorite,
            resetGalleryState,
            handleDeletePicture,
            handleTakenPictures,
            pictures: takenPictures,
            deletePictures,
        };
    }, [data, currentPicture, favorite, selectedPictures]);

    return <GalleryContext.Provider value={contextValue}>{children}</GalleryContext.Provider>;
};
export default GalleryContextProvider;
