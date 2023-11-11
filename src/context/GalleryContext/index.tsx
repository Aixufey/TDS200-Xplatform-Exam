import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-media-library';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { favoriteItems } from '../../constants';
import { useUIContext } from '../UIContext';
import * as MediaLibrary from 'expo-media-library';
interface IGalleryContext {
    data: any;
    updateData: (data: any) => void;
    selectedPictures: any[];
    setSelectedPictures: (pictures: any) => void;
    currentPicture: any;
    setCurrentPicture: (picture: any) => void;
    toggleFavorite: (picture: any) => void;
    favorite: any[];
    resetGalleryState: () => void;
    handleDeletePicture: (picture: any) => void;
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
});

export const useGalleryContext = () => useContext(GalleryContext);

const GalleryContextProvider = ({ children }: { children: ReactNode }) => {
    const { isLongPress, isPress, setIsLongPress, setIsLongPressMenu } = useUIContext();
    const [data, setData] = useState<Asset[]>();
    const [currentPicture, setCurrentPicture] = useState<any>(null);
    const [favorite, setFavorite] = useState<any[]>([]);
    const [selectedPictures, setSelectedPictures] = useState<any[]>([]);

    // Load favorites
    useEffect(() => {
        handleGetStoredFavorite();
    }, []);

    const updateData = (data: any) => {
        setData(data);
    };

    // Debugging
    useEffect(() => {
        // console.log(`Pressed `, isPress)
        // console.log(`LongPress `, isLongPress)
        // console.log(data.length);
        // console.log('Current selected length ', selectedPictures.length);
        // console.log('current Picture? ', currentPicture)
        // console.log('Favorites', favorite);
        // console.log('favorite length', favorite.length);
        console.log('Current selected length', selectedPictures.length);
        // console.log('Current selected', selectedPictures);
    }, [currentPicture, isLongPress, isPress, selectedPictures]);

    const updateCurrentPicture = (picture: any) => {
        // console.log(picture);
        if (!picture) return;

        setCurrentPicture(picture);

        // Track multiple selections
        // Due the nature of React asynchronous state batching, we can check if last snapshot contains the selected
        setSelectedPictures((prevSelected: any) => {
            const isSelected = prevSelected.find((item: any) => item.id == picture.id);
            if (isSelected) {
                return prevSelected.filter((item: any) => item.id != picture.id);
            } else {
                return [picture, ...prevSelected];
            }
        });
    };

    const toggleFavorite = (input: any) => {
        if (!input || input.length == 0) return;
        // Assert to array for single picture
        const inputArray = input instanceof Array ? input : [input];

        setFavorite((prevFavs) => {
            // Accumulate favorite
            const newFavs = inputArray.reduce((newFavs: any, picture: any) => {
                // Check current picture if exists in accumulator
                const isFavorite = newFavs.some((fav: any) => fav.id == picture.id);

                if (isFavorite) {
                    // Remove current picture from accumulator
                    return newFavs.filter((fav: any) => fav.id != picture.id);
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

    const handleDeletePicture = async (input: any[]) => {
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

    const handleStoreFavorite = async (input: any) => {
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
        };
    }, [data, currentPicture, favorite, selectedPictures]);

    return <GalleryContext.Provider value={contextValue}>{children}</GalleryContext.Provider>;
};
export default GalleryContextProvider;
