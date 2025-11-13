import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Profile } from "./profile";
import { useRef, useState } from "react";

interface ChangeAvatarDialogProps {
  user: {
    photo: string;
    username: string;
    displayName?: string;
    email?: string;
  };
}

export const ChangeAvatarDialog = ({ user }: ChangeAvatarDialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(user.photo);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Profile isProfile user={user} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar foto</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col items-center gap-4">
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <img src={avatar} className="w-32 h-32 rounded-full" />
              <Button
                onClick={() => inputRef.current?.click()}
                variant="outline"
              >
                Escolha uma foto
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Button className="mt-8">Salvar</Button>
      </DialogContent>
    </Dialog>
  );
};
