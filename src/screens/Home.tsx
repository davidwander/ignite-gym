import { useState, useEffect } from "react";
import { FlatList } from "react-native"
import { Heading, HStack, VStack, Text, useToast, Box } from "@gluestack-ui/themed";

import { api } from "@services/api";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard"
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { AppError } from "@utils/AppError";


export function Home() {
  const [exercises, setExercises] = useState([
    "Puxada frontal", 
    "Remada curvada", 
    "Remada unilateral", 
    "Levantamento terra",
  ]);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState("Costas");

  const toast = useToast()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails() {
    navigation.navigate("Exercise")
  }

  async function fetchGroups() {
    try {
      const response = await api.get("/groups")
      setGroups(response.data)

      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Erro ao buscar grupos";
      
      toast.show({
        render: () => (
          <Box bg="$red500" mt="$16" px="$4" py="$4" rounded="$sm">
            <Text color="$white">{title}</Text>
          </Box>
        ),
        placement: "top"
      })
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList 
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group 
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)} 
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      <VStack px="$8" flex={1}>
        <HStack justifyContent="space-between" mb="$5" alignItems="center">
          <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
            Exercícios
          </Heading>  
          
          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            {exercises.length}
          </Text>  
        </HStack>

        <FlatList 
          data={exercises}
          keyExtractor={item => item}
          renderItem={() => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  )
}