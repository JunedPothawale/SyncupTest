"use client";

import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  Share2,
  X,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { checkAuth } from "../services/auth.service";


export default function ApplyModel({ job, open, onClose }: any) {
  if (!job) return null;
  const router = useRouter();

  const handleApplyClick = async () => {
    const isLoggedIn = await checkAuth();

    const redirectUrl = `/jobs/${job._id}?apply=false`;

    if (!isLoggedIn) {
      console.log("OK")
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }
    router.push(redirectUrl);
  };


  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center px-4"
        >

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.96, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-180 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >

            {/* HEADER */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
              <h2 className="text-[16px] font-semibold text-gray-900">
                Job Details
              </h2>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* BODY */}
            <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">

              {/* TOP */}
              <div className="flex gap-4">

                {/* Avatar */}
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
                  {job.company?.[0]}
                </div>

                {/* Info */}
                <div className="flex-1">

                  <h3 className="text-[20px] font-semibold text-gray-900 leading-7">
                    {job.title}
                  </h3>

                  <p className="text-[14px] text-gray-500 mt-1">
                    {job.company}
                  </p>

                  {/* META */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-[13px] text-gray-500">

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {job.type}
                    </div>

                    {job.salary && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        {job.salary}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      2 days ago
                    </div>

                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3 mt-6">

                <button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium rounded-lg transition" onClick={handleApplyClick}>
                  Apply Now
                </button>

                <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
                  <Bookmark className="w-5 h-5 text-gray-600" />
                </button>

                <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>

              </div>

              {/* SKILLS */}
              {job.skills && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {job.skills.map((s: string) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full text-[12px] bg-gray-100 text-gray-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* CONTENT */}
              <div className="mt-6 space-y-6">

                <Section title="About the Role">
                  {job.description}
                </Section>

                <ListSection
                  title="Key Responsibilities"
                  items={job.responsibilities}
                />

                <ListSection
                  title="Requirements"
                  items={job.requirements}
                />

                <ListSection
                  title="Benefits"
                  items={job.benefits}
                />

                {/* COMPANY */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-gray-900">
                    <Building2 className="w-4 h-4" />
                    About {job.company}
                  </div>

                  <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                    {job.companyDescription ||
                      "Company information not available."}
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* 🔷 Reusable Sections */

function Section({ title, children }: any) {
  return (
    <div>
      <h4 className="text-[14px] font-semibold text-gray-900">
        {title}
      </h4>
      <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function ListSection({ title, items }: any) {
  if (!items) return null;

  return (
    <div>
      <h4 className="text-[14px] font-semibold text-gray-900">
        {title}
      </h4>
      <ul className="mt-2 space-y-2 text-[13px] text-gray-600 leading-relaxed">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 w-1 h-1 bg-blue-600 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}