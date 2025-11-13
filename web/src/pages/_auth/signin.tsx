import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@/utils/validators/signin-validator";
import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/signin")({
  component: RouteComponent,
});

type SignUpSchema = z.infer<typeof signInSchema>;

export function useSignIn() {
  return useMutation<AxiosResponse, AxiosError, SignUpSchema>({
    mutationFn: async (data: SignUpSchema) => {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        data
      );
      return response.data;
    },
  });
}

export function useGoogleSignIn() {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.get("http://localhost:3000/auth/google");
      return response.data;
    },
  });
}

export function RouteComponent() {
  const navigate = useNavigate();

  const { mutate } = useSignIn();
  const { data } = useGoogleSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignUpSchema) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Login realizado com sucesso!");
        navigate({
          to: "/home",
        });
      },
      onError: () => {
        toast.error("Email ou senha inválidos.");
      },
    });
  };

  async function handleGoogleLogin() {
    const response = await axios.get("http://localhost:3000/auth/google");

    return response;
  }

  return (
    <main className="w-full h-screen flex flex-col lg:flex-row items-center justify-center">
      <section className="flex flex-col items-center justify-between py-6 lg:py-12 px-4 sm:px-8 w-full lg:w-1/2 min-h-screen bg-[#0a0a0a]">
        <Logo className="py-5" />
        <div className="flex flex-col items-center self-center grow bg-zinc-900 w-full max-w-2xl rounded-xl p-4 sm:p-6 lg:p-8 my-4 overflow-y-auto">
          <div className="w-full flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-zinc-200 text-4xl font-bold">Faça Login</h2>
              <p className="text-zinc-600 font-normal text-lg">
                Preencha seus dados para continar
              </p>
            </div>

            <form
              className="flex flex-col space-y-8"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col space-y-2">
                <label className="text-xl font-medium" htmlFor="email">
                  Email
                </label>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                <Input
                  type="email"
                  id="email"
                  className="p-5 font-normal text-lg"
                  placeholder="email@rewind.com"
                  {...register("email")}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-base font-medium" htmlFor="password">
                  Senha
                </label>

                <Input
                  type="password"
                  id="password"
                  className="p-5 font-normal text-lg"
                  placeholder="Insira sua senha"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
                <Link
                  to={"/change-password"}
                  className="text-base font-normal w-full text-right text-zinc-400 cursor-pointer hover:text-zinc-300 transition"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                className="p-6 bg-red-600 hover:bg-red-700 transition font-bold text-white text-base"
              >
                Faça login
              </Button>
            </form>

            <div className="w-full flex items-center gap-2">
              <p className="flex-1 border border-zinc-800"></p>
              <p className="text-zinc-800 text-base font-medium">Ou</p>
              <p className="flex-1 border border-zinc-800"></p>
            </div>

            <div className="w-full flex items-center gap-4">
              <Button
                className="p-6 flex-1 flex flex-row-reverse gap-2"
                variant="outline"
                onClick={handleGoogleLogin}
              >
                <p className="text-sm">Sign in with Google</p>
                <FcGoogle />
              </Button>

              <Button
                className="p-6 flex-1 flex flex-row-reverse gap-2"
                variant="outline"
              >
                <p className="text-sm">Sign in with GitHub</p>
                <FaGithub />
              </Button>
            </div>

            <p className="text-base flex justify-center gap-2 font-normal text-zinc-400 w-full">
              Novo aqui?
              <Link
                className="font-bold text-zinc-200 hover:text-zinc-100 transition"
                to="/signup"
              >
                Crie a sua conta.
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright at the bottom */}
        <p className="font-normal text-lg text-zinc-700 w-full text-center">
          © 2025 Rewind. Todos os direitos reservados.
        </p>
      </section>

      {/* Right side - Image with gradient */}
      <section className="hidden lg:block relative w-full lg:w-1/2 h-screen mt-12">
        <img
          src="/aranha.jpg"
          alt="Background image"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-l from-transparent to-[#0a0a0a]/95" />
      </section>
    </main>
  );
}
