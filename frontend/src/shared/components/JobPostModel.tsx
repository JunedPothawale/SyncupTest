"use client";

import { useState } from "react";
import { createJob } from "../services/job.service";
import { sendNotification, sendRegister, socket } from "../lib/socket";

export function PostJobModal({ onClose }: any) {

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const numberRegex = /^[0-9]+$/;

    const [formData, setFormData] = useState({
        title: "",
        type: "Full-time",
        experienceLevel: "Junior",
        location: "",
        workSetting: "Remote",
        description: "",
        responsibilities: "",
        requirements: "",
        benefits: "",
        currency: "INR",
        minSalary: "",
        maxSalary: "",
        company: "",
        website: "",
        companyDescription: "",
    });

    const handleChange = (key: string, value: string) => {

        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));

        setErrors((prev: any) => ({
            ...prev,
            [key]: "",
        }));
    };

    const validateStep = () => {

        const newErrors: any = {};

        if (step === 1) {

            if (!formData.title) {
                newErrors.title = "Job title required";
            }

            if (!formData.location) {
                newErrors.location = "Location required";
            }
        }

        if (step === 2) {

            if (!formData.description) {
                newErrors.description = "Description required";
            }

            if (!formData.requirements) {
                newErrors.requirements = "Requirements required";
            }
        }

        if (step === 3) {

            if (!formData.company) {
                newErrors.company = "Company required";
            }

            if (!formData.minSalary) {

                newErrors.minSalary = "Min salary required";

            } else if (
                !numberRegex.test(formData.minSalary)
            ) {

                newErrors.minSalary =
                    "Only numbers allowed";
            }

            if (!formData.maxSalary) {

                newErrors.maxSalary = "Max salary required";

            } else if (
                !numberRegex.test(formData.maxSalary)
            ) {

                newErrors.maxSalary =
                    "Only numbers allowed";
            }

            if (
                Number(formData.minSalary) >
                Number(formData.maxSalary)
            ) {

                newErrors.maxSalary =
                    "Max salary must be greater";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {

        if (!validateStep()) return;

        setStep((prev) =>
            Math.min(prev + 1, 3)
        );
    };

    const prevStep = () => {

        setStep((prev) =>
            Math.max(prev - 1, 1)
        );
    };

    const handleSubmit = async () => {

        if (!validateStep()) return;

        try {

            setLoading(true);

            const payload = {

                title: formData.title,
                type: formData.type,
                experienceLevel: formData.experienceLevel,
                location: formData.location,
                workSetting: formData.workSetting,
                description: formData.description,

                responsibilities:
                    formData.responsibilities
                        .split("\n")
                        .filter(Boolean),

                requirements:
                    formData.requirements
                        .split("\n")
                        .filter(Boolean),

                benefits:
                    formData.benefits
                        .split("\n")
                        .filter(Boolean),

                company: formData.company,
                website: formData.website,
                companyDescription:
                    formData.companyDescription,

                salary: {
                    currency: formData.currency,
                    min: Number(formData.minSalary),
                    max: Number(formData.maxSalary),
                },
            };
            const res = await createJob(payload)
            if (!res.success) {
                throw new Error(
                    res.message ||
                    "Failed to create job"
                );
            }
            alert("Job posted successfully");
            onClose();
        } catch (err: any) {
            alert(
                err.message ||
                "Failed to create job"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">

            <div className="relative w-full max-w-4xl h-[88vh] bg-white rounded-[24px] overflow-hidden shadow-2xl border border-gray-200 flex flex-col">

                {/* HEADER */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">

                    <h2 className="text-[28px] font-bold text-gray-900">
                        Post a Job
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-2xl text-gray-500"
                    >
                        ×
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

                    {/* STEP 1 */}
                    {step === 1 && (
                        <>

                            <div>
                                <label className="block mb-2 text-sm font-semibold">
                                    Job Title *
                                </label>

                                <input
                                    value={formData.title}
                                    onChange={(e) =>
                                        handleChange(
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Frontend Developer"
                                    className="w-full h-14 rounded-xl border border-gray-300 px-4 text-sm"
                                />

                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="block mb-2 text-sm font-semibold">
                                        Job Type *
                                    </label>

                                    <select
                                        value={formData.type}
                                        onChange={(e) =>
                                            handleChange(
                                                "type",
                                                e.target.value
                                            )
                                        }
                                        className="w-full h-14 rounded-xl border border-gray-300 px-4 text-sm"
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-semibold">
                                        Experience Level *
                                    </label>

                                    <select
                                        value={formData.experienceLevel}
                                        onChange={(e) =>
                                            handleChange(
                                                "experienceLevel",
                                                e.target.value
                                            )
                                        }
                                        className="w-full h-14 rounded-xl border border-gray-300 px-4 text-sm"
                                    >
                                        <option>Junior</option>
                                        <option>Mid Level</option>
                                        <option>Senior</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold">
                                    Location *
                                </label>

                                <input
                                    value={formData.location}
                                    onChange={(e) =>
                                        handleChange(
                                            "location",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Remote"
                                    className="w-full h-14 rounded-xl border border-gray-300 px-4 text-sm"
                                />

                                {errors.location && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                        </>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <>

                            <div>
                                <label className="block mb-2 text-sm font-semibold">
                                    Job Description *
                                </label>

                                <textarea
                                    rows={6}
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                                />

                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold">
                                    Requirements *
                                </label>

                                <textarea
                                    rows={6}
                                    value={formData.requirements}
                                    onChange={(e) =>
                                        handleChange(
                                            "requirements",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                                />

                                {errors.requirements && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.requirements}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold">
                                    Benefits
                                </label>

                                <textarea
                                    rows={4}
                                    value={formData.benefits}
                                    onChange={(e) =>
                                        handleChange(
                                            "benefits",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                                />
                            </div>

                        </>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <>

                            <div className="grid grid-cols-3 gap-4">

                                <select
                                    value={formData.currency}
                                    onChange={(e) =>
                                        handleChange(
                                            "currency",
                                            e.target.value
                                        )
                                    }
                                    className="h-14 rounded-xl border border-gray-300 px-4 text-sm"
                                >
                                    <option>USD</option>
                                    <option>INR</option>
                                </select>

                                <div>
                                    <input
                                        value={formData.minSalary}
                                        onChange={(e) => {

                                            const value =
                                                e.target.value.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                );

                                            handleChange(
                                                "minSalary",
                                                value
                                            );
                                        }}
                                        placeholder="Min Salary"
                                        className="w-full h-14 rounded-xl border border-gray-300 px-4 text-sm"
                                    />

                                    {errors.minSalary && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.minSalary}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        value={formData.maxSalary}
                                        onChange={(e) => {

                                            const value =
                                                e.target.value.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                );

                                            handleChange(
                                                "maxSalary",
                                                value
                                            );
                                        }}
                                        placeholder="Max Salary"
                                        className="w-full h-14 rounded-xl border border-gray-300 px-4 text-sm"
                                    />

                                    {errors.maxSalary && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.maxSalary}
                                        </p>
                                    )}
                                </div>

                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold">
                                    Company Name *
                                </label>

                                <input
                                    value={formData.company}
                                    onChange={(e) =>
                                        handleChange(
                                            "company",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Your company"
                                    className="w-full h-14 rounded-xl border border-gray-300 px-4 text-sm"
                                />

                                {errors.company && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.company}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold">
                                    Website
                                </label>

                                <input
                                    value={formData.website}
                                    onChange={(e) =>
                                        handleChange(
                                            "website",
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://company.com"
                                    className="w-full h-14 rounded-xl border border-gray-300 px-4 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold">
                                    Company Description
                                </label>

                                <textarea
                                    rows={5}
                                    value={formData.companyDescription}
                                    onChange={(e) =>
                                        handleChange(
                                            "companyDescription",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                                />
                            </div>

                        </>
                    )}

                </div>

                {/* FOOTER */}
                <div className="min-h-[82px] px-8 border-t border-gray-100 flex items-center justify-between bg-white">

                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className="h-12 px-6 rounded-xl border border-gray-300 text-sm font-medium disabled:opacity-40"
                    >
                        Back
                    </button>

                    <div className="text-xs text-gray-500">
                        Step {step} of 3
                    </div>

                    {step !== 3 ? (
                        <button
                            onClick={nextStep}
                            className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="h-12 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold disabled:opacity-50"
                        >
                            {loading ?
                                "Publishing..." :
                                "Publish Job"}
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}