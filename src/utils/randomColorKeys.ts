import DesignSystem from '../styles';
const { Colors } = DesignSystem();
type ColorKeys = keyof typeof Colors;
const KeySet: ColorKeys[] = ['hitotsu', 'futatsu', 'mittsu', 'yottsu', 'itsutsu'];
const getRandomColorKey = () => {
    const index = Math.floor(Math.random() * KeySet.length);

    // return 'text-'.concat(KeySet[index]);
    return KeySet[index];
};
export default getRandomColorKey;
