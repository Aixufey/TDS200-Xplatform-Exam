import { signOut } from 'firebase/auth';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from 'react-native';
import { Background, Button } from '../../components';
import { useAuth, useShared } from '../../context';
import { BucketListType } from '../../hooks';
import DesignSystem from '../../styles';
const HomeScreen: React.FC = () => {
    const { data } = useShared();
    const { Colors } = DesignSystem();
    const { currentUser, firebase_auth } = useAuth();
    
    const handleSignOutPress = async () => {
        signOut(firebase_auth);
    };
    return (
        <Background>
            <View className="flex-1 w-full h-full justify-evenly items-center">
                <View className="m-2 basis-12 justify-center">
                    {currentUser && (
                        <Text className="text-neutral font-handjet-light text-xl">
                            Welcome{currentUser.isAnonymous ? ', ' : ' back, '}
                            <Text className="text-secondary font-handjet-light">
                                {currentUser.isAnonymous
                                    ? 'Anonymous one'
                                    : currentUser.displayName}
                            </Text>
                        </Text>
                    )}
                </View>
                <View className="p-2 border-[0.5px] border-tertiary bg-dark500 w-[95%] h-[10%] flex-row">
                    <View className="border-[1px] border-white rounded-[100px] w-[65px] h-[65px] overflow-hidden">
                        <Image
                            className="flex-1 w-full h-full"
                            source={{
                                uri: data?.at(0)?.uri,
                            }}
                        />
                    </View>
                    <View className='px-2 w-full justify-center items-start '>
                        <Text className='font-handjet-light text-neutral tracking-widest text-[28px]'>Latest feed</Text>
                    </View>
                </View>
                <View className="w-[95%] bg-dark500 border-[0.5px] border-tertiary justify-between items-center flex-auto">
                    {data && data.length > 0 ? (
                        <View className="w-full h-[500px] justify-center items-center">
                            <FlatList
                                className="w-full"
                                data={data as BucketListType[]}
                                keyExtractor={(item) => item.id}
                                numColumns={1}
                                maxToRenderPerBatch={10}
                                initialNumToRender={10}
                                removeClippedSubviews={true}
                                showsVerticalScrollIndicator={true}
                                ItemSeparatorComponent={() => <View className="h-[10px]" />}
                                snapToInterval={510}
                                renderItem={({ item }) => (
                                    <View className="h-[500px]">
                                        <Image
                                            className="flex-1"
                                            key={item.id}
                                            source={{ uri: item.uri }}
                                        />
                                    </View>
                                )}
                            />
                        </View>
                    ) : (
                        <View className="w-full h-[500px] justify-center items-center">
                            <ActivityIndicator size={'large'} color={Colors.tertiary} animating />
                        </View>
                    )}
                    <View className="flex-1 justify-center items-center w-full">
                        <Button
                            className="bottom-[40px] rounded-xl border-[1px] border-tertiary w-[120px] h-[50px] justify-center items-center"
                            onPress={handleSignOutPress}
                            text="Sign Out"
                        />
                    </View>
                </View>
            </View>
        </Background>
    );
};
export default HomeScreen;
