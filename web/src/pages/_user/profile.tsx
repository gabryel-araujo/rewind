import { Input } from "@/components/ui/input";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { createFileRoute } from "@tanstack/react-router";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { ChangePasswordDialog } from "@/components/change-password-dialog";
import { ChangeAvatarDialog } from "@/components/change-avatar-dialog";

export const Route = createFileRoute("/_user/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const username = "usuario";
  const email = "usuario@email.com";

  return (
    <section className="w-full h-full flex flex-col space-y-12 justify-center items-center">
      <div className="w-[1200px] bg-zinc-900 rounded-md p-8 border-2 flex items-center justify-between">
        <ChangeAvatarDialog
          user={{
            displayName: "John Doe",
            photo:
              "https://unsplash.com/photos/silhouette-of-man-illustration-2LowviVHZ-E",
            username: "@" + "john_doe",
            email: "john@doe.com",
          }}
        />

        <EditProfileDialog />
      </div>
      <div className="w-[1200px] flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Visão geral</h2>

        <div className="w-full rounded-xl flex gap-4">
          <div className="flex rounded-xl flex-col space-y-2 flex-1 p-8 bg-zinc-900 border-2 border-zinc-850">
            <h3 className="text-xl text-zinc-600 font-medium">
              Filmes Favoritos
            </h3>
            <span className="text-4xl font-bold">10</span>
          </div>

          <div className="bg-zinc-900 rounded-xl flex flex-col space-y-2 flex-1 p-8 border-2 border-zinc-850">
            <h3 className="text-xl text-zinc-600 font-medium">
              Filmes Assistidos
            </h3>
            <span className="text-4xl font-bold">123</span>
          </div>

          <div className="bg-zinc-900 rounded-xl flex flex-col space-y-2 flex-1 p-8 border-2 border-zinc-850">
            <h3 className="text-xl text-zinc-600 font-medium">
              Filmes em curso
            </h3>
            <span className="text-4xl font-bold">2</span>
          </div>
        </div>
      </div>

      <div className="w-[1200px] flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Configurações da conta</h2>

        <div className="bg-zinc-900 flex flex-col space-y-4 border-2 rounded-xl p-4">
          <div className="w-full flex gap-8 border-b-2 pt-2 pb-4 border-zinc-800">
            <div className="flex flex-col space-y-2 flex-1">
              <label
                className="text-base text-zinc-400 font-medium"
                htmlFor="username"
              >
                Usuário
              </label>

              <Input
                type="text"
                id="username"
                className="p-6 font-normal text-lg"
                placeholder={username}
              />
            </div>

            <div className="flex flex-col space-y-2 flex-1">
              <label
                className="text-base text-zinc-400 font-medium"
                htmlFor="username"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                className="p-6 font-normal text-lg"
                placeholder={email}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 pb-6 border-b-2 border-red-800/40">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium text-xl">Modificar senha</h3>
              <p className="text-zinc-400">
                Recomendamos o uso de uma senha forte
              </p>
            </div>
            <ChangePasswordDialog />
          </div>

          <div className="flex justify-between items-center pt-4 pb-6">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium text-xl text-red-400/80">Atenção</h3>
              <p className="text-zinc-400">
                Uma vez que a conta for excluída, você terá até 30 dias para
                recuperá-la.
              </p>
            </div>

            <DeleteAccountDialog />
          </div>
        </div>
      </div>
    </section>
  );
}
