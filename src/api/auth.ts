import client from "./client";
import type { AuthResponse, User } from "@/types";

export async function login(username: string, password: string): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>("/auth/login/", { username, password });
  return data;
}

export async function register(payload: {
  username: string;
  password: string;
  role?: string;
  region?: string;
}): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>("/auth/register/", payload);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await client.get<User>("/auth/me/");
  return data;
}
