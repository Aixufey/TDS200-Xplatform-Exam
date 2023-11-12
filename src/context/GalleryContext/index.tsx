import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-media-library';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { favoriteItems } from '../../constants';
import { MergedImageType } from '../../hooks/useLaunchCamera/useLaunchCamera';
import { useUIContext } from '../UIContext';
type GalleryContextProviderProp = {
    children: React.ReactNode;
};
/**
 * data can be either album or images directly taken with camera.
 * Asset[] type is from Expo's Media Library that we get from album with assets
 * @example const media = await MediaLibrary.getAssetsAsync()
 */
interface IGalleryContext {
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
    handlePictures: (picture: MergedImageType) => void;
    pictures: MergedImageType[];
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
    handlePictures: () => {},
    pictures: [],
});

export const useGalleryContext = () => useContext(GalleryContext);

const GalleryContextProvider: React.FC<GalleryContextProviderProp> = ({ children }) => {
    const [data, setData] = useState<Asset[] | MergedImageType[] | null>(null);
    const [currentPicture, setCurrentPicture] = useState<MergedImageType | null>(null);
    const [favorite, setFavorite] = useState<MergedImageType[]>([]);
    const [selectedPictures, setSelectedPictures] = useState<MergedImageType[]>([]);
    const [pictures, setPictures] = useState<MergedImageType[]>([]);
    const { isLongPress, isPress, setIsLongPress, setIsLongPressMenu } = useUIContext();

    // Load favorites
    useEffect(() => {
        handleGetStoredFavorite();
    }, []);

    const updateData = (data: Asset[] | MergedImageType[]) => {
        setData(data);
    };

    // Debugging
    useEffect(() => {
        // console.log(`Pressed `, isPress)
        // console.log(`LongPress `, isLongPress)
        // console.log(data.length);
        // console.log('Current selected length ', selectedPictures.length);
        // console.log('current Picture? ', currentPicture);
        // console.log('Favorites', favorite);
        // console.log('favorite length', favorite.length);
        // console.log(`pictures `, pictures.length);
        // console.log('Current selected length', selectedPictures.length);
        // console.log('Current selected', selectedPictures);
    }, [pictures, currentPicture, isLongPress, isPress, selectedPictures]);

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

        setSelectedPictures((prevSelected) => {
            if (prevSelected.some((dupes) => dupes.id === picture.id)) {
                return prevSelected;
            } else {
                return [picture, ...prevSelected];
            }
        });
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

    const handlePictures = (picture: MergedImageType) => {
        setPictures((prev) => {
            return [picture, ...prev];
        });
    };

    const handleStoreFavorite = async (input: MergedImageType[]) => {
        await AsyncStorage.setItem(favoriteItems, JSON.stringify(input));
    };
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

    const resetGalleryState = () => {
        setSelectedPictures([]);
        setCurrentPicture(null);
    };

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
            handlePictures,
            pictures,
        };
    }, [data, currentPicture, favorite, selectedPictures]);

    return <GalleryContext.Provider value={contextValue}>{children}</GalleryContext.Provider>;
};
export default GalleryContextProvider;
