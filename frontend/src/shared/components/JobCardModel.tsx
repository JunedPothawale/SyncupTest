"use client";

import {
    MapPin,
    Briefcase,
    DollarSign,
    Clock,
    Bookmark,
} from "lucide-react";

export default function JobCard({ job, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition cursor-pointer"
        >
            <div className="flex justify-between items-start">

                {/* LEFT */}
                <div className="flex gap-4">

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                        {job.company?.[0]}
                    </div>

                    {/* Content */}
                    <div>
                        <h3 className="text-[16px] font-semibold text-gray-900">
                            {job.title}
                        </h3>

                        <p className="text-[14px] text-gray-500 mt-1">
                            {job.company}
                        </p>

                        {/* META */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-[13px] text-gray-500">

                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                            </span>

                            <span className="flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" />
                                {job.type}
                            </span>

                            {job.salary && (
                                <span className="flex items-center gap-1.5">
                                    <DollarSign className="w-3.5 h-3.5" />
                                    {job.salary}
                                </span>
                            )}

                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                2 days ago
                            </span>

                        </div>

                        {/* DESCRIPTION */}
                        <p className="text-[14px] text-gray-600 mt-3 leading-relaxed max-w-150">
                            {job.description}
                        </p>

                        {/* SKILLS */}
                        {job.skills && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {job.skills.map((skill: string) => (
                                    <span
                                        key={skill}
                                        className="text-[12px] bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                {/* RIGHT ACTION */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                    <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-700" />
                </button>

            </div>
        </div>
    );
}