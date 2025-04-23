import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    },
    onSuccess: ({ data }) => {
      localStorage.setItem("token", data.access_token);
      router.push("/users");
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Erro ao fazer login");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
