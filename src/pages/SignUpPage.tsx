import { Link } from "react-router-dom";
import SignUp from "../components/auth/SignUp";
import UnivyxLogo from "../assets/images/univyx-logo.svg";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img
              src={UnivyxLogo}
              alt="Univyx logo"
              className="h-16 mx-auto"
            />
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <SignUp />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}