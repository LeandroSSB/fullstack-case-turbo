export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Bem-vindo ao sistema de usuários!</h1>
      <p className="mt-4 text-lg">
        Clique no botão abaixo para acessar a lista de usuários.
      </p>
      <a
        href="/login"
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Logar
      </a>
      <br />
      <a
        href="/users"
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ir para Usuários
      </a>
    </div>
  );
}
