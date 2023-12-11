import { BlurView } from 'expo-blur';
import {
    DocumentData,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TextInput,
    TextInputChangeEventData,
    View,
} from 'react-native';
import { commentsDoc, reactionsDoc } from '../../constants';
import { useAuth, useGalleryContext, useUIContext } from '../../context';
import { useFireBase } from '../../context/FireBaseContext';
import DesignSystem from '../../styles';
import { IconButton } from '../Button';
import { MapItem } from '../MapItem';
import BackView from './BackView';
interface ICustomModal {
    intensity?: number;
    children?: React.ReactNode;
    className?: string;
    onPress?: () => void;
    toggleModal?: () => void;
}
const CustomModal: React.FC<ICustomModal> = ({
    onPress,
    className,
    intensity,
    toggleModal,
    children,
}) => {
    const { Colors } = DesignSystem();
    const { firebase_db } = useFireBase();
    const { currentPicture } = useGalleryContext();
    const { resetUIState } = useUIContext();
    const { currentUser } = useAuth();
    const [fetch, setFetch] = useState<boolean>(false);
    const [flip, setFlip] = useState<boolean>(false);
    const [showComment, setShowComment] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [comments, setComments] = useState<DocumentData[]>([]);
    const [showCaptions, setShowCaptions] = useState<boolean>(false);
    const [captions, setCaptions] = useState<DocumentData>([]);
    const [feedback, setFeedback] = useState({
        likes: 0,
        dislikes: 0,
    });

    useEffect(() => {
        const fetchReactions = async () => {
            if (currentPicture?.id === undefined) return;
            const pictureRef = doc(firebase_db, reactionsDoc, currentPicture.id);
            const reactionDoc = await getDoc(pictureRef);

            setFeedback((prev) => {
                // console.log('prev like', prev.likes);
                // console.log('prev dislike', prev.dislikes);
                return {
                    likes: (prev.likes = reactionDoc.data()?.likes),
                    dislikes: (prev.dislikes = reactionDoc.data()?.dislikes),
                };
            });
            setFetch(false);
        };
        const fetchComments = async () => {
            if (currentPicture?.id === undefined) return;
            const pictureRef = doc(firebase_db, commentsDoc, currentPicture.id);
            const commentsCollection = collection(pictureRef, commentsDoc);
            const commentDoc = await getDocs(commentsCollection);
            const comments = commentDoc.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            //console.log(comments);
            setComments(comments);
            setFetch(false);
        };
        const fetchCaptions = async () => {
            if (currentPicture?.id === undefined) return;
            const captionsRef = doc(firebase_db, 'captions', currentPicture.id);
            const captionDoc = await getDoc(captionsRef);

            if (captionDoc.exists()) {
                const data = captionDoc.data();
                //console.log(data);
                setCaptions(data);
            }
        };
        fetchReactions();
        fetchComments();
        fetchCaptions();
    }, [currentPicture, fetch]);

    const handleDeleteComment = async (commentId: string) => {
        //console.info(commentId);
        if (currentPicture?.id === undefined) {
            return alert('Comment does not exist!');
        }
        // Collection(comments) -> Document(pictureId) -> Sub collection (commentId)
        const commentRef = doc(firebase_db, commentsDoc, currentPicture.id, commentsDoc, commentId);
        await deleteDoc(commentRef);
        setComments((prev) => prev.filter((com) => com.id !== commentId));
    };

    const handleOnPressClose = () => {
        onPress && onPress();
        resetUIState();
        toggleModal && toggleModal();
    };

    const handleFlip = () => {
        setFlip((prev) => !prev);
    };

    const handleCommentChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        let sanitize = e.nativeEvent.text.toLowerCase().trim();
        setInput(sanitize);
    };

    const handleShowCommentPress = () => {
        setShowComment((prev) => !prev);
    };

    const handleSubmitPress = () => {
        if (currentPicture?.id === undefined) {
            return alert('Picture does not exist!');
        }
        if (currentUser === null) {
            return alert('User does not exist!');
        }
        updateFirestoreComments(currentPicture?.id, currentUser.displayName ?? 'Anonymous');
    };

    const handleLike = () => {
        updateFirestoreReaction(true);
    };

    const handleDislike = () => {
        updateFirestoreReaction(false);
    };

    const updateFirestoreReaction = async (state: boolean) => {
        if (currentPicture?.id === undefined) {
            return alert('Picture does not exist!');
        }
        if (currentUser === null) {
            return alert('User does not exist!');
        }
        const pictureRef = doc(firebase_db, reactionsDoc, currentPicture.id);

        const reactionDoc = await getDoc(pictureRef);
        setFeedback((prev) => {
            return {
                likes: (prev.likes = reactionDoc.data()?.likes),
                dislikes: (prev.dislikes = reactionDoc.data()?.dislikes),
            };
        });

        // user can either like or dislike
        let like = state ? 1 : -1;
        let dislike = state ? -1 : 1;

        // guard not below 0
        like = like < 0 ? 0 : like;
        dislike = dislike < 0 ? 0 : dislike;
        await setDoc(
            pictureRef,
            {
                likes: like,
                dislikes: dislike,
                pictureId: currentPicture.id,
                userId: currentUser.displayName,
            },
            { merge: true }
        );
        setFetch(true);
    };

    const updateFirestoreComments = async (pictureId: string, userId: string) => {
        //console.table(input);
        const pictureRef = doc(firebase_db, commentsDoc, pictureId);
        const commentCol = collection(pictureRef, commentsDoc);
        await addDoc(commentCol, {
            userId: userId,
            pictureId: pictureId,
            comment: input,
            timeStamp: new Date(),
        });
        setInput('');
        setFetch(true);
    };

    const RenderCaptionView: React.FC = () => {
        return (
            <View className="w-full h-full justify-start items-center absolute">
                <View className="w-full h-full justify-start items-center absolute">
                    <Text className="text-neutral font-handjet-light text-xl">Captions</Text>
                </View>
                <View className="basis-[10%] px-2 w-full h-full flex-row justify-end items-center">
                    <IconButton
                        onPress={() => {
                            setShowCaptions(false);
                            setShowComment(false);
                        }}
                        className="w-[45px] h-[45px] justify-center items-center"
                        IconSet="AntDesign"
                        iconName="closecircle"
                        iconSize={24}
                        iconColor={Colors.tertiary}
                    />
                </View>
                <View className="p-2 w-[75%] h-[75%] overflow-hidden">
                    <ScrollView className="w-full h-full border-b-[0.5px] border-tertiary">
                        {captions.captions &&
                            captions.captions.map((item: string, i: string) => (
                                <Text
                                    key={i}
                                    className="p-1 text-neutral font-handjet-regular tracking-widest"
                                >
                                    #{item}
                                </Text>
                            ))}
                    </ScrollView>
                </View>
            </View>
        );
    };

    return (
        toggleModal && (
            <BlurView intensity={intensity || 5} tint="dark" className={className}>
                {showComment ? (
                    <View className="flex absolute top-15 w-[75%] h-[460px] border-[1px] border-tertiary bg-dark300 rounded-2xl overflow-hidden justify-center items-center">
                        {!showCaptions ? (
                            <View>
                                <View className="w-full h-full justify-start items-center absolute">
                                    <Text className="text-neutral font-handjet-light text-xl">
                                        Comments
                                    </Text>
                                </View>
                                <View className="basis-[10%] px-2 w-full h-full flex-row justify-end items-center">
                                    <IconButton
                                        onPress={() => setShowComment(false)}
                                        className="w-[45px] h-[45px] justify-center items-center"
                                        IconSet="AntDesign"
                                        iconName="closecircle"
                                        iconSize={24}
                                        iconColor={Colors.tertiary}
                                    />
                                </View>
                                <FlatList
                                    className="basis-3/4 w-100 h-64"
                                    data={comments}
                                    keyExtractor={(item: DocumentData) => item.id}
                                    renderItem={({ item }) => (
                                        <View className="p-2">
                                            <View className="flex-row">
                                                <Text className="text-neutral font-handjet-light">
                                                    <Text className="text-secondary font-handjet-black tracking-widest">
                                                        {item.userId}
                                                    </Text>
                                                    : {item.comment}
                                                </Text>
                                            </View>
                                            <View className="justify-between items-center flex-row">
                                                <Text className="text-neutral font-handjet-light">
                                                    {item.timeStamp.toDate().toUTCString()}
                                                </Text>
                                                <IconButton
                                                    onPress={() => handleDeleteComment(item.id)}
                                                    IconSet="FontAwesome"
                                                    iconSize={20}
                                                    iconName="trash-o"
                                                    iconColor={Colors.neutral200}
                                                />
                                            </View>
                                        </View>
                                    )}
                                />
                            </View>
                        ) : (
                            <RenderCaptionView />
                        )}
                    </View>
                ) : (
                    <View className="absolute top-15 w-[75%] h-[460px] border-[1px] border-tertiary bg-dark300 rounded-2xl overflow-hidden justify-center items-center">
                        <View className="w-full h-full justify-start items-center absolute">
                            {children}
                        </View>
                        {currentPicture && (
                            <View className="overflow-hidden justify-center h-[360px]">
                                <View className="overflow-hidden w-[250px] h-[250px] rounded-md">
                                    <Image
                                        className="w-full h-full"
                                        source={{ uri: currentPicture?.uri }}
                                    />
                                </View>
                                <View className="w-[250px] h-[50px] p-1 items-center flex-row">
                                    <View className="px-2 flex-row">
                                        <IconButton
                                            onPress={handleLike}
                                            IconSet="AntDesign"
                                            iconName={feedback.likes ? 'like1' : 'like2'}
                                            iconSize={24}
                                            iconColor={Colors.tertiary}
                                        />
                                        <Text className="px-1 text-neutral font-handjet-light">
                                            {feedback.likes ?? 0}
                                        </Text>
                                    </View>
                                    <View className="px-2 flex-row">
                                        <IconButton
                                            onPress={handleDislike}
                                            IconSet="AntDesign"
                                            iconName={feedback.dislikes ? 'dislike1' : 'dislike2'}
                                            iconSize={24}
                                            iconColor={Colors.tertiary}
                                        />
                                        <Text className="px-1 text-neutral font-handjet-light">
                                            {feedback.dislikes ?? 0}
                                        </Text>
                                    </View>
                                    <View className="px-2 flex-row">
                                        <IconButton
                                            onPress={handleShowCommentPress}
                                            IconSet="FontAwesome5"
                                            iconName="comment-alt"
                                            iconSize={24}
                                            iconColor={Colors.tertiary}
                                        />
                                    </View>
                                    <View className="px-2 flex-row">
                                        <IconButton
                                            onPress={() => {
                                                setShowCaptions(true);
                                                setShowComment(true);
                                            }}
                                            IconSet="FontAwesome5"
                                            iconName="hashtag"
                                            iconSize={24}
                                            iconColor={Colors.tertiary}
                                        />
                                    </View>
                                </View>

                                <View className="w-[250px] h-[60px] overflow-hidden flex-row">
                                    <TextInput
                                        value={input}
                                        onChange={handleCommentChange}
                                        multiline={true}
                                        numberOfLines={10}
                                        placeholder="Write a comment..."
                                        placeholderTextColor={Colors.neutral700}
                                        className="px-1 text-neutral font-handjet-light w-[220px]"
                                    />
                                    <View className="w-100 justify-center items-center">
                                        <IconButton
                                            onPress={handleSubmitPress}
                                            IconSet="Feather"
                                            iconName="send"
                                            disabled={input ? false : true}
                                            className={`${input ? 'opacity-1' : 'opacity-0'}`}
                                            iconSize={24}
                                            iconColor={Colors.tertiary}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        {flip && currentPicture && (
                            <BackView
                                id={currentPicture.id}
                                uri={currentPicture.uri}
                                coordinates={{
                                    longitude: currentPicture.coordinates?.longitude,
                                    latitude: currentPicture.coordinates?.latitude,
                                }}
                            >
                                <MapItem
                                    className="w-[100%] h-[100%] rounded-xl"
                                    title="Pyongyang"
                                    description="Pyongyang, North Korea"
                                    coordinate={{
                                        latitude: Number(currentPicture.coordinates?.latitude),
                                        longitude: Number(currentPicture.coordinates?.longitude),
                                    }}
                                />
                            </BackView>
                        )}

                        <View className="absolute top-0 right-0 h-[15%] flex-row justify-end items-center">
                            <IconButton
                                onPress={handleFlip}
                                className="w-[45px] h-[45px] justify-center items-center"
                                IconSet="MaterialIcons"
                                iconName="flip"
                                iconSize={28}
                                iconColor={Colors.tertiary}
                            />
                            <IconButton
                                onPress={handleOnPressClose}
                                className="w-[45px] h-[45px] justify-center items-center"
                                IconSet="AntDesign"
                                iconName="closecircle"
                                iconSize={24}
                                iconColor={Colors.tertiary}
                            />
                        </View>
                    </View>
                )}
            </BlurView>
        )
    );
};
export default CustomModal;
