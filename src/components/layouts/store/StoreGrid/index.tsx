"use client";

import { School } from "lucide-react";
import { useRef } from "react";
import { useStore } from "../../../../hooks/useStore";
import { StoreItem } from "../../../../types/api";
import Button from "../../../common/Button";
import Header from "../Header";
import StoreCard from "./StoreCard";

export default function StoreGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { 
    stores,
    loading, 
    error, 
    pagination, 
    setPage, 
    setCategory, 
    setSearch 
  } = useStore();

  const [universityFilter, setUniversityFilter] = useState<string | undefined>();

  const scrollToTop = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStoreClick = (store: any) => {
    console.log("Store clicked:", store);
  };

  const handleSearch = (query: string) => {
    setSearch(query || undefined);
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category === "All" ? undefined : category);
  };

  const handleUniversityChange = (university: string) => {
    setUniversityFilter(university === "All" ? undefined : university);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    scrollToTop();
  };

  const filteredStores = universityFilter
    ? stores.filter((s: any) => s.university === universityFilter)
    : stores;

  return (
    <div data-testid="stores" ref={sectionRef}>
      <Header onSearch={handleSearch} onCategoryChange={handleCategoryChange} onUniversityChange={handleUniversityChange} />

      <section className="max-w-[1120px] w-full mx-auto flex flex-col gap-[50px] py-12 md:py-[100px] px-6 lg:px-0">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <h3 className="text-primary text-4xl md:text-5xl font-semibold">
              Browse through stores
            </h3>
            <p className="text-secondary text-lg mt-1">
              Explore specialty stores with collections of premium products
            </p>
          </div>
          <Button
            href="/signup"
            className="flex items-center justify-center px-3 py-2.5 gap-1.5 min-w-40 my-6"
            isIconOnly={false}
            ariaLabel="Sign Up for Univyx"
          >
            <p className="text-base font-semibold">Register</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M4.1665 10H15.8332M15.8332 10L10.8332 5M15.8332 10L10.8332 15"
                stroke="#FCFCFC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-gray-500 text-lg">Loading stores...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : !filteredStores || filteredStores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <School size={48} className="mx-auto text-gray-400 mb-3" />
            <h4 className="text-2xl font-semibold text-primary mb-2">
              No stores found
            </h4>
            <p className="text-secondary max-w-md">
              We couldn't find any stores matching your search criteria. Try
              adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearch(undefined);
                setCategory(undefined);
              }}
              className="mt-6 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onClick={() => handleStoreClick(store)}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center">
                <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`flex items-center justify-center ${
                      pagination.page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-primary hover:text-primary/80"
                    }`}
                    aria-label="Previous page"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <span className="text-primary font-medium">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`flex items-center justify-center ${
                      pagination.page === pagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-primary hover:text-primary/80"
                    }`}
                    aria-label="Next page"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
