import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { RewindOTP } from "@/components/rewind-otp";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import type { SignUpSchema } from "./signup";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/_auth/code")({
  component: RouteComponent,
});

export function useCode() {
  return useMutation<AxiosResponse, AxiosError, SignUpSchema>({
    mutationFn: async (data: SignUpSchema) => {
      const response = await axios.post(
        `http://localhost:3000/auth/signup/codigo`,
        data
      );
      return response.data;
    },
  });
}

function RouteComponent() {
  // const { email, username, password } = useSearch({ from: "/_auth/code" });
  // const [otp, setOtp] = useState("");

  function handleSubmit(data: FormEvent) {
    console.log(data);
  }

  function handleOtp(value: string) {
    console.log(value);
    // setOtp(value);
  }

  return (
    <main className="w-full h-screen grid grid-cols-2">
      <section className="flex flex-col justify-between py-12 px-8 w-full h-screen bg-[#0a0a0a]">
        <Logo className="px-8 mb-12" />
        <div className="flex flex-col items-center mt-12 grow">
          <div className="w-[500px] flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-zinc-200 text-4xl font-bold">
                Enter the Verification Code
              </h2>
              <p className="text-zinc-600 font-normal text-lg text-center">
                To finish the verification, enter the 6 digits code that whe
                sended to your email.
              </p>
            </div>

            <form className="flex flex-col space-y-10" onSubmit={handleSubmit}>
              <RewindOTP onOtpChange={handleOtp} />
              <Button
                type="submit"
                className="p-6 bg-red-600 hover:bg-red-700 transition font-bold text-white text-base"
              >
                Send
              </Button>
            </form>
          </div>
        </div>

        <p className="font-normal text-lg text-zinc-700 w-full text-center">
          © 2025 Rewind. Todos os direitos reservados.
        </p>
      </section>

      <section className="relative w-full h-full">
        <img
          src="/coringa-2.jpg"
          alt="Background image"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-l from-transparent to-[#0a0a0a]/95" />
      </section>
    </main>
  );
}
