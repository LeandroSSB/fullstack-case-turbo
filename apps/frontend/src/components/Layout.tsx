import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div>
      {isLogged && (
        <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Painel de Usuários</h1>
          <button
            onClick={logout}
            className="bg-white text-blue-600 font-medium px-3 py-1 rounded hover:bg-gray-100"
          >
            Sair
          </button>
        </header>
      )}

      <main className="p-6">{children}</main>
    </div>
  );
}
