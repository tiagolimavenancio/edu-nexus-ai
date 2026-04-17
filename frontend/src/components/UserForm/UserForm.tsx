import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { createSchema, type FormType, type FormValues } from "@/schema/userForm";
import type { IUser, UserRole } from "@/types/User";
import type { IClass } from "@/types/Class";
import type { ISubject } from "@/types/Subject";
import { CustomInput } from "@/components/global/CustomInput";
import { CustomSelect } from "@/components/global/CustomSelect";
import { CustomMultiSelect } from "@/components/global/CustomMultiSelect";
import type { IPagination } from "@/types/Pagination";

interface IUserFormProps {
  type: FormType;
  initialData?: IUser | null;
  role?: UserRole;
  onSuccess?: () => void;
}

const UserForm = ({ type, initialData, onSuccess, role }: IUserFormProps) => {
  const isUpdate = type === "update";
  const isLogin = type === "login";

  const [classes, setClasses] = useState<IClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(createSchema(type)),
    defaultValues: {
      name: "",
      email: "",
      role: role,
      password: "",
      classId: undefined,
      subjectIds: [],
    },
  });

  // fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);

        const { data } = (await api.get("/classes")) as {
          data: { classes: IClass[]; pagination: IPagination };
        };

        setClasses(data.classes);
      } catch (error) {
        if (type !== "login") {
          toast.error("Failed to load Classes");
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingOptions(true);

        const { data } = (await api.get("/subjects")) as {
          data: { subjects: ISubject[]; pagination: IPagination };
        };

        setSubjects(data.subjects);
        setLoadingOptions(false);
      } catch (error) {
        if (type !== "login") {
          toast.error("Failed to load subjects");
          console.log(error);
        }
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchSubjects();
  }, []);

  // Populate form for Update mode
  useEffect(() => {
    if (initialData && isUpdate) {
      const existingClassId =
        typeof initialData.studentClass === "object"
          ? initialData.studentClass?._id
          : initialData.studentClass;

      form.reset({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || "student",
        password: "",
        classId: existingClassId || "",
        subjectIds: initialData.teacherSubjects?.map((s) => s._id) || [],
      });
    }
  }, [isUpdate, initialData, form, classes]);

  async function onSubmit(data: FormValues) {
    try {
      const payload = {
        studentClass: data.classId ? data.classId : undefined,
        teacherSubjects: data.subjectIds ? data.subjectIds : [],
        // role: role,
        ...data,
      };

      if (isLogin) {
        const { data: user } = await api.post("/users/login", {
          email: data.email,
          password: data.password,
        });

        //   todo: set user context
        console.log(user);
        toast.success("Logged in successfully");
        window.location.href = "/dashboard";
      } else if (type === "create") {
        await api.post("/users/register", payload);
        toast.success("Account created successfully!");
        if (onSuccess) onSuccess();
      } else if (type === "update" && initialData?._id) {
        await api.put(`/users/update/${initialData._id}`, payload);
        toast.success("User updated successfully");
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  }

  const classOptions = Array.isArray(classes)
    ? classes.map((c) => ({
        label: c.name,
        value: c._id,
      }))
    : [];
  const subjectOptions = Array.isArray(subjects)
    ? subjects.map((s) => ({ label: s.name, value: s._id }))
    : [];
  const roleOptions = role ? [{ label: role, value: role }] : [];

  const pending = form.formState.isSubmitting;
  const showRoleSelector = !isLogin;
  // you can also include teacher is needed
  const showClassSelector = !isLogin && role === "student";
  const showSubjectSelector = !isLogin && role === "teacher";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4 w-full">
          {!isLogin && (
            <CustomInput
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="Jane Doe"
              disabled={pending}
            />
          )}
          {/* role selector */}
          {showRoleSelector && (
            <CustomSelect
              control={form.control}
              name="role"
              label="Role"
              placeholder="Select role"
              options={roleOptions}
              disabled={pending}
            />
          )}
          <div className="col-span-2 space-y-2">
            {/* class */}
            {showClassSelector && (
              <CustomSelect
                control={form.control}
                name="classId"
                label="Class"
                placeholder="Select Class"
                options={classOptions}
                disabled={pending}
                loading={loading}
              />
            )}
            {/* subjects(multiple select is need here) */}
            {showSubjectSelector && (
              <CustomMultiSelect
                control={form.control}
                name="subjectIds"
                label="Subjects"
                placeholder="Select subjects..."
                options={subjectOptions}
                loading={loadingOptions}
                disabled={pending}
              />
            )}
            <CustomInput
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="m@example.com"
              disabled={pending}
            />
          </div>
          <div className="col-span-2">
            <CustomInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder={isUpdate ? "New Password (Optional)" : "Password"}
              disabled={pending}
            />
          </div>
          {type === "create" && (
            <div className="col-span-2">
              <CustomInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder={"Confirm Password"}
                disabled={pending}
              />
            </div>
          )}
          <div className="col-span-2 mt-2">
            <Button type="submit" className="w-full" disabled={pending}>
              {pending
                ? "Processing..."
                : type === "login"
                  ? "Sign In"
                  : type === "create"
                    ? "Create Account"
                    : "Save Changes"}
            </Button>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
};

export default UserForm;
