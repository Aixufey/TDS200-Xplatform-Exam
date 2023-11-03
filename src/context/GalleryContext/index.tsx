import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
interface IGalleryContext {
    currentPicture: any;
    setCurrentPicture: (picture: any) => void;
    addToFavorites: (picture: any) => void;
    removeFromFavorites: (picture: any) => void;
    favorites: any[];
    handlePress: () => void;
    isPress: boolean;
    handleLongPress: () => void;
    isLongPress: boolean;
    setShowBottomDrawer: (show: boolean) => void;
    showBottomDrawer: boolean;
    resetState: () => void;
}
const GalleryContext = createContext<IGalleryContext>({
    currentPicture: null,
    setCurrentPicture: (picture) => {},
    addToFavorites: (picture) => {},
    removeFromFavorites: (picture) => {},
    favorites: [],
    handlePress: () => {},
    isPress: false,
    handleLongPress: () => {},
    isLongPress: false,
    setShowBottomDrawer: (show) => {},
    showBottomDrawer: false,
    resetState: () => {},
});

export const useGalleryContext = () => useContext(GalleryContext);

const GalleryContextProvider = ({ children }: { children: ReactNode }) => {
    const [currentPicture, setCurrentPicture] = useState<any>(null);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [isPress, setIsPress] = useState<boolean>(false);
    const [isLongPress, setIsLongPress] = useState<boolean>(false);
    const [showBottomDrawer, setShowBottomDrawer] = useState<boolean>(false);

    useEffect(() => {
        return console.log(favorites);
    }, [favorites]);

    const updateCurrentPicture = (picture: any) => {
        setCurrentPicture(picture);
    };

    const addToFavorites = (picture: any) => {
        console.log(favorites);

        setFavorites([picture, ...favorites]);
    };
    const removeFromFavorites = (picture: any) => {
        console.log(favorites);
        setFavorites(favorites.filter((item) => item.id !== picture.id));
    };

    const handlePress = () => {
        setIsPress((prevState) => !prevState);
    };
    const handleLongPress = () => {
        setIsLongPress((prevState) => !prevState);
        setShowBottomDrawer((prevState) => !prevState);
    };
    const resetState = () => {
        setShowBottomDrawer(false);
        setIsPress(false);
        setIsLongPress(false);
    };

    return (
        <GalleryContext.Provider
            value={{
                currentPicture: currentPicture,
                setCurrentPicture: updateCurrentPicture,
                handlePress: handlePress,
                isPress: isPress,
                handleLongPress: handleLongPress,
                isLongPress: isLongPress,
                favorites: favorites,
                addToFavorites: addToFavorites,
                removeFromFavorites: removeFromFavorites,
                showBottomDrawer: showBottomDrawer,
                setShowBottomDrawer: setShowBottomDrawer,
                resetState: resetState,
            }}
        >
            {children}
        </GalleryContext.Provider>
    );
};
export default GalleryContextProvider;
