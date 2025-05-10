import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBookClub,
  createDiscussionPost,
  deleteDiscussionPost,
  getDiscussionPost,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Users, BookOpen, MessageSquare, Send, Trash2 } from "lucide-react";

export default function BookClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookClub, setBookClub] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPost, setNewPost] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchBookClubData = async () => {
      try {
        const response = await getBookClub(id);
        setBookClub(response.data);

        // Fetch all discussion posts
        await fetchDiscussionPosts();
      } catch (err) {
        console.error("Error fetching book club details:", err);
        setError("Failed to load book club details. Please try again.");
        setLoading(false);
      }
    };

    fetchBookClubData();
  }, [id]);

  const fetchDiscussionPosts = async () => {
    try {
      // Since the API doesn't have an endpoint to fetch all discussions for a club,
      // we'll simulate it by making multiple requests for IDs 1-20
      const requests = [];
      for (let i = 1; i <= 20; i++) {
        requests.push(
          getDiscussionPost(i).catch(() => ({ data: null })) // Ignore errors for non-existent IDs
        );
      }

      const responses = await Promise.all(requests);
      const validPosts = responses
        .filter(
          (response) =>
            response.data !== null &&
            response.data.bookClubId === parseInt(id, 10)
        )
        .map((response) => response.data);

      setDiscussions(validPosts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching discussion posts:", err);
      setError("Failed to load discussions. Please try again.");
      setLoading(false);
    }
  };

  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!newPost.trim()) return;

    try {
      const currentDate = new Date().toISOString();
      const postData = {
        bookClubId: parseInt(id, 10),
        userId: user?.id || 1, // Fallback to a default user ID if not available
        bookTitle: bookClub.bookTitle,
        content: newPost,
        postedAt: currentDate,
      };

      const response = await createDiscussionPost(postData);

      // Add the new post to the discussions list
      setDiscussions([
        ...discussions,
        {
          ...response.data,
          userName: user?.fullName || "Anonymous", // Adding the user's name for display
        },
      ]);

      setNewPost("");
      setSuccessMessage("Post created successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error creating discussion post:", err);
      setError("Failed to create post. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDiscussionPost(postId);

      // Remove the deleted post from the discussions list
      setDiscussions(discussions.filter((post) => post.id !== postId));

      setSuccessMessage("Post deleted successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error deleting discussion post:", err);
      setError("Failed to delete post. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-50 border border-red-300 text-black px-4 py-3 rounded"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => navigate("/book-clubs")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Back to Book Clubs
        </button>
      </div>
    );
  }

  if (!bookClub) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-black mb-2">
            Book club not found
          </h3>
          <button
            onClick={() => navigate("/book-clubs")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to Book Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/book-clubs")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Book Clubs
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Users size={24} className="text-black mr-2" />
            <h1 className="text-2xl font-bold text-black">{bookClub.name}</h1>
          </div>
          <div className="flex items-center text-black mb-4">
            <BookOpen size={18} className="mr-2" />
            <span>Currently reading: {bookClub.bookTitle}</span>
          </div>
          <p className="text-black mb-6">{bookClub.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <MessageSquare size={24} className="text-black mr-2" />
            <h2 className="text-xl font-semibold text-black">Discussions</h2>
          </div>

          <form onSubmit={handleCreatePost} className="mb-8">
            <div className="mb-4">
              <label
                htmlFor="newPost"
                className="block text-black font-medium mb-2"
              >
                Add to the discussion
              </label>
              <textarea
                id="newPost"
                rows="3"
                value={newPost}
                onChange={handlePostChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your thoughts..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={!newPost.trim()}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              <span>Post</span>
            </button>
          </form>

          {discussions.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <MessageSquare size={36} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-black mb-1">
                No discussions yet
              </h3>
              <p className="text-black">Be the first to start a discussion!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {discussions.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-black">
                        {post.userName || "Anonymous"}
                      </span>
                      <span className="text-black text-sm ml-2">
                        {new Date(post.postedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-white bg-red-500 p-1 rounded hover:bg-red-600"
                      aria-label="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-black">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
