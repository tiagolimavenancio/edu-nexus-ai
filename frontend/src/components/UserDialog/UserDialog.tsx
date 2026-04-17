import Modal from "@/components/global/Modal";
import UserForm from "@/components/UserForm/UserForm";
import type { IUser, UserRole } from "@/types/User";

interface IUserDialogProps {
  open: boolean;
  editingUser: IUser | null;
  role: UserRole;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

const UserDialog = ({ open, setOpen, editingUser, role, onSuccess }: IUserDialogProps) => {
  const title = editingUser ? "Update User" : "Create User";
  const description = editingUser ? "Update user details" : "Add a new user";

  const onSuccessPlus = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Modal title={title} description={description} open={open} setOpen={setOpen}>
      <UserForm
        type={editingUser ? "update" : "create"}
        role={role}
        initialData={editingUser}
        onSuccess={onSuccessPlus}
      />
    </Modal>
  );
};

export { UserDialog };
