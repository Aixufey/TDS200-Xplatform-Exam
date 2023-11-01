import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StatusBar, StyleProp, Text, View, ViewStyle, Animated } from 'react-native';
import { CustomModal } from '../../components';
import Background from '../../components/Background/Background';
import { useCustomNavigation } from '../../hooks';
import DesignSystem from '../../styles';

const WelcomeScreen: React.FC = () => {
    const { navigate } = useCustomNavigation();
    const { Colors } = DesignSystem();
    const stylePressed = (pressed: boolean, ...Styles: StyleProp<ViewStyle>[]) => {
        return [
            {
                opacity: pressed ? 0.7 : 1,
            },
            ...Styles,
        ];
    };
    return (
        <View className="bg-[#000] w-full h-full justify-center items-center">
            <StatusBar barStyle={'light-content'} />
            <Background>
                <View className="justify-center items-center">
                    <Text className="text-[66px] font-handjet-black">Enter the</Text>
                    <Text className="text-[66px] text-primary font-handjet-regular">void</Text>
                </View>
                <View>
                    <Pressable
                        onPress={() => navigate('RootRoutes')}
                        style={({ pressed }) => stylePressed(pressed, { padding: 5 })}
                    >
                        <LinearGradient
                            colors={[Colors.tertiary, Colors.primary, 'transparent']}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            className="w-[100px] h-[100px] rounded-tl-3xl rounded-br-3xl justify-center items-center flex-row"
                        >
                            <Entypo name="login" size={24} color="#000" />
                        </LinearGradient>
                    </Pressable>
                </View>
                {/* <CustomModal>
                    <Text className="text-neutral300">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere laudantium
                        autem suscipit sit! Harum autem repellat voluptatibus saepe, consequatur
                        laboriosam porro cum ipsa, facilis nulla commodi vel, officiis quo omnis!
                        Optio ea sapiente, expedita illum eum, fugit quaerat rem recusandae est
                        ducimus autem magni exercitationem, quisquam atque totam minima? Numquam
                        libero, dicta est quos iste quaerat id ipsa consectetur nam! Deleniti
                        distinctio rerum fugit earum ex at nemo aliquid a error ducimus deserunt
                        quam ratione neque et iusto, est dolor, nihil labore. Vitae labore officia
                        tenetur distinctio asperiores error. Molestias. Vitae exercitationem dolores
                        molestiae vel, consectetur explicabo architecto fuga beatae optio nihil
                        tempore dolorem quaerat quod, aspernatur delectus repellendus doloremque
                        ducimus numquam perferendis. Dolorum, placeat unde eaque rem ipsam facilis.
                        Suscipit, nostrum impedit dolor corrupti architecto quo nesciunt saepe
                        adipisci commodi optio laboriosam earum in ut reprehenderit culpa minima
                        atque facilis dolorum tempore eius? Iusto corporis pariatur impedit
                        perspiciatis temporibus? Libero error at mollitia odio ad ratione doloribus
                        dicta natus modi earum quas velit, aliquid repellendus nostrum dolor tempore
                        provident, quod deserunt atque sunt debitis hic fugiat ex similique? Odit.
                        Facilis natus atque dolor numquam laudantium quibusdam alias repudiandae
                        adipisci eaque, minus nulla ullam, voluptas error impedit fugit architecto
                        omnis nostrum sint. Deserunt dolor at molestias excepturi accusamus ratione
                        quis! Sequi obcaecati est qui facere hic similique eius. Illo molestiae
                        totam dicta minus doloremque explicabo est tenetur placeat repudiandae
                        omnis, distinctio dolor officiis. Accusamus laborum aspernatur, voluptatum
                        eos incidunt nisi! Velit, perspiciatis in aliquam officia asperiores ex
                        quibusdam praesentium excepturi? Accusantium, vero hic! Quis aut ut, dolorem
                        vitae repellat ipsum ea eos quam nesciunt temporibus, aliquid quo amet, ex
                        omnis? Numquam cum adipisci hic porro veritatis repellat accusantium, ad
                        magnam, consequatur neque nulla! Fuga fugit, alias ipsa eligendi excepturi
                        asperiores est iure, deserunt molestias libero molestiae minus officiis
                        saepe tempora.
                    </Text>
                </CustomModal> */}
            </Background>
        </View>
    );
};
export default WelcomeScreen;
