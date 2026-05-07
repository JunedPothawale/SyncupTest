"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Filters({ filters, setFilters, meta }: any) {
    const [open, setOpen] = useState(true);

    const toggleType = (value: string) => {
        const exists = filters.type.includes(value);

        setFilters({
            ...filters,
            type: exists
                ? filters.type.filter((t: string) => t !== value)
                : [...filters.type, value],
        });
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-fit sticky top-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-semibold text-gray-900">
                    Filters
                </h3>

                <button
                    onClick={() =>
                        setFilters({
                            keyword: "",
                            location: "",
                            type: [],
                        })
                    }
                    className="text-sm text-blue-600 hover:underline"
                >
                    Clear all
                </button>
            </div>

            {/* SECTION */}
            <div className="border-t pt-4">

                {/* TITLE */}
                <div
                    className="flex justify-between items-center cursor-pointer mb-4"
                    onClick={() => setOpen(!open)}
                >
                    <h4 className="text-sm font-semibold text-gray-800">
                        Job Type
                    </h4>

                    <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition ${open ? "rotate-180" : ""
                            }`}
                    />
                </div>

                {/* OPTIONS */}
                {open && (
                    <div className="space-y-3">

                        {meta?.jobTypes?.map((item: any) => {
                            const checked = filters.type.includes(item.label);

                            return (
                                <label
                                    key={item.label}
                                    className="flex justify-between items-center cursor-pointer group"
                                >
                                    {/* LEFT */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleType(item.label)}
                                            className="w-4 h-4 accent-blue-600"
                                        />

                                        <span
                                            className={`text-sm ${checked
                                                    ? "text-blue-600 font-medium"
                                                    : "text-gray-700"
                                                }`}
                                        >
                                            {item.label}
                                        </span>
                                    </div>

                                    {/* COUNT */}
                                    <span className="text-xs text-gray-400">
                                        {item.count}
                                    </span>
                                </label>
                            );
                        })}

                    </div>
                )}
            </div>
        </div>
    );
}