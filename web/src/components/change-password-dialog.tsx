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
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function ChangePasswordDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="secondary" className="p-6 text-base">
            Modificar senha
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Modificar senha</DialogTitle>
            <DialogDescription>Digite e confirme a sua senha</DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Senha</Label>
              <Input id="name-1" name="name" defaultValue="@Pedruarte123124" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="username-1">Confirmar senha</Label>
              <Input
                id="username-1"
                name="username"
                placeholder="@Pedruarte123124"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
