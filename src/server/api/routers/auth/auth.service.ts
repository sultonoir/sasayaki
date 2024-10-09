"use server";

import bcrypt from "bcrypt";
import {
  type FormState,
  type SigninFormSchema,
  type SignupFormSchema,
} from "./auth.input";
import { db } from "@/server/db";
import { createId } from "@/helper/createId";
import { createSession, deleteSession } from "@/helper/session";

export async function signup({
  name,
  username,
  password,
}: SignupFormSchema): Promise<FormState> {
  // 1. Check if the user's username already exists
  const existingUser = await db.user.findFirst({
    where: {
      username,
    },
  });

  if (existingUser) {
    return {
      message:
        "Username already exists, please use a different username or login.",
    };
  }

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Insert the user into the database or call an Auth Provider's API
  const user = await db.user.create({
    data: {
      id: createId(),
      username,
      name,
      hashPassword: hashedPassword,
    },
  });

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  // 3. Create a session for the user
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  await createSession(payload);
}

export async function signin({ username, password }: SigninFormSchema) {
  // 1. Query the database for the user with the given username
  const user = await db.user.findFirst({
    where: {
      username,
    },
  });

  // If user is not found, return early
  if (!user?.hashPassword) {
    throw new Error("Invalid login credentials.");
  }
  // 2. Compare the user's password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.hashPassword);

  // If the password does not match, return early
  if (!passwordMatch) {
    throw new Error("Invalid login credentials.");
  }

  // 3. If login successful, create a session for the user and redirect
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  await createSession(payload);
}

export async function logout() {
  deleteSession();
}
