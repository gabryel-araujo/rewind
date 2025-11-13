import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/utils/validators/signup-validator";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/signup")({
  component: RouteComponent,
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export function useSignUp() {
  return useMutation<AxiosResponse, AxiosError, SignUpSchema>({
    mutationFn: async (data: SignUpSchema) => {
      const response = await axios.post(
        "http://localhost:3000/auth/signup",
        data
      );
      return response.data;
    },
  });
}

export function RouteComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate } = useSignUp();
  const navigate = useNavigate({ from: "/_auth/signup" });

  const onSubmit = (data: SignUpSchema) => {
    mutate(data, {
      onSuccess: (res) => {
        console.log(res.data);
        navigate({
          to: "/code",
        });
      },
      onError: (err: AxiosError) => {
        toast.error(err.response?.data as string);
        console.log(err);
      },
    });
  };

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center">
      <section className="flex flex-col items-center justify-between py-6 lg:py-12 px-4 sm:px-8 w-full lg:w-1/2 min-h-screen bg-[#0a0a0a]">
        <Logo className="py-5" />

        <div className="flex flex-col items-center self-center grow bg-zinc-900 w-full max-w-2xl rounded-xl p-4 sm:p-6 lg:p-8 my-4 overflow-y-auto">
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-col space-y-2">
              <h2 className="text-zinc-200 text-2xl sm:text-3xl lg:text-4xl font-bold">
                Registre-se
              </h2>
              <p className="text-zinc-600 font-normal text-base sm:text-lg">
                Preencha seus dados para continuar
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-6 sm:space-y-8"
            >
              <div className="flex flex-col space-y-2">
                <label
                  className="text-lg sm:text-xl font-medium"
                  htmlFor="username"
                >
                  Nome de usuário
                </label>
                <Input
                  type="text"
                  id="username"
                  className="p-4 sm:p-5 font-normal text-base sm:text-lg"
                  placeholder="rewind.user"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label
                  className="text-lg sm:text-xl font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  className="p-4 sm:p-5 font-normal text-base sm:text-lg"
                  placeholder="email@rewind.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4">
                <div className="flex flex-col space-y-2 w-full">
                  <label className="text-base font-medium" htmlFor="password">
                    Senha
                  </label>
                  <Input
                    type="password"
                    id="password"
                    className="p-4 sm:p-5 font-normal text-base sm:text-lg"
                    placeholder="******************"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <label
                    className="text-base font-medium"
                    htmlFor="confirm-password"
                  >
                    Confirmar senha
                  </label>
                  <Input
                    type="password"
                    id="confirm-password"
                    className="p-4 sm:p-5 font-normal text-base sm:text-lg"
                    placeholder="******************"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="p-5 sm:p-6 bg-red-600 hover:bg-red-700 transition font-bold text-white text-sm sm:text-base"
              >
                Registre-se
              </Button>
            </form>

            <div className="w-full flex items-center gap-2">
              <p className="flex-1 border border-zinc-800"></p>
              <p className="text-zinc-800 text-sm sm:text-base font-medium">
                Ou
              </p>
              <p className="flex-1 border border-zinc-800"></p>
            </div>

            {/* Social buttons - stack on small screens */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <Button
                className="p-5 sm:p-6 w-full sm:flex-1 flex flex-row-reverse gap-2 justify-center"
                variant="outline"
              >
                <p className="text-xs sm:text-sm">Sign in with Google</p>
                <FcGoogle />
              </Button>

              <Button
                className="p-5 sm:p-6 w-full sm:flex-1 flex flex-row-reverse gap-2 justify-center"
                variant="outline"
              >
                <p className="text-xs sm:text-sm">Sign in with GitHub</p>
                <FaGithub />
              </Button>
            </div>

            <p className="text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 font-normal text-zinc-400 w-full">
              <span>Ja possui uma conta?</span>
              <Link
                className="font-bold text-zinc-200 hover:text-zinc-100 transition"
                to="/signin"
              >
                Faça login.
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright at the bottom */}
        <p className="font-normal text-sm sm:text-base lg:text-lg text-zinc-700 w-full text-center px-4">
          © 2025 Rewind. Todos os direitos reservados.
        </p>
      </section>

      <section className="hidden lg:block relative w-full lg:w-1/2 h-screen mt-12">
        <img
          src="/batman.jpg"
          alt="Background image"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-l from-transparent to-[#0a0a0a]/95" />
      </section>
    </main>
  );
}
