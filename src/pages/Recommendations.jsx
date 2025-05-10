import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Recommendations() {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get("http://localhost:5004/api/Book/recommended");
        setRecommendedBooks(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations. Please try again.");
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recommended Books</h1>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendedBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px]"
          >
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                {book.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">by {book.author}</p>
              <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                {book.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm">
                  {book.totalPages} pages
                </span>
                <button
                  onClick={() => navigate(`/book/${book.id}`)}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}