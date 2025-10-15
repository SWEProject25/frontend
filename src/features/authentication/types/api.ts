// API Request/Response Types
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface RegisterResponseDto {
  status: string;
  message: string;
  user: UserResponse;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  status: string;
  message: string;
  user: UserResponse;
}
