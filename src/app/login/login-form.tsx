import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../server/auth/auth";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username required" }),
  password: z.string().min(1, { message: "Password required" }),
});

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      loginSchema.parse({ username, password });

      await auth(username, password);
      router.push("/chat");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Invalid password. Please try again.");
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <section className="card bg-base-300 shadow-md w-full max-w-md p-10 rounded-md">
        <header>
          <h1 className="text-3xl font-bold text-center mb-4">Slowpoke</h1>
          <p className="text-m text-center">
            Welcome to the slow group messaging app
          </p>
        </header>
      </section>

      <section className="card bg-base-300 shadow-md w-full max-w-md p-10 rounded-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow-sm bg-base-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow-sm bg-base-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold  bg-black rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
