import { useCallback, useState } from "react";
import { SectionList } from "react-native";
import { Heading, VStack, Text, useToast, Box } from "@gluestack-ui/themed";

import { api } from "@services/api";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { AppError } from "@utils/AppError";
import { useFocusEffect } from "@react-navigation/native";

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  const toast = useToast();

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await api.get("/history");
      setExercises(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar o histórico";
      
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

    useFocusEffect(useCallback(() => {
      fetchHistory();
    }, []));
  
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList 
        sections={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section }) => (
          <Heading 
            color="$gray200"
            fontSize="$md"
            mt="$10"
            mb="$3"
            fontFamily="$heading"
          >
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color="$gray200" textAlign="center">
            Não há dados de treino registrados. {"\n"}
            Adicione exercícios no menu principal.
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
      
    </VStack>
  )
}