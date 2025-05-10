import { useState, useEffect } from "react";
import { getUserLibrary, removeBookFromLibrary } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Library as LibraryIcon, Trash2, Book } from "lucide-react";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await getUserLibrary();
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching library:", err);
        setError("Failed to load your library. Please try again.");
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const handleViewBook = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleRemoveBook = async (bookId) => {
    try {
      await removeBookFromLibrary(bookId);
      // Update the books state after successful removal
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (err) {
      console.error("Error removing book:", err);
      setError("Failed to remove book from library. Please try again.");
    }
  };

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
        <LibraryIcon size={28} className="text-indigo-700 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {books.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <Book size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Your library is empty
          </h3>
          <p className="text-gray-500 mb-4">
            Start adding books to build your collection
          </p>
          <button
            onClick={() => navigate("/books")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Explore Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewBook(book.id)}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveBook(book.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      aria-label="Remove from library"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
