import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import Layout from "@/components/Layout";
import UserForm from "@/components/UserForm";
import { User } from "@/interfaces";


export default function CreateUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: User) => {
      const res = await api.post("/users", values);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/users");
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Erro ao criar usuário");
    },
  });

  const handleSubmit = (values: User) => {
    mutation.mutate({
      name: values.name,
      email: values.email.toLocaleLowerCase(),
      password: values.password!,
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Novo Usuário</h1>
        <UserForm
          onSubmit={handleSubmit}
          loading={mutation.isPending}
          submitText="Criar Usuário"
        />
      </div>
    </Layout>
  );
}
