import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Library,
  BookOpen,
  Users,
  LogOut,
  User,
  Menu,
  X,
  Search,
} from "lucide-react";

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to books page with search query
    if (searchTerm.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center space-x-2">
                <Library size={24} />
                <span className="text-xl font-bold">MyBookShelf</span>
              </NavLink>
            </div>

            {/* Search bar - hidden on mobile */}
            {isAuthenticated && (
              <div className="hidden md:flex relative flex-1 max-w-lg mx-6">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-indigo-300" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 rounded-full bg-indigo-600 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Search books, authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-indigo-200">{user?.fullName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 rounded-full hover:bg-indigo-500 transition"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 rounded-full hover:bg-indigo-500 transition"
                >
                  <LogOut size={16} />
                  <span>Login</span>
                </NavLink>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-indigo-700 pb-4 px-4">
            {isAuthenticated && (
              <div className="mb-4">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-indigo-300" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 rounded-full bg-indigo-600 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Search books, authors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            )}

            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="border-b border-indigo-600 pb-2 mb-2">
                  <div className="flex items-center space-x-2 text-indigo-200 mb-2">
                    <User size={16} />
                    <span>{user?.fullName}</span>
                  </div>
                </div>
                <NavLink
                  to="/library"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded-lg ${
                      isActive ? "bg-indigo-800" : "hover:bg-indigo-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Library size={20} />
                  <span>My Library</span>
                </NavLink>
                <NavLink
                  to="/books"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded-lg ${
                      isActive ? "bg-indigo-800" : "hover:bg-indigo-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen size={20} />
                  <span>Books</span>
                </NavLink>
                <NavLink
                  to="/book-clubs"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded-lg ${
                      isActive ? "bg-indigo-800" : "hover:bg-indigo-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users size={20} />
                  <span>Book Clubs</span>
                </NavLink>
                 <NavLink
                  to="/Recommendations"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 p-2 rounded-lg ${
                      isActive ? "bg-indigo-800" : "hover:bg-indigo-600"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users size={20} />
                  <span>Recommendations</span>
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full space-x-2 p-2 text-left rounded-lg text-red-200 hover:bg-indigo-600"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <NavLink
                  to="/login"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogOut size={20} />
                  <span>Login</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Register</span>
                </NavLink>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar - Only visible when authenticated and on desktop */}
        {isAuthenticated && (
          <aside className="hidden md:block w-64 bg-white border-r border-gray-200">
            <div className="p-4">
              <nav>
                <ul className="space-y-2">
                  <li>
                    <NavLink
                      to="/library"
                      className={({ isActive }) =>
                        `flex items-center space-x-3 w-full p-3 rounded-lg ${
                          isActive
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <Library size={20} />
                      <span className="font-medium">My Library</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/books"
                      className={({ isActive }) =>
                        `flex items-center space-x-3 w-full p-3 rounded-lg ${
                          isActive
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <BookOpen size={20} />
                      <span className="font-medium">Books</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/book-clubs"
                      className={({ isActive }) =>
                        `flex items-center space-x-3 w-full p-3 rounded-lg ${
                          isActive
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <Users size={20} />
                      <span className="font-medium">Book Clubs</span>
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <main className="py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
