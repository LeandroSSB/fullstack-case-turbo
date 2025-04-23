import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import Layout from '@/components/Layout';
import UserForm from '@/components/UserForm';
import { User } from '@/interfaces';

export default function EditUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = router.query;

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/users/${id}`);
      return res.data.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: User) => {
      const res = await api.put(`/users/${id}`, values);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/users');
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || 'Erro ao atualizar usuário');
    }
  });

  const handleSubmit = (values: User) => {
    const { name, email } = values;
    mutation.mutate({ name, email: email.toLowerCase() });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Editar Usuário</h1>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <UserForm
            isEdit
            disableEmail
            initialValues={{
              name: user.name,
              email: user.email,
            }}
            onSubmit={handleSubmit}
            loading={mutation.isPending}
            submitText="Salvar Alterações"
          />
        )}
      </div>
    </Layout>
  );
}
