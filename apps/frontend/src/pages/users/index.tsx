import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/interfaces";



export default function UserListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLogged, setIsLogged] = useState(false);

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Erro ao deletar");
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, [router]);

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const { data = [], isLoading, isError } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return Array.isArray(res.data.data)? res.data.data : [res.data.data];
    },
  });

  if (isLoading)
    return <p className="text-center mt-10">Carregando usuários...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-600">
        Erro ao carregar usuários
      </p>
    );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Usuários</h1>
          <button
            onClick={() => router.push("/users/create")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Novo Usuário
          </button>
        </div>

        <ul className="space-y-3">
          {data?.map((user) => (
            <li
              key={user.id}
              className="p-4 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              {isLogged ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/users/${user.id}/edit`)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id!)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              ) : (
                <span className="text-gray-400 italic text-sm">
                  Somente visualização
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
