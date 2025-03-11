import { useEffect, useState } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { VStack, Icon, HStack, Heading, Text, Image, Box, useToast} from "@gluestack-ui/themed";

import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionSvg from "@assets/repetitions.svg";

import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

type RouteParamsProps = {
  exerciseId: string;
}

export function Exercise() {
  const [sendingRegister, setSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const toast = useToast();
  const { exerciseId } = route.params as RouteParamsProps;

  

  function handleGoBack() {
    navigation.goBack()
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Erro ao buscar detalhes do exercício";
      
      toast.show({
        render: () => (
          <Box bg="$red500" mt="$16" px="$4" py="$4" rounded="$sm">
            <Text color="$white">{title}</Text>
          </Box>
        ),
        placement: "top"
      })
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true);

      await api.post("/history", { exercise_id: exerciseId });

      toast.show({
        render: () => (
          <Box bg="$green700" mt="$16" px="$4" py="$4" rounded="$sm">
            <Text color="$white">
              Exercício registrado com sucesso!
            </Text>
          </Box>
        ),
        placement: "top"
      });

      navigation.navigate("Tabs", { screen: "history" });

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Erro ao registrar exercício";
      
      toast.show({
        render: () => (
          <Box bg="$red500" mt="$16" px="$4" py="$4" rounded="$sm">
            <Text color="$white">{title}</Text>
          </Box>
        ),
        placement: "top"
      })
    } finally {
      setSendingRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack 
          justifyContent="space-between"
          alignItems="center"
          mt="$8"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />

            <Text color="$gray100" ml="$1" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, flex: 1 }}
      >
      { isLoading ? <Loading /> : 
        <VStack p="$8">
          <Image 
            source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}}
            alt="Ilustração do exercício."
            mb="$3"
            resizeMode="cover"
            rounded="$lg"
            w="$full"
            h="$80"
          />

          <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
          <HStack 
            alignItems="center" 
            justifyContent="space-around" 
            mb="$6" 
            mt="$5"
          >
              <HStack>
                <SeriesSvg />
                <Text color="$gray200" ml="$2">
                  {exercise.series} séries
                </Text>
              </HStack>

              <HStack>
                <RepetitionSvg />
                <Text color="$gray200" ml="$2">
                  {exercise.repetitions} repetições
                </Text>
              </HStack>
            </HStack>

            <Button 
              title="Marcar como realizado" 
              isLoading={sendingRegister}
              onPress={handleExerciseHistoryRegister}
            />
          </Box>
        </VStack>
      }
      </ScrollView>
    </VStack>
  )
}