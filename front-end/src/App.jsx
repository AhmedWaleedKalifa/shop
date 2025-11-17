import { useEffect, useState } from "react";
import { categoryService } from "../src/services/categoryService"
// import { getApiError } from "../utils/getApiError";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await categoryService.getAll();
console.log("API response:", data);
setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (error) {
        // setErrorMsg(getApiError(error));
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  // if (errorMsg) {
  //   return (
  //     <div className="text-center py-10 text-red-500 font-semibold">
  //       {errorMsg}
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">All Categories</h2>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 border rounded-lg shadow-sm flex items-center gap-4"
          >
            {cat.imageUrl && (
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-20 h-20 object-cover rounded"
              />
            )}

            <div>
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <p className="text-gray-600">{cat.description}</p>
              <p className="text-sm text-gray-500">
                Button: {cat.buttonText}
              </p>
              <p className="text-sm text-gray-500">
                Display Order: {cat.displayOrder}
              </p>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-gray-600 text-center py-6">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}
