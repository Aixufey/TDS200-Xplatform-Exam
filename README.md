# TDS200-Xplatform-Exam

This is the Exam 2023 in Cross-platform at Høyskolen Kristiania.<br />
The project will fail to run if `.env` for **Firebase** is not configured. Rename the `.env template` and setup with your Firebase application configuration.

- [TDS200-Xplatform-Exam](#tds200-xplatform-exam)
  - [Issues \& bugs](#issues--bugs)
  - [Dependencies](#dependencies)
    - [Expo](#expo)
    - [Firebase](#firebase)
    - [Fonts](#fonts)
    - [Navigation](#navigation)
    - [Prettier](#prettier)
    - [React Native dotenv](#react-native-dotenv)
    - [Splash screen](#splash-screen)
    - [Safe Area](#safe-area)
    - [TailWind \& NativeWind](#tailwind--nativewind)
    - [Vector Icons](#vector-icons)
  - [GitHooks](#githooks)
    - [Instructions](#instructions)

## Issues & bugs

## Dependencies

### [Expo](https://docs.expo.dev/)

The bare bone is installed using **Expo Go** `npx create-expo-app -t` with TypeScript template. Flag `-t` for template.&nbsp;&nbsp;<br />

---

### [Firebase](https://firebase.google.com/docs/web/setup)

The Firebase comes with **FireStore** and **Realtime Database**. Both has to be activated and configured in order make requests. The difference is one is for `JSON` and the other is for `Media` objects. To install Firebase `npm i firebase`. To start using Firebase create a project and add the appropriate platform i.e. `iOS` or `Android`.&nbsp;&nbsp;<br />
When the app has been registered, move the `google-services.json` file into root directory. Finally, create a **firebaseConfig.ts** file and configure the API accordingly

```js
// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    //...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

---

### [Fonts](https://docs.expo.dev/versions/latest/sdk/font/)

Using custom fonts with library **Expo Font** via `npx expo install expo-font`. &nbsp;&nbsp;'The Typeface is **Handjet** & **Ubuntu** from [Google Fonts](https://fonts.google.com/). To use the Typeface in TypeScript we need to declare a module with **.ttf** files as strings. For optimal performance we use a HOC to dynamically pass in the Typeface we want.

---

### [Navigation](https://reactnative.dev/docs/next/navigation)

Navigation between screens is similar to web with links **\<a href='#Home'>** but on native we are using same technique with **navigation.navigate('Home')**.&nbsp;&nbsp;
The gist is to wrap the entry of our Application with a container `NavigationContainer` then we can provide the navigation routes for different screens.
Install the container `npm install @react-navigation/native` and then we need the navigation from `npm install @react-navigation/stack` &nbsp;&nbsp; which offers animations and gestures. There is also a **[native-stack](https://reactnavigation.org/docs/stack-navigator)** which use the navigation primitives.

---

### [Prettier](https://medium.com/@killerchip0/react-native-typescript-with-eslint-and-prettier-e98d50585627)

Code structure formatter via `npx i --save-dev prettier` and add the following to **package.json**

```json
"scripts": {
        ...
        "prettier:write": "npx prettier --write **/*.{js,jsx,ts,tsx,json} && npx prettier --write *.{js,jsx,ts,tsx,json}"
    }
```

Create a new file `.prettierrc` and add the following rules

```json
{
    "arrowParens": "always",
    "bracketSpacing": true,
    "jsxSingleQuote": false,
    "quoteProps": "as-needed",
    "singleQuote": true,
    "semi": true,
    "printWidth": 100,
    "useTabs": false,
    "tabWidth": 4,
    "trailingComma": "es5",
    "endOfLine": "auto"
}
```

Finally, we add VSCODE settings in `settings.json` under TypeScript to prettify on save

```json
"[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
    },
```

---

### [React Native dotenv](https://www.npmjs.com/package/react-native-dotenv)

Loading environment variables using a babel plugin. To use **.env** file install `npm install -D react-native-dotenv`&nbsp;&nbsp;flag `-D` is default.
Add the following in **.babelrc** or **babel.config.js**

```js
module.exports = function(api) {
  api.cache(true);
  return {
    ...
    plugins: ["nativewind/babel", [
      'module:react-native-dotenv', {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        allowUndefined: true,
      }
    ]],
  };
};
```

Then create a folder `types` and create a file `env.d.tsx` with the following

```js
// env.d.tsx
declare module '@env' {
 export const APIKEY: string;
}
// to import
import { APIKEY } from '@env';
```

Finally add the following in `tsconfig.json` to compile

```js
{
  "compilerOptions": {
      "typeRoots": ["./src/types"]
  }
}
```

---

### [Splash screen](https://docs.expo.dev/versions/latest/sdk/splash-screen/)

**SplashScreen** module from the **expo-splash-screen** for preloading fonts and other gimmicks. Install via `npx expo install expo-splash-screen`

---

### [Safe Area](https://docs.expo.dev/develop/user-interface/safe-areas/)

The Component **SafeAreaView** is unstable and the recommendation is to use the hook instead **useSafeAreaInsets**. `npx expo install react-native-safe-area-context`

---

### [TailWind & NativeWind](https://www.nativewind.dev/quick-starts/expo)

NativeWind uses Tailwind CSS as scripting language, Styled Components is using **StyleSheet.create** for native. The latest NativeWind is not fully supported so we have to explicit install version **3.3.2** `npm i tailwindcss@3.3.2 --save-dev`. Flag `--save-dev` will put dependencies into `devDependencies` and will not be part of the production build. Now we install NativeWind `npm i nativewind`.
Then we have to declare the types for referencing NativeWind by creating a file `app.d.ts` with the following line

```js
/// <reference types="nativewind/types" />
```

Then setup the TailWind configuration `npx tailwindcss init`, and extend the content with the following line

```js
content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
```

Finally modify **babel.config.js** and add the line

```js
module.exports = function (api) {
  api.cache(true);
  return {
    ...
+   plugins: ["nativewind/babel"],
  };
};
```

### [Vector Icons](https://docs.expo.dev/guides/icons/#expovector-icons)

A library that provides various vector icons via `npm i @expo/vector-icons` &nbsp;&nbsp;For more official [documentation](https://icons.expo.fyi/Index/Entypo/login)

## GitHooks

-   GitHooks is running a bash script named `post-checkout.sh` that does pulling from remote branch
    asserting that you are always developing from the latest update.
-   This will reduce the merge conflict to a certain extent.
    Developers will be able to branch out new features from the "developer" branch.
-   Hooks are running locally inside hidden folder .git/hooks when a git repository is initialized.
-   In order to provide the team with the hooks in their environment, a symbolic link has to be created.

### Instructions

1. Make sure you are in the root directory `pwd` _~/TDS200-Xplatform-Exam_
2. Create **two** Symbolic Links from the provided script `post-checkout.sh` using command:
3. `ln -s -f ../../githooks/post-checkout.sh .git/hooks/post-checkout`
4. `ln -s -f ../../githooks/post-switch.sh .git/hooks/post-switch`<br />
5. Make sure .sh has permissions `chmod +x .git/hooks/post-*`

-   The Hooks should be working now with both commands like `switch` or `checkout` whichever the developer prefers. It may be tested running `git checkout developer` and you should see a prompt "_Checked out developer branch, pulling latest from origin/developer..._"
-   `ln` links in Unix `-s` pointer to a file `-f` force override <br />
