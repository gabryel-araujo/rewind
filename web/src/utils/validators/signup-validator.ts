import { z } from "zod";

export const PASSWORD_SCHEMA = z
  .string()
  .min(6, "O campo senha deve possuir no mínimo 6 caracteres")
  .max(30)
  .refine(
    (input) => {
      const hasNumber = /\d/.test(input);
      const hasUppercase = /[A-Z]/.test(input);
      const onlyAllowedChars = /^[a-zA-Z0-9@]*$/.test(input);
      return hasNumber && hasUppercase && onlyAllowedChars;
    },
    {
      message:
        "A senha deve conter pelo menos um número, uma letra maiúscula e apenas '@' como caractere especial.",
    }
  );

export const USERNAME_SCHEMA = z
  .string()
  .min(6, "O nome de usuário deve possuir ao menos 6 caracteres")
  .max(30)
  .refine((input) => /^[a-zA-Z0-9]*$/.test(input), {
    message: "O nome de usuário não pode conter caracteres especiais.",
  });

export const signUpSchema = z
  .object({
    username: USERNAME_SCHEMA,
    email: z
      .string()
      .email("Email inválido")
      .min(1, "O campo email é obrigatório"),
    password: PASSWORD_SCHEMA,
    confirmPassword: z
      .string()
      .min(6, "A confirmação de senha deve possuir ao menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });
