import { AntDesign, Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
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
    Text,
    TextInput,
    TextInputChangeEventData,
    TouchableOpacity,
    View,
} from 'react-native';
import { commentsDoc, reactionsDoc } from '../../constants';
import { useGalleryContext, useUIContext } from '../../context';
import { useFireBase } from '../../context/FireBaseContext.tsx';
import DesignSystem from '../../styles';
import { IconButton } from '../Button';
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
    const [fetch, setFetch] = useState<boolean>(false);
    const [flip, setFlip] = useState<boolean>(false);
    const [showComment, setShowComment] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [comments, setComments] = useState<DocumentData[]>([]);
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
            console.log(comments);
            setComments(comments);
        };
        //fetchReactions();
        //fetchComments();
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
        setInput(e.nativeEvent.text);
    };

    const handleShowCommentPress = () => {
        setShowComment((prev) => !prev);
    };

    const handleSubmitPress = () => {
        if (currentPicture?.id === undefined) {
            return alert('Picture does not exist!');
        }
        updateFirestoreComments(currentPicture?.id, 'User333222111');
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
                userId: 'User123',
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
    };

    return (
        toggleModal && (
            <BlurView intensity={intensity || 5} tint="dark" className={className}>
                {showComment ? (
                    <View className="flex absolute top-15 w-[75%] h-[460px] border-[1px] border-[#00ffff] bg-dark300 rounded-2xl overflow-hidden justify-center items-center">
                        <View className="w-full h-full justify-start items-center absolute">
                            <Text className="text-neutral font-handjet-light text-xl">
                                Comments
                            </Text>
                        </View>
                        <View className="basis-[10%] px-2 w-full h-full flex-row justify-end items-center">
                            <TouchableOpacity className="absolute w-[20%] h-full flex-row justify-center items-center">
                                <IconButton
                                    onPress={() => setShowComment(false)}
                                    className="w-[45px] h-[45px] justify-center items-center"
                                    IconSet="AntDesign"
                                    iconName="closecircle"
                                    iconSize={24}
                                    iconColor={Colors.tertiary}
                                />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            className="basis-3/4 w-full h-64"
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
                                        <TouchableOpacity
                                            onPress={() => handleDeleteComment(item.id)}
                                        >
                                            <FontAwesome
                                                name="trash-o"
                                                size={20}
                                                color={Colors.neutral200}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                ) : (
                    <View className="absolute top-15 w-[75%] h-[460px] border-[1px] border-[#00ffff] bg-dark300 rounded-2xl overflow-hidden justify-center items-center">
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
                                        <TouchableOpacity onPress={handleLike}>
                                            <AntDesign
                                                name="like2"
                                                size={24}
                                                color={Colors.tertiary}
                                            />
                                        </TouchableOpacity>
                                        <Text className="px-1 text-neutral font-handjet-light">
                                            {feedback.likes}
                                        </Text>
                                    </View>
                                    <View className="px-2 flex-row">
                                        <TouchableOpacity onPress={handleDislike}>
                                            <AntDesign
                                                name="dislike2"
                                                size={24}
                                                color={Colors.tertiary}
                                            />
                                        </TouchableOpacity>
                                        <Text className="px-1 text-neutral font-handjet-light">
                                            {feedback.dislikes}
                                        </Text>
                                    </View>
                                    <View className="px-2 flex-row">
                                        <TouchableOpacity onPress={handleShowCommentPress}>
                                            <FontAwesome5
                                                name="comment-alt"
                                                size={24}
                                                color={Colors.tertiary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View className="w-[250px] h-[60px] overflow-hidden flex-row">
                                    <TextInput
                                        onChange={handleCommentChange}
                                        multiline={true}
                                        numberOfLines={10}
                                        placeholder="Write a comment..."
                                        placeholderTextColor={Colors.neutral700}
                                        className="px-1 text-neutral font-handjet-light w-[220px]"
                                    />
                                    {input.length >= 1 && (
                                        <View className="w-100 justify-center items-center">
                                            <TouchableOpacity onPress={handleSubmitPress}>
                                                <Feather
                                                    name="send"
                                                    size={24}
                                                    color={Colors.tertiary}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
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
                            />
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
