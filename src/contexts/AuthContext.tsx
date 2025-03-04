import  { createContext, ReactNode, useState } from "react";

import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
  user: UserDTO;
}

type AuthContextProviderProps = {
  children: ReactNode;
  
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({
      id: '1',
      name: 'David Wander',
      email: 'dwander616@gmail.com',
      avatar: 'david,png'
  })

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}