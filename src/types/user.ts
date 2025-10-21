export interface UserProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  created_at: string
  updated_at: string
}

export interface SignInData {
  email: string
  password: string
}
