import { Form } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <Form className="flex flex-col space-y-2" method="post">
        <label>
          Your Name:{" "}
          <input
            id="name"
            name="name"
            type="name"
            className="rounded-xl border border-gray-50 px-2 text-gray-800"
            placeholder="Your name"
          />
        </label>
        <button className="rounded-xl bg-blue-500 text-white" type="submit">
          Join Call
        </button>
      </Form>
    </main>
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");

  return redirect(`room?name=${name}`);
}
