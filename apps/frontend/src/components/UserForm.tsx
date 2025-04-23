import { User } from '@/interfaces';
import { useState, useEffect } from 'react';

type Props = {
  initialValues?: {
    name?: string;
    email?: string;
    password?: string;
  };
  onSubmit: (values: { name: string; email: string; password?: string }) => void;
  submitText?: string;
  loading?: boolean;
  disableEmail?: boolean;
  isEdit?: boolean;
};

export default function UserForm({
  initialValues,
  onSubmit,
  submitText = 'Salvar',
  loading = false,
  disableEmail = false,
  isEdit = false,
}: Props) {
  const [name, setName] = useState(initialValues?.name || '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || '');
      setEmail(initialValues.email || '');
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, password: isEdit ? undefined : password } as User);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Nome"
        className="border p-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="E-mail"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={disableEmail}
      />
      {!isEdit && (
        <input
          type="password"
          placeholder="Senha"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Salvando...' : submitText}
      </button>
    </form>
  );
}
