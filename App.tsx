import { NotoSans_400Regular, useFonts } from '@expo-google-fonts/noto-sans';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { Home } from './screens/Home/home';
import { LogInContainer } from './screens/LogIn/loginContainer';
import { Splash } from './screens/Splash/Splash';
import { UserContext } from './userContext';

const theme = {
  ...DefaultTheme,
  fontFamily: {...DefaultTheme.fonts.regular.fontFamily = 'NotoSans_400Regular'} 
};

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

export default function App() {
  let [fontsLoaded] = useFonts({
    NotoSans_400Regular
  });

  if ( !fontsLoaded ) return null

  return (
    <UserContext.Provider value={{email:""}}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={ { headerShown: false } }>
            <Stack.Screen
              name="LogIn"
              component={LogInContainer}/>
            <Stack.Screen
              name='Home'
              component={Home}/>
            <Stack.Screen
              name="Splash"
              component={Splash}
              initialParams={ {to: "LogIn"} }/>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserContext.Provider>
  );
}
