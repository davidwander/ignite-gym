import { 
  VStack, 
  Image, 
  Center, 
  Text, 
  Heading, 
  ScrollView 
} from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";

import { useNavigation } from "@react-navigation/native";

import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export function SignUp() {

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>();

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  function handleSignUp({name, email, password, password_confirm}: FormDataProps) {
    console.log({ name, email, password, password_confirm });
  }

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w="$full"
          h={624} 
          source={BackgroundImg}
          defaultSource={BackgroundImg} 
          alt="Pessoas na academia" 
          position="absolute"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />

            <Text color="$gray100" fontSize="$sm">
              Treine sua mente e o seu corpo. 
            </Text>
          </Center>

          <Center gap="$2" flex={1}>
            <Heading color="$gray100">Crie sua conta</Heading>

            <Controller 
              control={control}
              name="name"
              rules={{
                required: "Informe o seu nome"
              }}
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder="Nome" 
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            {errors.name?.message && (
              <Text color="$white">{errors.name?.message}</Text>
            )}
            
            <Controller 
              control={control}
              name="email"
              rules={{
                required: "Informe seu e-mail",
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                  message: "E-mail inválido"
                }
              }}
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder="E-mail" 
                  keyboardType="email-address"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Text color="$white">
              {errors.email?.message}
            </Text>

            <Controller 
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder="Senha" 
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Controller 
              control={control}
              name="password_confirm"
              render={({ field: { onChange, value } }) => (
                  <Input 
                    placeholder="Confirmar senha" 
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    onSubmitEditing={handleSubmit(handleSignUp)}
                    returnKeyType="send"
                  />
                )}
              />

            <Button 
              title="Criar e acessar"
              onPress={handleSubmit(handleSignUp)} 
            />
          </Center>

          <Button 
            title="Volta para o login" 
            variant="outline" 
            mt="$12" 
            onPress={handleGoBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  )
}