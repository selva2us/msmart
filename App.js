import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './src/navigation/AppStack';
import store from './src/redux/store';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
