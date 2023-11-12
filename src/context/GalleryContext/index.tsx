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
        // console.log('current Picture? ', currentPicture?.id);
        // console.log('Favorites', favorite);
        // console.log('favorite length', favorite.length);
        // console.log(`pictures `, pictures.length);
        // console.log('Current selected length', selectedPictures.length);
        // console.log('Current selected', selectedPictures);
    }, [pictures, currentPicture, isLongPress, isPress, selectedPictures]);

    const updateCurrentPicture = (picture: MergedImageType | null) => {
        // console.log(picture);
        if (!picture) return;

        setCurrentPicture(picture);

        // Track multiple selections
        // Due the nature of React asynchronous state batching, we can check if last snapshot contains the selected
        setSelectedPictures((prevSelected) => {
            const isSelected = prevSelected.find((item) => item.id == picture.id);
            if (isSelected) {
                return prevSelected.filter((item) => item.id != picture.id);
            } else {
                return [picture, ...prevSelected];
            }
        });
    };

    const toggleFavorite = (input: MergedImageType[]) => {
        if (!input || input.length == 0) return;
        // Assert to array for single picture
        const inputArray = input instanceof Array ? input : [input];

        setFavorite((prevFavs) => {
            // Accumulate favorite
            const newFavs = inputArray.reduce((newFavs, picture) => {
                // Check current picture if exists in accumulator
                const isFavorite = newFavs.some((fav) => fav.id == picture.id);

                if (isFavorite) {
                    // Remove current picture from accumulator
                    return newFavs.filter((fav) => fav.id != picture.id);
                } else {
                    // Add current to acc.
                    return [picture, ...newFavs];
                }
                // Init acc with previous favorite state
            }, prevFavs);
            handleStoreFavorite(newFavs);
            return newFavs;
        });

        // Clean selections
        cleanSelections();
    };

    const handleDeletePicture = async (input: MergedImageType[]) => {
        // Early return if input is empty or not an array
        if (!Array.isArray(input) || input.length === 0) return;

        // Create a Set for quick lookup
        const inputIds = new Set(input.map((item) => item.id));

        // Filter data and favorites, checking for undefined
        setData((prevData) => (prevData ? prevData.filter((item) => !inputIds.has(item.id)) : []));
        setFavorite((prevFavs) => {
            const filteredFavs = prevFavs ? prevFavs.filter((fav) => !inputIds.has(fav.id)) : [];
            handleStoreFavorite(filteredFavs);
            return filteredFavs;
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
