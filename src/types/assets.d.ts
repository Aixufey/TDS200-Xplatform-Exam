// Declaring .ttf font file as string
declare module "*.ttf" {
    const value: import("expo-font").FontSource;
    export default value;
}
