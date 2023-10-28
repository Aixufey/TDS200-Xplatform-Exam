# TDS200-Xplatform-Exam

This is the Exam 2023 in Cross-platform at Høyskolen Kristiania.<br />
The project will fail to run if `.env` for **Firebase** is not configured. Rename the `.env template` and setup with your Firebase application configuration.

## Dependencies

### [Expo](https://docs.expo.dev/)
The bare bone is installed using **Expo Go** `npx create-expo-app -t` with TypeScript template. Flag `-t` for template.&nbsp;&nbsp;<br />

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
### [Firebase](https://firebase.google.com/docs/web/setup)
The Firebase comes with **FireStore** and **Realtime Database**. Both has to be activated and configured in order make requests. The difference is one is for `JSON` and the other is for `Media` objects. To install Firebase `npm i firebase`. To start using Firebase create a project and add the appropriate platform i.e. `iOS` or `Android`.&nbsp;&nbsp;<br />
When the app has been registered, move the `google-services.json` file into root directory. Finally, create a **firebaseConfig.ts** file and configure the API accordingly
```js
// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  //...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```
---
### [Splash screen](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
**SplashScreen** module from the **expo-splash-screen** for preloading fonts and other gimmicks. Install via `npx expo install expo-splash-screen`


## GitHooks 🪝
 
- GitHooks is running a bash script named `post-checkout.sh` that does pulling from remote branch 
asserting that you are always developing from the latest update.
- This will reduce the merge conflict to a certain extent. 
Developers will be able to branch out new features from the "developer" branch.
- Hooks are running locally inside hidden folder .git/hooks when a git repository is initialized.
- In order to provide the team with the hooks in their environment, a symbolic link has to be created.

### Instructions
1. Make sure you are in the root directory `pwd`  *~/TDS200-Xplatform-Exam*
2. Create **two** Symbolic Links from the provided script `post-checkout.sh` using command: 
3. `ln -s -f ../../githooks/post-checkout.sh .git/hooks/post-checkout`
4. `ln -s -f ../../githooks/post-switch.sh .git/hooks/post-switch`<br />
5. Make sure .sh has permissions `chmod +x .git/hooks/post-*`

- The Hooks should be working now with both commands like `switch` or `checkout` whichever the developer prefers. It may be tested running `git checkout developer` and you should see a prompt "*Checked out developer branch, pulling latest from origin/developer...*"
- `ln` links in Unix `-s` pointer to a file `-f` force override <br />