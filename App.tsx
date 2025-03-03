import { StatusBar } from 'react-native';
import { 
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
} from '@expo-google-fonts/roboto';
import { GluestackUIProvider } from '@gluestack-ui/themed';

import { config } from './config/gluestack-ui.config';

import { Routes } from "./src/routes";

import  { AuthContext } from "@contexts/AuthContext";

import { Loading } from '@components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <GluestackUIProvider config={config}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContext.Provider value={{
        user: {
          id: '1',
          name: 'David Wander',
          email: 'dwander616@gmail.com',
          avatar: 'david,png'
        }
      }}>
        {fontsLoaded ? <Routes /> : <Loading /> }
      </AuthContext.Provider>
    </GluestackUIProvider>
  );
}
