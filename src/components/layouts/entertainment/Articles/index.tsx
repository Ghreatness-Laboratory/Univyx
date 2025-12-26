import { ChevronRight, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useArticles } from "../../../../hooks/useEntertainment";
import { useAuth } from "../../../../context/AuthContext";
import ArticleCard from "./ArticlesCard";

const categoryOptions = [
  { value: "Student Life", label: "Student Life" },
  { value: "Campus Life", label: "Campus Life" },
  { value: "Travel", label: "Travel" },
  { value: "Advice", label: "Advice" },
  { value: "Opinion", label: "Opinion" },
];

interface ArticleFormData {
  title: string;
  category: { value: string; label: string } | null;
  description: string;
}

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Student Life", "Campus Life", "Travel", "Advice"];
  const [searchTerm, setSearchTerm] = useState("");
  // const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ArticleFormData>({
    defaultValues: {
      title: "",
      category: null,
      description: "",
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    console.log(data);
    navigate("?auth=login");

    // setFormSubmitted(true);

    reset({
      title: "",
      category: null,
      description: "",
    });

    // setTimeout(() => {
    //   setFormSubmitted(false);
    // }, 3000);
  };

  const { articles = [], loading, error, toggleLike, toggleBookmark } = useArticles();
  const { isAuthenticated } = useAuth();

  const filteredArticles = Array.isArray(articles)
    ? articles
        .filter(
          (article) =>
            activeCategory === "All" || article.title?.toLowerCase().includes(activeCategory.toLowerCase())
        )
        .filter(
          (article) =>
            article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.author?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Student Stories
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Authentic perspectives and insights shared by fellow students
        </p>
      </div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full sm:w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
          <Select
            className="w-full sm:w-48"
            classNamePrefix="select"
            options={categories.map((cat) => ({ value: cat, label: cat }))}
            placeholder="Filter by..."
            defaultValue={{ value: "All", label: "All" }}
            onChange={(option) => option && handleCategoryChange(option.value)}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "0.5rem",
                border: "1px solid #D1D5DB",
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
                boxShadow: "none",
                "&:hover": {
                  border: "1px solid #A78BFA",
                },
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#A78BFA"
                  : state.isFocused
                  ? "#EDE9FE"
                  : "white",
                color: state.isSelected ? "white" : "#1F2937",
              }),
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {loading ? (
          <div className="col-span-2 py-16 text-center">
            <p className="text-gray-500 text-lg">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="col-span-2 py-16 text-center">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onLike={() => article.id && toggleLike(article.id)}
              onBookmark={() => article.id && toggleBookmark(article.id)}
              isAuthenticated={isAuthenticated}
            />
          ))
        ) : (
          <div className="col-span-2 py-16 text-center">
            <p className="text-gray-500 text-lg">
              No articles found matching your criteria.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Share Your Story
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have something to share? Write your own article and inspire fellow students with your experiences.
          </p>
        </div>
        {/* {formSubmitted && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
            Your article has been submitted successfully!
          </div>
        )} */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                className={`w-full px-4 py-2 border ${
                  errors.title
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="Enter a catchy title..."
                {...register("title", {
                  required: "Title is required",
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    inputId="category"
                    options={categoryOptions}
                    placeholder="Select a category"
                    {...field}
                    className={`w-full ${
                      errors.category ? "border-red-500" : ""
                    }`}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "0.5rem",
                        border: errors.category
                          ? "1px solid #EF4444"
                          : "1px solid #D1D5DB",
                        padding: "0.2rem",
                        boxShadow: errors.category
                          ? "0 0 0 1px #EF4444"
                          : "none",
                        "&:hover": {
                          border: errors.category
                            ? "1px solid #EF4444"
                            : "1px solid #A78BFA",
                        },
                      }),
                    }}
                  />
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Brief Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={2}
                className={`w-full px-4 py-2 border ${
                  errors.description
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="Write a short summary of your article..."
                {...register("description", {
                  required: "description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started <PlusCircle size={16} className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="text-center">
        <Link
          to={"/entertainment/news"}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors inline-flex items-center"
        >
          See all student articles <ChevronRight size={18} className="ml-1" />
        </Link>
      </div>
    </section>
  );
}
