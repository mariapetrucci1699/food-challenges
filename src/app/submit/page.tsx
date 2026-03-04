import { supabase } from "@/lib/supabaseClient";
import SubmitForm from "./SubmitForm";

export default async function SubmitPage() {
  const { data: countries, error } = await supabase
    .from("countries")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-red-600">Error loading countries: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">📝 Submit a Challenge</h1>
      <SubmitForm countries={countries ?? []} />
    </main>
  );
}