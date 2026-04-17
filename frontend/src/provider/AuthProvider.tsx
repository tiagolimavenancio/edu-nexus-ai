import { createContext, useContext, useEffect, useState } from "react";
import type { IAcademicYear } from "@/types/AcademicYear";
import type { IUser } from "@/types/User";
import { api } from "@/lib/api";

const AuthContext = createContext<{
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  loading: boolean;
  year: IAcademicYear | null;
}>({
  user: null,
  setUser: () => {},
  loading: true,
  year: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [year, setYear] = useState<IAcademicYear | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setUser(data.user);
      } catch (error) {
        console.log({ error });
        setLoading(false);
        setUser(null);
      }
    };

    const fetchYear = async () => {
      try {
        const { data } = await api.get("/academic-years/current");
        setLoading(false);
        setYear(data);
      } catch (error) {
        console.log({ error });
        setLoading(false);
        setYear(null);
      }
    };

    checkAuth();
    fetchYear();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, year }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
