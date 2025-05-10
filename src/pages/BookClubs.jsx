import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBookClub, deleteBookClub, getBookClub } from "../services/api";
import { Users, Plus, Trash2, MessageSquare, BookOpen } from "lucide-react";

export default function BookClubs() {
  const [bookClubs, setBookClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [newClub, setNewClub] = useState({
    name: "",
    description: "",
    bookTitle: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Fetch all book clubs when the component mounts
  useEffect(() => {
    const fetchBookClubs = async () => {
      setLoading(true);
      try {
        // Since the API doesn't have an endpoint to fetch all book clubs,
        // we'll simulate it by making multiple requests for IDs 1-10
        // In a real app, you would have a proper endpoint for this
        const requests = [];
        for (let i = 1; i <= 10; i++) {
          requests.push(
            getBookClub(i).catch(() => ({ data: null })) // Ignore errors for non-existent IDs
          );
        }

        const responses = await Promise.all(requests);
        const validClubs = responses
          .filter((response) => response.data !== null)
          .map((response) => response.data);

        setBookClubs(validClubs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book clubs:", err);
        setError("Failed to load book clubs. Please try again.");
        setLoading(false);
      }
    };

    fetchBookClubs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClub({ ...newClub, [name]: value });
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();

    try {
      const response = await createBookClub(newClub);
      setBookClubs([...bookClubs, response.data]);
      setNewClub({ name: "", description: "", bookTitle: "" });
      setFormVisible(false);
      setSuccessMessage("Book club created successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error creating book club:", err);
      setError("Failed to create book club. Please try again.");
    }
  };

  const handleDeleteClub = async (id) => {
    try {
      await deleteBookClub(id);
      setBookClubs(bookClubs.filter((club) => club.id !== id));
      setSuccessMessage("Book club deleted successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error deleting book club:", err);
      setError("Failed to delete book club. Please try again.");
    }
  };

  const handleViewClub = (id) => {
    navigate(`/book-club/${id}`);
  };

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
          <Users size={28} className="text-black mr-3" />
          <h1 className="text-3xl font-bold text-black">Book Clubs</h1>
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
              <span>Create Club</span>
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

      {/* Create Book Club Form */}
      {formVisible && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Create New Book Club
            </h2>
            <form onSubmit={handleCreateClub}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-black font-medium mb-1"
                >
                  Club Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={newClub.name}
                  onChange={handleChange}
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
                  value={newClub.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="bookTitle"
                  className="block text-black font-medium mb-1"
                >
                  Current Book
                </label>
                <input
                  type="text"
                  id="bookTitle"
                  name="bookTitle"
                  required
                  value={newClub.bookTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Create Book Club
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Book Clubs Grid */}
      {bookClubs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-black mb-2">
            No book clubs found
          </h3>
          <p className="text-black mb-4">
            Create a new book club to get started
          </p>
          <button
            onClick={() => setFormVisible(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Create Your First Club
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-black mb-1 truncate">
                  {club.name}
                </h3>
                <p className="text-black text-sm flex items-center mb-3">
                  <BookOpen size={16} className="mr-1" />
                  {club.bookTitle}
                </p>
                <p className="text-black text-sm line-clamp-3 mb-4">
                  {club.description}
                </p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleViewClub(club.id)}
                    className="flex items-center text-sm text-white bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
                  >
                    <MessageSquare size={16} className="mr-1" />
                    <span>View Discussions</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClub(club.id);
                    }}
                    className="text-white bg-red-500 p-1 rounded hover:bg-red-600"
                    aria-label="Delete club"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
