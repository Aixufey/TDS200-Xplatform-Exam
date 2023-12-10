import { Asset } from 'expo-media-library';
import { createContext, useContext, useEffect, useState } from 'react';
import { BucketListType } from '../../hooks';
import { useFetchBucketList } from '../../hooks/useFetchBucketList';
import { IGalleryContext } from '../GalleryContext';

type ProviderProps = {
    children: React.ReactNode;
};
type SharedContextType = Pick<IGalleryContext, 'data' | 'updateData'>;

const SharedContext = createContext<SharedContextType>({
    data: [],
    updateData: () => {},
});

export const useShared = () => {
    const context = useContext(SharedContext);
    if (!context) {
        throw new Error(`${useShared} must be used inside Provider`);
    }
    return context;
};

const SharedContextProvider: React.FC<ProviderProps> = ({ children }) => {
    const [data, setData] = useState<BucketListType[] | null>(null);
    const { fetchBucketList } = useFetchBucketList();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const bucketList = await fetchBucketList();
                // console.log('SharedContextProvider bucketList', bucketList?.length);
                setData(bucketList);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const updateData = (data: Asset[] | BucketListType[]) => {
        setData(data);
    };
    const ContextValue = {
        data,
        updateData,
    };
    return <SharedContext.Provider value={ContextValue}>{children}</SharedContext.Provider>;
};
export default SharedContextProvider;
