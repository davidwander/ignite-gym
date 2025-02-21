import { VStack, Image } from "@gluestack-ui/themed";

import BackgroundImg from "@assets/background.png";

export function Signin() {
  return (
    <VStack flex={1} bg="$gray700">
      <Image
        w="$full"
        h={624} 
        source={BackgroundImg}
        defaultSource={BackgroundImg} 
        alt="Pessoas na academia" 
        position="absolute"
      />
    </VStack>
  )
}