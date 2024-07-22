import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnBoardScreen from './components/OnBoardScreen';
import Lokasi from './components/Lokasi';
import Toast from 'react-native-toast-message';
import DetailBencana from './components/DetailBencana';
import MapViewScreen from './components/MapView';
import Beranda from './components/Beranda';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OnBoard">
        <Stack.Screen name="OnBoard" component={OnBoardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Lokasi" component={Lokasi} />
        <Stack.Screen name="Beranda" component={Beranda} />
        <Stack.Screen name="DetailBencana" component={DetailBencana} />
        <Stack.Screen name="MapView" component={MapViewScreen} />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)}/>
    </NavigationContainer>
  );
};

export default App;
