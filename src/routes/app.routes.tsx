import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationProp } from "@react-navigation/native";

import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import { Platform } from "react-native";

import { Home } from "@screens/Home";
import { Profile } from "@screens/Profile";
import { History } from "@screens/History";
import { Exercise } from "@screens/Exercise";

import HomeSvg from "@assets/home.svg";
import HistorySvg from "@assets/history.svg";
import ProfileSvg from "@assets/profile.svg";

export type TabRoutes = {
  home: undefined;
  history: undefined;
  profile: undefined;
};

export type StackRoutes = {
  Tabs: { screen?: keyof TabRoutes } | undefined;
  Exercise: { exerciseId: string };
  history: undefined;
};

export type AppNavigatorRoutesProps = NavigationProp<StackRoutes>;

const Tab = createBottomTabNavigator<TabRoutes>();
const Stack = createStackNavigator<StackRoutes>();

function TabRoutes() {
  const { tokens } = gluestackUIConfig;
  const iconSize = tokens.space["8"];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.green500,
        tabBarInactiveTintColor: tokens.colors.gray200,
        tabBarStyle: {
          backgroundColor: tokens.colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: tokens.space["10"],
          paddingTop: tokens.space["6"],
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg
              fill={color}
              width={iconSize}
              height={iconSize}
              style={{ marginBottom: 24 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg
              fill={color}
              width={iconSize}
              height={iconSize}
              style={{ marginBottom: 24 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg
              fill={color}
              width={iconSize}
              height={iconSize}
              style={{ marginBottom: 24 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabRoutes} />
      <Stack.Screen name="Exercise" component={Exercise} />
    </Stack.Navigator>
  );
}
