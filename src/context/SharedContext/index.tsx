import { Asset } from 'expo-media-library';
import { createContext, useContext, useEffect, useState } from 'react';
import { BucketListType, MergedImageType } from '../../hooks';
import { useFetchBucketList } from '../../hooks/useFetchBucketList';
import { IGalleryContext } from '../GalleryContext';

type ProviderProps = {
    children: React.ReactNode;
};
type SharedContextType = {
    updateSharedData: (data: Asset[] | BucketListType[]) => void;
};
type SharedContextTypeMerged = SharedContextType & Pick<IGalleryContext, 'data'>;
const SharedContext = createContext<SharedContextTypeMerged>({
    data: [],
    updateSharedData: () => {},
});

export const useShared = () => {
    const context = useContext(SharedContext);
    if (!context) {
        throw new Error(`${useShared} must be used inside Provider`);
    }
    return context;
};

/**
 *
 * @description SharedContextProvider shares data for guest and user
 * @returns observable data and updateSharedData function
 */
const SharedContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [data, setData] = useState<Asset[] | MergedImageType[] | null>(null);
    const { fetchBucketList } = useFetchBucketList();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const bucketList = await fetchBucketList();
                setData(bucketList.reverse());
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const updateSharedData = (data: Asset[] | BucketListType[]) => {
        setData(data);
    };
    const ContextValue = {
        data,
        updateSharedData,
    };
    return <SharedContext.Provider value={ContextValue}>{children}</SharedContext.Provider>;
};
export default SharedContextProvider;
