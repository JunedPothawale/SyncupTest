"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/shared/services/job.service";
import JobCard from "@/shared/components/JobCardModel";
import { useDebounce } from "@/shared/hooks/useDebounce";
import ApplyModel from "@/shared/components/ApplyModel";
import Filters from "@/shared/components/Filters";
import { MapPin, Search } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import { useAuthStore } from "@/shared/store/auth.store";
import { sendRegister, socket } from "@/shared/lib/socket";
export default function Home() {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    type: [] as string[],
  });

  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [open, setOpen] = useState(false);

  // 🔥 debounce
  const debouncedKeyword = useDebounce(filters.keyword, 400);
  const debouncedLocation = useDebounce(filters.location, 400);

  const finalFilters = useMemo(() => ({
    keyword: debouncedKeyword,
    location: debouncedLocation,
    type: filters.type.join(","), // API format
  }),
    [debouncedKeyword, debouncedLocation, filters.type]
  );

  // 🚀 QUERY
  const { data, isLoading, isFetching } = useQuery({

    queryKey: [
      "jobs",
      finalFilters,
      page,
    ],

    queryFn: () =>
      getJobs({
        ...finalFilters,
        page,
        limit: 10,
      }),

    placeholderData: (
      previousData
    ) => previousData,
  });

  const jobs = data?.jobs || [];
  const totalPages = data?.pages || 1;

  // 🔥 reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [finalFilters]);

  const openModal = (job: any) => {
    setSelectedJob(job);
    setOpen(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {/* HERO */}
      <div className="bg-[#dfe6f3] py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h1 className="text-[40px] font-bold text-gray-900">
            Find Your Dream Job Today
          </h1>

          <p className="text-gray-600 mt-3 text-[16px]">
            Discover opportunities from top companies worldwide
          </p>

          {/* SEARCH */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-4xl">

              <div className="flex items-center gap-2 px-4 py-3 flex-1">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  placeholder="Job title, keywords, or company"
                  className="w-full outline-none text-sm"
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      keyword: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="h-8 w-px bg-gray-200" />

              <div className="flex items-center gap-2 px-4 py-3 w-52">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  placeholder="Location"
                  className="w-full outline-none text-sm"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      location: e.target.value,
                    }))
                  }
                />
              </div>

              <button className="bg-blue-600 text-white px-6 py-3 m-1 rounded-xl">
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-[280px_1fr] gap-6">
        {/* ✅ FIXED FILTER META */}
        <Filters
          filters={filters}
          setFilters={setFilters}
          meta={data?.filters}   // 🔥 THIS WAS YOUR BUG
        />

        {/* JOB LIST */}
        <div className="flex-1 space-y-5">

          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-400">No jobs found</p>
          ) : (
            jobs.map((job: any) => (
              <div
                key={job._id}
                onClick={() => openModal(job)}
                className="cursor-pointer"
              >
                <JobCard job={job} />
              </div>
            ))
          )}

          {/* PAGINATION */}
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 2), page + 2)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg border ${p === page ? "bg-blue-600 text-white" : ""
                    }`}
                >
                  {p}
                </button>
              ))}

            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ApplyModel
        job={selectedJob}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}