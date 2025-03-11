import { useState } from "react"
import { ScrollView, TouchableOpacity } from "react-native";
import { Center, VStack, Text, Heading, useToast } from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import * as ImagePiker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { useAuth } from "@hooks/useAuth";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
}

export function Profile() {
  const [userPhoto, setUserPhoto] = useState("https://github.com/davidwander.png");

  const toast = useToast();
  const { user } = useAuth();
  const { control, handleSubmit } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    }
  });

  async function handleUserPhotoSelect() {
    try{
      const photoSelected = await ImagePiker.launchImageLibraryAsync({
        mediaTypes: ImagePiker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });
      
      if(photoSelected.canceled) {
        return
      }

      const photoURI = photoSelected.assets[0].uri

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage 
                id={id}
                action="error"
                title="Imagem muito grande!"
                description="Essa imagem é muito grande. Escolha uma de até 5MB."
                onClose={() => toast.close(id)}
              />
            ),
          }) 
        }
        setUserPhoto(photoURI)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    console.log(data)
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto 
            source={{ uri: userPhoto}}
            alt="Foto do usuário"
            size="xl"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text 
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8" 
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller 
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input 
                placeholder="Nome" 
                bg="$gray600"
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Controller 
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input 
                bg="$gray600" 
                placeholder="Email"
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Controller 
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input 
                placeholder="Senha antiga" 
                bg="$gray600" 
                secureTextEntry 
                onChangeText={onChange}
              />
            )}
          />

          <Controller 
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input 
                placeholder="Nova senha" 
                bg="$gray600" 
                secureTextEntry 
                onChangeText={onChange}
              />
            )}
          />

          <Controller 
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input 
                placeholder="Confirme" 
                bg="$gray600" 
                secureTextEntry 
                onChangeText={onChange}
              />
            )}
          />

          <Button 
            title="Atualizar"
            mt="$4"
            onPress={handleSubmit(handleProfileUpdate)} 
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}