import { createContext, useContext, useState } from 'react';

interface IUIContext {
    handlePress: () => void;
    handleLongPress: () => void;
    handleLongPressMenu: (toggle: boolean) => void;
    isLongPressMenu: boolean;
    isPress: boolean;
    isLongPress: boolean;
    resetState: () => void;
    setIsLongPress: (toggle: boolean) => void;
}

type UIContextProviderProp = {
    children: React.ReactNode;
};

const UIContext = createContext<IUIContext>({
    handlePress: () => {},
    handleLongPress: () => {},
    handleLongPressMenu: (toggle) => {},
    isLongPressMenu: false,
    isPress: false,
    isLongPress: false,
    resetState: () => { },
    setIsLongPress: () => {}
});

export const useUIContext = () => useContext(UIContext);

const UIContextProvider: React.FC<UIContextProviderProp> = ({ children }) => {
    const [isPress, setIsPress] = useState<boolean>(false);
    const [isLongPress, setIsLongPress] = useState<boolean>(false);
    const [isLongPressMenu, setIsLongPressMenu] = useState<boolean>(false);

    const handlePress = () => {
        setIsPress((prev) => !prev);
    };
    const handleLongPress = () => {
        setIsLongPress((prev) => !prev);
        setIsLongPressMenu((prev) => !prev);
    };
    const resetState = () => {
        setIsLongPressMenu(false);
        setIsPress(false);
        setIsLongPress(false);
    };

    return (
        <UIContext.Provider
            value={{
                handlePress,
                handleLongPress,
                handleLongPressMenu: setIsLongPressMenu,
                setIsLongPress,
                isLongPressMenu,
                isPress,
                isLongPress,
                resetState,
            }}
        >
            {children}
        </UIContext.Provider>
    );
};
export default UIContextProvider;
