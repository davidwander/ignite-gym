import { Heading, HStack, Image, VStack, Text, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ChevronRight } from "lucide-react-native"

type Props = TouchableOpacityProps

export function ExerciseCard({ ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack 
        bg="$gray500" 
        alignItems="center" 
        p="$2" 
        pr="$4" 
        rounded="$md" mb="$3"
      >
        <Image 
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6cuJ-gLyS6R6KnDFWQI9TsWKYmvrDNWT3bw&s"
          }}
          alt="Ilustração do exercício"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            Puxada frontal
          </Heading>
          <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>
            3 series x 12 repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  )
}