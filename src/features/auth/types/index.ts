export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => void | Promise<void>
  className?: string
}
