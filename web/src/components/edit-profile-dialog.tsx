import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//TODO: todos tão como placeholder, mas vou usar defaultValue pq aqui no caso é
//pra editar

export function EditProfileDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="secondary" className="p-6 text-lg">
            Editar Perfil
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Editar Perfil</DialogTitle>
            <DialogDescription>
              Após fazer as suas alterações, clique em salvar e tudo será
              atualizado.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Nome</Label>
              <Input id="name-1" name="name" placeholder="John Doe" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="username-1">Usuário</Label>
              <Input id="username-1" name="username" placeholder="@john_doe" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="username-2">Email</Label>
              <Input
                id="username-2"
                name="email"
                placeholder="johndoe@gmail.com"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
