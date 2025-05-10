import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBook,
  updateReadingProgress,
  getReadingProgress,
  addBookToLibrary,
} from "../services/api";
import { BookOpen, Clock, Award, Plus, Library } from "lucide-react";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readingProgress, setReadingProgress] = useState({
    pagesRead: 0,
    readingGoal: 0,
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        // Fetch book details
        const bookResponse = await getBook(id);
        setBook(bookResponse.data);

        // Fetch reading progress for this book
        try {
          const progressResponse = await getReadingProgress(id);
          if (progressResponse.data && progressResponse.data.pagesRead) {
            setReadingProgress({
              pagesRead: progressResponse.data.pagesRead.pagesRead,
              readingGoal: progressResponse.data.pagesRead.readingGoal,
            });
          }
        } catch {
          // If no progress exists yet, that's ok
          console.log("No reading progress found for this book");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again.");
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  const handleReadingProgressChange = (e) => {
    const { name, value } = e.target;
    setReadingProgress({
      ...readingProgress,
      [name]: parseInt(value, 10) || 0,
    });
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();

    try {
      await updateReadingProgress(
        id,
        readingProgress.pagesRead,
        readingProgress.readingGoal
      );

      setSuccessMessage("Reading progress updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating reading progress:", err);
      setError("Failed to update reading progress. Please try again.");
    }
  };

  const handleAddToLibrary = async () => {
    try {
      await addBookToLibrary(id);
      setSuccessMessage("Book added to your library!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error adding book to library:", err);
      setError("Failed to add book to your library. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Book not found
          </h3>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage =
    book.totalPages > 0
      ? Math.min(
          Math.round((readingProgress.pagesRead / book.totalPages) * 100),
          100
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600">by {book.author}</p>
            </div>
            <button
              onClick={handleAddToLibrary}
              className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              <Plus size={16} />
              <span>Add to Library</span>
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-700">{book.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <BookOpen size={20} className="mr-2 text-indigo-600" />
                Book Details
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-3">
                  <span className="text-gray-600 font-medium">
                    Total Pages:
                  </span>
                  <span className="ml-2 text-gray-900">{book.totalPages}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Clock size={20} className="mr-2 text-indigo-600" />
                Reading Progress
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">
                      Progress: {progressPercentage}%
                    </span>
                    <span className="text-gray-700">
                      {readingProgress.pagesRead} / {book.totalPages} pages
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <form onSubmit={handleUpdateProgress}>
                  <div className="mb-3">
                    <label
                      htmlFor="pagesRead"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Pages Read
                    </label>
                    <input
                      type="number"
                      id="pagesRead"
                      name="pagesRead"
                      min="0"
                      max={book.totalPages}
                      value={readingProgress.pagesRead}
                      onChange={handleReadingProgressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="readingGoal"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Daily Reading Goal (pages)
                    </label>
                    <input
                      type="number"
                      id="readingGoal"
                      name="readingGoal"
                      min="0"
                      value={readingProgress.readingGoal}
                      onChange={handleReadingProgressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Update Progress
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
