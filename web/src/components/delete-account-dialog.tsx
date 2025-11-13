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

export function DeleteAccountDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="bg-red-900/10 text-red-600 font-bold rounded-md p-6 border border-red-900/40 hover:bg-red-900/20 transition"
          >
            Apagar conta
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Apagar conta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja apagar a sua conta? IUma vez que a conta
              for excluída, você terá até 30 dias para recuperá-la.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" variant={"destructive"}>
              Apagar
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
