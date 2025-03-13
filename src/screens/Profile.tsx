import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Center, VStack, Text, Heading, useToast, Box } from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as yup from "yup";

import { api } from "@services/api";

import { useAuth } from "@hooks/useAuth";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";
import { AppError } from "@utils/AppError";

const transformEmptyToUndefined = (value: any) =>
  value === "" ? undefined : value;

const profileSchema = yup.object({
  name: yup
    .string()
    .required("Informe o nome"),
  email: yup
    .string()
    .email("E-mail inválido")
    .required("O e-mail é obrigatório"),
  old_password: yup
    .string()
    .transform(transformEmptyToUndefined)
    .notRequired(),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .transform(transformEmptyToUndefined)
    .notRequired(),
  confirm_password: yup
    .string()
    .transform(transformEmptyToUndefined)
    .when("password", {
      is: (password: any) => !!password,
      then: (schema) =>
        schema
          .required("Confirme a nova senha")
          .oneOf([yup.ref("password")], "As senhas não coincidem"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

export type FormDataProps = yup.InferType<typeof profileSchema>;

export function Profile() {
  const [isUpdating, setUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/davidwander.png"
  );

  const toast = useToast();
  const { user, updateUserProfile } = useAuth() || { 
    user: { name: "", email: "" } };

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
      old_password: "",
      password: "",
      confirm_password: "",
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });
  
      if (photoSelected.canceled || !photoSelected.assets?.length) {
        return;
      }
  
      const photoURI = photoSelected.assets[0].uri;
      const fileType = photoSelected.assets[0].type;
  
      if (photoURI) {
        const photoInfo = await FileSystem.getInfoAsync(photoURI);
  
        if (photoInfo.exists && photoInfo.size && 
          photoInfo.size / 1024 / 1024 > 5) {
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
          });
        }
  
        const fileExtension = photoURI.split('.').pop();
  
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoURI,
          type: `${fileType}/${fileExtension}`,
        } as any;
  
        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);

        await api.patch("/users/avatar", userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.show({
          render: () => (
            <Box bg="$green500" mt="$16" px="$4" py="$4" rounded="$sm">
              <Text color="$white">
                Foto de perfil atualizada com sucesso!
              </Text>
            </Box>
          ),
          placement: "top"
        })

      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put("/users", data);

      await updateUserProfile(userUpdated);

      toast.show({
        render: () => (
          <Box bg="$green500" mt="$16" px="$4" py="$4" rounded="$sm">
            <Text color="$white">
              Perfil atualizado com sucesso!
            </Text>
          </Box>
        ),
        placement: "top"
      });

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Não foi possível atualizar os  dados. Tente novamente mais tarde";

      toast.show({
        render: () => (
          <Box bg="$red500" mt='$16' px="$4" py="$4" rounded="$sm">
            <Text color="$white">
              {title}
            </Text>
          </Box>
        ),
        placement: "top"
      })
    } finally{
      setUpdating(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto source={{ uri: userPhoto }} alt="Foto do usuário" size="xl" />

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
                errorMessage={errors.name?.message}
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
                editable={false}
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
                errorMessage={errors.password?.message}
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
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt="$4"
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
