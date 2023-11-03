import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import DATA from '../../../MOCK_DATA.json';
import { favoriteItems } from '../../constants';

interface IGalleryContext {
    data: any;
    selectedPictures: any[];
    currentPicture: any;
    setCurrentPicture: (picture: any) => void;
    toggleFavorite: (picture: any) => void;
    favorite: any[];
    handlePress: () => void;
    isPress: boolean;
    handleLongPress: () => void;
    isLongPress: boolean;
    setShowBottomDrawer: (show: boolean) => void;
    showBottomDrawer: boolean;
    resetState: () => void;
    handleDeletePicture: (picture: any) => void;
}
const GalleryContext = createContext<IGalleryContext>({
    data: [],
    selectedPictures: [],
    currentPicture: null,
    setCurrentPicture: (picture) => {},
    toggleFavorite: (picture) => {},
    favorite: [],
    handlePress: () => {},
    isPress: false,
    handleLongPress: () => {},
    isLongPress: false,
    setShowBottomDrawer: (show) => {},
    showBottomDrawer: false,
    resetState: () => {},
    handleDeletePicture: (picture) => {},
});

export const useGalleryContext = () => useContext(GalleryContext);

const GalleryContextProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<any>([]);
    const [currentPicture, setCurrentPicture] = useState<any>(null);
    const [favorite, setFavorite] = useState<any[]>([]);
    const [isPress, setIsPress] = useState<boolean>(false);
    const [isLongPress, setIsLongPress] = useState<boolean>(false);
    const [showBottomDrawer, setShowBottomDrawer] = useState<boolean>(false);
    const [selectedPictures, setSelectedPictures] = useState<any[]>([]);

    // Load source data
    useEffect(() => {
        setData(DATA);
        return () => {
            console.log('Unmounted context');
        };
    }, [DATA]);

    useEffect(() => {
        handleGetStoredFavorite();
    }, []);

    // Debugging
    useEffect(() => {
        // console.log(data.length);
        // console.log('Current selected length ', selectedPictures.length);
        // console.log('current Picture? ', currentPicture)
        // console.log('Favorites', favorite);
        // console.log('favorite length', favorite.length);
        // console.log('Current selected length', selectedPictures.length);
        // console.log('Current selected', selectedPictures);
    }, [data, currentPicture, favorite, selectedPictures]);

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

    const handleDeletePicture = (input: any) => {
        console.log('selected ', input);
        if (!input || input.length == 0) return;
        console.log('here');
        // Assert to array for single picture
        const inputArray = input instanceof Array ? input : [input];

        // Concurrently delete from data for each item given input array
        // exclude item if it exists.
        setData((prevData: any) =>
            prevData.filter((item: any) => !inputArray.some((input: any) => input.id == item.id))
        );
        console.log(data.length);

        // Concurrently clean from favorites
        setFavorite((prevFavs: any) => {
            const filtered = prevFavs.filter(
                (fav: any) => !inputArray.some((input: any) => input.id == fav.id)
            );
            handleStoreFavorite(filtered);
            return filtered;
        });
        console.log(favorite.length);

        // Clean selections
        cleanSelections();
    };

    const handlePress = () => {
        setIsPress((prevState) => !prevState);
    };

    const handleLongPress = () => {
        setIsLongPress((prevState) => !prevState);
        setShowBottomDrawer((prevState) => !prevState);
    };

    const handleStoreFavorite = async (input: any) => {
        await AsyncStorage.setItem(favoriteItems, JSON.stringify(input));
        // console.log('store favorite', input);
        // if (!input || input.length == 0) return;
        // try {
        //     const result = await AsyncStorage.getItem(favoriteItems);
        //     if (result) {
        //         const parsed = JSON.parse(result);
        //         const filtered = parsed.filter(
        //             (item: any) => !input.some((input: any) => input.id == item.id)
        //         );
        //         await AsyncStorage.setItem(favoriteItems, JSON.stringify([...filtered]));
        //     }
        // } catch (e) {
        //     console.log(e);
        // }
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

    const resetState = () => {
        setShowBottomDrawer(false);
        setIsPress(false);
        setIsLongPress(false);
        setSelectedPictures([]);
        setCurrentPicture(null);
    };

    const cleanSelections = () => {
        setSelectedPictures([]);
        setCurrentPicture(null);
        setIsLongPress(false);
        setShowBottomDrawer(false);
    };

    return (
        <GalleryContext.Provider
            value={{
                data: data,
                selectedPictures: selectedPictures,
                currentPicture: currentPicture,
                setCurrentPicture: updateCurrentPicture,
                handlePress: handlePress,
                isPress: isPress,
                handleLongPress: handleLongPress,
                isLongPress: isLongPress,
                favorite: favorite,
                toggleFavorite: toggleFavorite,
                showBottomDrawer: showBottomDrawer,
                setShowBottomDrawer: setShowBottomDrawer,
                resetState: resetState,
                handleDeletePicture: handleDeletePicture,
            }}
        >
            {children}
        </GalleryContext.Provider>
    );
};
export default GalleryContextProvider;
