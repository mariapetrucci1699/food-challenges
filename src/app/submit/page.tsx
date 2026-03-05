import { supabase } from "@/lib/supabaseClient";
import SubmitForm from "./SubmitForm";

type CountryOption = { id: string; name: string };
type CategoryOption = { id: string; name: string; slug: string };

export default async function SubmitPage() {
  const { data: countries, error: countriesError } = await supabase
    .from("countries")
    .select("id, name")
    .order("name", { ascending: true });

  if (countriesError) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-red-600">
          Error loading countries: {countriesError.message}
        </p>
      </main>
    );
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (categoriesError) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-red-600">
          Error loading categories: {categoriesError.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">📝 Submit a Challenge</h1>

      <SubmitForm
        countries={(countries ?? []) as CountryOption[]}
        categories={(categories ?? []) as CategoryOption[]}
      />
    </main>
  );
}