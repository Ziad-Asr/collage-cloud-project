import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addBook, getBook } from "../services/api";
import { BookOpen, Plus, Search } from "lucide-react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
    totalPages: 0,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Fetch all books when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // Since the API doesn't have an endpoint to fetch all books,
        // we'll simulate it by making multiple requests for IDs 1-20
        // In a real app, you would have a proper endpoint for this
        const requests = [];
        for (let i = 1; i <= 20; i++) {
          requests.push(
            getBook(i).catch(() => ({ data: null })) // Ignore errors for non-existent IDs
          );
        }

        const responses = await Promise.all(requests);
        const validBooks = responses
          .filter((response) => response.data !== null)
          .map((response) => response.data);

        setBooks(validBooks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert totalPages to number if needed
    if (name === "totalPages") {
      setNewBook({
        ...newBook,
        [name]: parseInt(value, 10) || 0,
      });
    } else {
      setNewBook({
        ...newBook,
        [name]: value,
      });
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();

    try {
      const response = await addBook(newBook);
      setBooks([...books, response.data]);
      setNewBook({ title: "", author: "", description: "", totalPages: 0 });
      setFormVisible(false);
      setSuccessMessage("Book added successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error creating book:", err);
      setError("Failed to add book. Please try again.");
    }
  };

  const handleViewBook = (id) => {
    navigate(`/book/${id}`);
  };

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <BookOpen size={28} className="text-black mr-3" />
          <h1 className="text-3xl font-bold text-black">Books</h1>
        </div>
        <button
          onClick={() => setFormVisible(!formVisible)}
          className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {formVisible ? (
            "Cancel"
          ) : (
            <>
              <Plus size={16} />
              <span>Add Book</span>
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div
          className="bg-green-50 border border-green-300 text-black px-4 py-3 rounded mb-6"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {error && (
        <div
          className="bg-red-50 border border-red-300 text-black px-4 py-3 rounded mb-6"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for books or authors..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Add Book Form */}
      {formVisible && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Add New Book
            </h2>
            <form onSubmit={handleCreateBook}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-black font-medium mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={newBook.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="author"
                  className="block text-black font-medium mb-1"
                >
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  required
                  value={newBook.author}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-black font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows="3"
                  value={newBook.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="totalPages"
                  className="block text-black font-medium mb-1"
                >
                  Total Pages
                </label>
                <input
                  type="number"
                  id="totalPages"
                  name="totalPages"
                  min="1"
                  required
                  value={newBook.totalPages}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Add Book
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-black mb-2">
            No books found
          </h3>
          <p className="text-black mb-4">Add your first book to get started</p>
          <button
            onClick={() => setFormVisible(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:translate-y-[-5px]"
              onClick={() => handleViewBook(book.id)}
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-black mb-1 truncate">
                  {book.title}
                </h3>
                <p className="text-black text-sm mb-3">by {book.author}</p>
                <p className="text-black text-sm line-clamp-3 mb-4">
                  {book.description}
                </p>
                <div className="text-black text-sm">
                  {book.totalPages} pages
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
