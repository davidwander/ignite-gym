import { useState } from "react";
import { SectionList } from "react-native";
import { Heading, VStack, Text } from "@gluestack-ui/themed";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "20.02.25",
      data: ["Puxada frontal", "Remada unilateral"],
    },
    {
      title: "21.02.25",
      data: ["Puxada frontal",],
    },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      <SectionList 
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={() => <HistoryCard />}
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