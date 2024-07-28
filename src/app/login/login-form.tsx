import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../server/auth/auth";
import { z } from "zod";
import Error from "../_components/error"; // Adjust the import path as necessary

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username required" }),
  password: z.string().min(1, { message: "Password required" }),
});

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
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
          <h1 className="text-3xl font-bold text-center mb-4">Slowbroß</h1>
          <p className="text-m text-center">
            Welcome to the slow group messaging app
          </p>
        </header>
      </section>

      <section className="card bg-base-300 shadow-md w-full max-w-md p-10 rounded-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col items-center justify-center">
            <label className="block text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="mb-4 flex flex-col items-center justify-center">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            {error && (
              <div className="w-full max-w-xs mb-4">
                <Error message={error} onClose={() => setError(null)} />
              </div>
            )}
            <button type="submit" className="btn w-full max-w-xs">
              Login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
