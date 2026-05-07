"use client";

import { getJobById } from "@/shared/services/job.service";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResumeUploader from "@/shared/components/ResumeUploader";
import Navbar from "./Navbar";

export default function JobDetailsPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const id = params?.id as string;
    const applyParam = searchParams.get("apply");

    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showApply, setShowApply] = useState(false);

    // fetch job
    useEffect(() => {
        if (!id) return;

        const fetchJob = async () => {
            try {
                const data = await getJobById(id);
                setJob(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    // auto open apply
    useEffect(() => {
        if (applyParam === "true") setShowApply(true);
    }, [applyParam]);

    // lock scroll
    useEffect(() => {
        document.body.style.overflow = showApply ? "hidden" : "auto";
    }, [showApply]);

    const handleApplyClick = () => {
        setShowApply(true);
    };

    if (loading) return <div className="p-10">Loading...</div>;
    if (!job) return <div className="p-10">Job not found</div>;

    return (
        <>
            <Navbar />
            <div className="bg-[#f8fafc] min-h-screen py-10">

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8">

                    {/* LEFT */}
                    <div className="col-span-8 space-y-6">

                        {/* HEADER */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition hover:shadow-md">
                            <div className="flex gap-4">

                                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold text-lg">
                                    {job.company?.[0]}
                                </div>

                                <div>
                                    <h1 className="text-[22px] font-semibold text-gray-900">
                                        {job.title}
                                    </h1>

                                    <p className="text-gray-500 text-sm mt-1">
                                        {job.company}
                                    </p>

                                    <div className="flex gap-5 text-sm text-gray-500 mt-3 flex-wrap">
                                        <span>📍 {job.location}</span>
                                        <span>👜 {job.type}</span>
                                        <span>💰 {job.salary}</span>
                                        <span>⏱ 2 days ago</span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="mt-6 border-t border-gray-100 w-[95%]" />

                            {/* Skills */}
                            <div className="flex gap-2 mt-4 flex-wrap">
                                {job.skills?.map((s: string) => (
                                    <span
                                        key={s}
                                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ABOUT */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                About the Role
                            </h2>

                            <p className="text-gray-600 leading-relaxed text-[15px]">
                                {job.description}
                            </p>
                        </div>

                        {/* REQUIREMENTS */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Requirements
                            </h2>

                            <ul className="space-y-3 text-gray-600 text-sm">
                                {job.requirements?.map((r: string, i: number) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-blue-500">•</span>
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* BENEFITS */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Benefits & Perks
                            </h2>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600">
                                {job.benefits?.map((b: string, i: number) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-blue-500">•</span>
                                        {b}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* COMPANY */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                About {job.company}
                            </h2>

                            <p className="text-gray-600 leading-relaxed text-[15px]">
                                {job.companyDescription}
                            </p>

                            <button className="text-blue-600 mt-4 text-sm hover:underline">
                                Learn more →
                            </button>
                        </div>

                        {/* SIMILAR JOBS */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Similar Jobs
                            </h2>

                            <div className="space-y-4">

                                <div className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition cursor-pointer">
                                    <p className="font-medium">Product Manager</p>
                                    <p className="text-sm text-gray-500">InnovateLabs</p>
                                </div>

                                <div className="border border-blue-200 rounded-xl p-4 hover:bg-blue-50 transition cursor-pointer">
                                    <p className="font-medium">UX/UI Designer</p>
                                    <p className="text-sm text-gray-500">DesignStudio</p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col-span-4 space-y-6">

                        {/* APPLY CARD */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {job.salary}
                            </h2>

                            <p className="text-sm text-gray-500 mb-5">
                                Annual salary
                            </p>

                            <button
                                onClick={handleApplyClick}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
                            >
                                Apply Now
                            </button>

                            <div className="flex gap-3 mt-4">
                                <button className="flex-1 border border-gray-200 rounded-xl py-2 hover:bg-gray-50">
                                    Save
                                </button>
                                <button className="flex-1 border border-gray-200 rounded-xl py-2 hover:bg-gray-50">
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* JOB INFO */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Job Information
                            </h3>

                            <div className="space-y-4 text-sm">
                                {[
                                    { label: "Job Type", value: job.type },
                                    { label: "Location", value: job.location },
                                    { label: "Experience Level", value: "Mid to Senior Level" },
                                    { label: "Posted", value: "2 days ago" },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <p className="text-gray-400 text-xs">{item.label}</p>
                                        <p className="font-medium text-gray-900">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* COMPANY CARD */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex gap-3 items-center mb-4">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                                    {job.company?.[0]}
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {job.company}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Technology
                                    </p>
                                </div>
                            </div>

                            <button className="w-full border border-gray-200 rounded-xl py-2 hover:bg-gray-50">
                                View Company Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* APPLY MODAL */}
                {showApply && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

                        {/* Modal */}
                        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">

                            {/* Close */}
                            <button
                                onClick={() => setShowApply(false)}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                            >
                                ✕
                            </button>

                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Upload Resume
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Upload your latest resume to apply for this job.
                                </p>
                            </div>

                            {/* Resume Uploader */}
                            <ResumeUploader
                                jobId={job._id}
                                onSuccess={() => {
                                    setShowApply(false);
                                    alert("Application submitted successfully!");
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}