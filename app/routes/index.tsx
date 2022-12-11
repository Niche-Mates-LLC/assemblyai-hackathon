import { Form } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <Form className="flex flex-col space-y-2" method="post">
        <label>
          <input
            id="name"
            name="name"
            type="name"
            className="rounded-xl border border-gray-50 px-4 py-3 text-gray-800"
            placeholder="Your name"
          />
        </label>
        <label>
          <input
            id="email"
            name="email"
            type="email"
            className="rounded-xl border border-gray-50 px-4 py-3 text-gray-800"
            placeholder="Your email"
          />
        </label>
        <button
          className="flex items-center justify-center rounded-xl bg-purple-500 py-2 font-bold text-white"
          type="submit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6 self-start text-purple-300"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
        </button>
      </Form>
    </main>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");

  return redirect(`room?name=${name}&email=${email}`);
}
