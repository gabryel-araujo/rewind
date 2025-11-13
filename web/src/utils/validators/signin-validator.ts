import { z } from "zod";

export const PASSWORD_SCHEMA = z
  .string()
  .min(1, "O campo senha é obrigatório")
  .max(30);

export const signInSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "O campo email é obrigatório"),
  password: PASSWORD_SCHEMA,
});
