import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import UnivyxLogo from "../../../../assets/images/univyx-logo.svg";
import Button from "../../../common/Button";

interface Navlink {
  href: string;
  menu: string;
}

const navlinks: Navlink[] = [
  { href: "/", menu: "Home" },
  { href: "/entertainment", menu: "Entertainment" },
  { href: "/academics", menu: "Academics" },
  { href: "/gaming", menu: "Gaming" },
  { href: "/jobs", menu: "Jobs" },
  { href: "/store", menu: "Store" },
];

const dropdownItems = {
  Entertainment: [
    { href: "/entertainment/articles", menu: "Articles" },
    { href: "/entertainment/events", menu: "Events" },
    { href: "/entertainment/news", menu: "News" },
  ],
  Academics: [
    { href: "/academics/resources", menu: "Resources" },
    { href: "/academics/courses", menu: "Courses" },
    { href: "/academics/calendar", menu: "Calendar" },
  ],
  Gaming: [
    { href: "/gaming/tournaments", menu: "Tournaments" },
    { href: "/gaming/leaderboards", menu: "Leaderboards" },
    { href: "/gaming/achievements", menu: "Achievements" },
  ],
};

const fadeInDown = (time: number) => ({
  animation: `fadeInDown ${time}s linear`,
});

const slideIn = (time: number) => ({
  animation: `slideIn ${time}s ease-in-out`,
});

const ActiveMenuIndicator = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="3"
      height="3"
      viewBox="0 0 3 3"
      fill="none"
      className="absolute left-1/2 transform -translate-x-1/2 bottom-0"
    >
      <circle cx="1.5" cy="1.5" r="1.5" fill="#64748B" />
    </svg>
  );
};

export default function Navbar() {
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('Navbar auth state:', { user, isAuthenticated, isLoading });
  }, [user, isAuthenticated, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const fixedHeight = 500;
      if (window.scrollY > fixedHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMobileNavbar = () => {
    setMobileNavbar(!mobileNavbar);
    if (!mobileNavbar) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    }
  };

  const handleDropDownMenu = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleMobileLinkClick = (href: string) => {
    navigate(href);
    setMobileNavbar(false);
    document.body.style.overflow = "unset";
    document.body.style.position = "unset";
    document.body.style.width = "unset";
  };

  return (
    <div
      className={`bg-white transition-all duration-300 ${
        isSticky ? "sticky top-0 z-50 shadow-md" : ""
      }`}
      style={isSticky ? slideIn(0.5) : fadeInDown(0.8)}
    >
      <nav
        className="max-w-[1150px] w-full mx-auto px-4 py-1 flex justify-between items-center relative"
        aria-label="Main navigation"
      >
        <div className="px-1">
          <Link to="/">
            <img
              src={UnivyxLogo}
              alt="Univyx logo and title"
              width={200}
              height={100}
              className="hidden md:block"
            />
          </Link>
          <Link to="/">
            <img
              src={UnivyxLogo}
              alt="Ghreatness Labs logo and title"
              width={120}
              height={90}
              className="block md:hidden"
            />
          </Link>
        </div>

        <ul className="hidden lg:flex items-center relative">
          {navlinks.map((link, index) => {
            const isActive = location.pathname === link.href;
            const isMenuActive =
              "relative text-[#64748B] px-3 transition-all duration-2000ms ease-in-out bottom-1";
            const isDropdownMenu =
              link.menu === "Academics" ||
              link.menu === "Gaming" ||
              link.menu === "Entertainment";

            return (
              <li
                key={index}
                className={`relative flex items-center mr-3 group ${
                  isActive ? "relative" : ""
                }`}
              >
                {isActive && <ActiveMenuIndicator />}
                <div className="flex items-center">
                  <div
                    className={`py-2 px-3 font-semibold leading-5 ${
                      isActive ? isMenuActive : ""
                    }`}
                  >
                    <Link to={link.href}>{link.menu}</Link>
                  </div>
                  {isDropdownMenu && (
                    <Button
                      className="py-2"
                      isIconOnly={true}
                      ariaLabel={`Toggle ${link.menu} dropdown menu`}
                      onClick={() => handleDropDownMenu(link.menu)}
                    >
                      <svg
                        className={`${isActive ? "mb-2" : ""}`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                      >
                        <path
                          d="M16.3334 7.5L10.5001 13.3333L4.66675 7.5"
                          stroke={`${isActive ? "#64748B" : "#616161"}`}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  )}
                </div>

                {isDropdownMenu && activeDropdown === link.menu && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-md z-50 border"
                    style={fadeInDown(0.2)}
                  >
                    <ul className="divide-y">
                      {dropdownItems[link.menu as keyof typeof dropdownItems]?.map((item, index) => (
                        <li key={index}>
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200"
                          >
                            {item.menu}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          ) : isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.full_name?.charAt(0) || user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium">
                  {user?.full_name || (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name) || user?.email?.split('@')[0] || 'User'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    {(user?.is_staff || user?.email?.includes('admin')) && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button
                href="/login"
                className="hidden md:block py-2.5 px-3.5 bg-transparent text-primary border border-primary hover:bg-primary hover:text-white"
                isIconOnly={false}
                ariaLabel="Go to Login page"
                data-testid="login-link"
              >
                <p>Login</p>
              </Button>
              <Button
                href="/signup"
                className="hidden md:block py-2.5 px-3.5"
                isIconOnly={false}
                ariaLabel="Go to Signup page"
                data-testid="signup-link"
              >
                <p>Join Us</p>
              </Button>
            </>
          )}
          
          <Button
            className="block md:hidden py-2.5 px-3.5"
            isIconOnly={true}
            ariaLabel="Toggle mobile menu"
            onClick={handleMobileNavbar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 17H21M3 12H21M3 7H21"
                stroke="#0D0D0D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </nav>

      {mobileNavbar && (
        <>
          {/* Mobile Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={handleMobileNavbar}
          />
          
          {/* Mobile Menu */}
          <nav
            className="fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out lg:hidden"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <img src={UnivyxLogo} alt="Univyx" className="h-8" />
                <span className="font-bold text-gray-800">Menu</span>
              </div>
              <button
                onClick={handleMobileNavbar}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto">
              <ul className="py-4">
                {navlinks.map((link, index) => {
                  const isActive = location.pathname === link.href;
                  const isDropdownMenu = link.menu === "Academics" || link.menu === "Gaming" || link.menu === "Entertainment";
                  
                  return (
                    <li key={index} className="mb-1">
                      <div className="flex items-center">
                        <Link
                          to={link.href}
                          onClick={() => handleMobileLinkClick(link.href)}
                          className={`flex-1 px-6 py-4 font-medium transition-all duration-200 ${
                            isActive 
                              ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {link.menu === 'Home' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                            {link.menu === 'Entertainment' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5V12a1.5 1.5 0 01-1.5 1.5H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            {link.menu === 'Academics' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                            {link.menu === 'Gaming' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>}
                            {link.menu === 'Jobs' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                            {link.menu === 'Store' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                            {link.menu}
                          </span>
                        </Link>
                        {isDropdownMenu && (
                          <button
                            onClick={() => handleDropDownMenu(link.menu)}
                            className="p-4 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={`Toggle ${link.menu} dropdown`}
                          >
                            <svg
                              className={`w-5 h-5 transition-transform duration-200 ${
                                activeDropdown === link.menu ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      {isDropdownMenu && activeDropdown === link.menu && (
                        <ul className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-200 ml-6">
                          {dropdownItems[link.menu as keyof typeof dropdownItems]?.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                to={item.href}
                                onClick={() => handleMobileLinkClick(item.href)}
                                className="block px-6 py-3 text-sm text-gray-600 hover:text-blue-700 hover:bg-white transition-colors"
                              >
                                {item.menu}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-100 bg-gray-50">
              {isLoading ? (
                <div className="p-6 flex items-center justify-center">
                  <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Loading...</span>
                </div>
              ) : !isAuthenticated ? (
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => {
                      window.location.href = '/login';
                      setMobileNavbar(false);
                    }}
                    className="w-full py-3 px-4 text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = '/signup';
                      setMobileNavbar(false);
                    }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    Join Us
                  </button>
                </div>
              ) : (
                <div>
                  {/* User Profile Section */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user?.full_name?.charAt(0) || user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {user?.full_name || (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name) || user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => handleMobileLinkClick('/profile')}
                      className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    {(user?.is_staff || user?.email?.includes('admin')) && (
                      <Link
                        to="/admin"
                        onClick={() => handleMobileLinkClick('/admin')}
                        className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-white hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileNavbar(false);
                        document.body.style.overflow = "unset";
                        document.body.style.position = "unset";
                        document.body.style.width = "unset";
                        navigate('/');
                      }}
                      className="flex items-center gap-3 w-full px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
