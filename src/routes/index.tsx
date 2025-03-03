import { useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box } from "@gluestack-ui/themed";

import { AuthContext } from '@contexts/AuthContext';

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

import { gluestackUIConfig } from "../../config/gluestack-ui.config";

export function Routes() {
  const contextData = useContext(AuthContext);
  console.log("Usuário logado => ", contextData)

  const theme = DefaultTheme
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;


  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  )
}