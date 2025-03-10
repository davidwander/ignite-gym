import { useState, useEffect, useCallback } from "react";
import { FlatList } from "react-native"
import { Heading, HStack, VStack, Text, useToast, Box } from "@gluestack-ui/themed";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";


export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState("Antebraço");

  const toast = useToast()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate("Exercise", { exerciseId })
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

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true)

      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      setExercises(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Erro ao buscar execícios";
      
      toast.show({
        render: () => (
          <Box bg="$red500" mt="$16" px="$4" py="$4" rounded="$sm">
            <Text color="$white">{title}</Text>
          </Box>
        ),
        placement: "top"
      }); 
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, []);

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup();
  }, [groupSelected]));

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

      {
        isLoading ? <Loading /> :
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
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExerciseCard 
                onPress={() => handleOpenExerciseDetails(item.id)} 
                data={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      }
    </VStack>
  )
}