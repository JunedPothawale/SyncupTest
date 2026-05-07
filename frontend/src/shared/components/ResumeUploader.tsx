"use client";

import { useRef, useState } from "react";
import API from "../services/axios.service";

import {
    UploadCloud,
    FileText,
    Loader2,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import { sendNotification, socket } from "../lib/socket";

export default function ResumeUploader({
    jobId,
    onSuccess,
}: any) {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [error, setError] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisDone, setAnalysisDone] = useState(false);
    // AI DATA
    const [aiScore, setAiScore] = useState<number | null>(null);
    const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
    const [missingSkills, setMissingSkills] = useState<string[]>([]);
    const [summary, setSummary] = useState("");
    // =========================
    // FILE VALIDATION
    // =========================
    const handleFile = (selected: File) => {

        setError("");

        if (selected.type !== "application/pdf") {
            return setError("Only PDF files are allowed");
        }

        if (selected.size > 5 * 1024 * 1024) {
            return setError("Max file size is 5MB");
        }

        setFile(selected);
    };

    // =========================
    // DRAG DROP
    // =========================
    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);

        const droppedFile = e.dataTransfer.files[0];

        if (droppedFile) {
            handleFile(droppedFile);
        }
    };

    // =========================
    // ANALYZE RESUME
    // =========================
    const handleAnalyze = async () => {
        if (!file) return;
        try {
            setLoading(true);
            setError("");
            const formData = new FormData();

            formData.append("resume", file);

            const res = await API.post(`/jobs/${jobId}/match-score`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },

                    onUploadProgress: (e) => {
                        const percent = Math.round((e.loaded * 100) / (e.total || 1));
                        setProgress(percent);
                    },
                }
            );

            console.log("AI RESPONSE:", res.data);
            const aiMatch = res.data.aiMatch;
            setAiScore(aiMatch?.score || 0);
            setMatchedSkills(aiMatch?.matchedSkills || []);
            setMissingSkills(aiMatch?.missingSkills || []);
            setSummary(aiMatch?.summary || "");
            setAnalysisDone(true);

        } catch (err: any) {

            console.error(err);

            setError(err?.response?.data?.message || err?.message || "Resume analysis failed");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // FINAL APPLY
    // =========================
    const handleFinalApply =
        async () => {
            try {
                setAnalyzing(true);
                await API.post(`/applications/apply/${jobId}`, {
                    aiMatch: {
                        score: aiScore || 0,
                        matchedSkills,
                        missingSkills,
                        summary,
                    }
                });
                setUploaded(true);
                setTimeout(() => {
                    onSuccess?.();
                }, 1200);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Application failed");
            } finally {
                setAnalyzing(false);
            }
        };

    // =========================
    // SUCCESS UI
    // =========================
    if (uploaded) {
        return (<div className=" py-10 flex flex-col items-center text-center">

            <CheckCircle2 className="w-16 h-16 text-green-500" />

            <h2 className=" text-2xl font-semibold mt-4">
                Application Submitted
            </h2>

            <p className=" text-gray-500 mt-2">
                Your application was submitted successfully.
            </p>
        </div>
        );
    }

    return (
        <div
            className="max-h-[85vh] overflow-y-auto px-1 space-y-5
            "
        >

            {/* DROPZONE */}
            {!analysisDone && (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}

                    onDragLeave={() =>
                        setDragging(false)
                    }

                    onDrop={handleDrop}

                    onClick={() =>
                        inputRef.current?.click()
                    }

                    className={`
                        relative
                        border-2
                        border-dashed
                        rounded-2xl
                        p-8
                        transition-all
                        duration-200
                        cursor-pointer

                        ${dragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }
                    `}
                >

                    {/* ICON */}
                    <div className="flex justify-center
                    ">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center
                        ">
                            <UploadCloud
                                className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    {/* TEXT */}
                    {!file ? (
                        <div className="
                            text-center
                            mt-5
                        ">
                            <h3 className="
                                font-semibold
                                text-gray-900
                            ">
                                Upload your resume
                            </h3>

                            <p className="
                                text-sm
                                text-gray-500
                                mt-1
                            ">
                                Drag & drop PDF
                                here or click
                                to browse
                            </p>

                            <p className="
                                text-xs
                                text-gray-400
                                mt-3
                            ">
                                PDF only • Max 5MB
                            </p>
                        </div>
                    ) : (
                        <div className="
                            mt-5
                            flex
                            items-center
                            gap-3
                            bg-gray-50
                            border
                            border-gray-100
                            rounded-xl
                            p-4
                        ">

                            <div className="
                                w-11
                                h-11
                                rounded-xl
                                bg-red-50
                                flex
                                items-center
                                justify-center
                            ">
                                <FileText
                                    className="
                                        w-5
                                        h-5
                                        text-red-500
                                    "
                                />
                            </div>

                            <div className="
                                flex-1
                            ">
                                <p className="
                                    text-sm
                                    font-medium
                                    text-gray-900
                                    truncate
                                ">
                                    {file.name}
                                </p>

                                <p className="
                                    text-xs
                                    text-gray-500
                                ">
                                    {(
                                        file.size /
                                        1024 /
                                        1024
                                    ).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        hidden
                        accept="application/pdf"
                        onChange={(e) => {

                            if (
                                e.target.files?.[0]
                            ) {
                                handleFile(
                                    e.target
                                        .files[0]
                                );
                            }
                        }}
                    />
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="
                    bg-red-50
                    border
                    border-red-200
                    text-red-600
                    text-sm
                    rounded-xl
                    px-4
                    py-3
                ">
                    {error}
                </div>
            )}

            {/* PROGRESS */}
            {loading && (
                <div>

                    <div className="
                        flex
                        justify-between
                        text-xs
                        mb-2
                        text-gray-500
                    ">
                        <span>
                            Analyzing resume...
                        </span>

                        <span>
                            {progress}%
                        </span>
                    </div>

                    <div className="
                        w-full
                        h-2
                        bg-gray-100
                        rounded-full
                        overflow-hidden
                    ">
                        <div
                            className="
                                h-full
                                bg-blue-600
                                transition-all
                                duration-300
                            "
                            style={{
                                width:
                                    `${progress}%`,
                            }}
                        />
                    </div>
                </div>
            )}

            {/* AI RESULT */}
            {analysisDone && (
                <div className="
                    rounded-2xl
                    border
                    border-blue-100
                    bg-blue-50
                    p-6
                ">

                    <div className="
                        flex
                        items-center
                        gap-2
                        mb-5
                    ">
                        <Sparkles
                            className="
                                w-5
                                h-5
                                text-blue-600
                            "
                        />

                        <h3 className="
                            font-semibold
                            text-gray-900
                        ">
                            AI Resume Match
                        </h3>
                    </div>

                    {/* SCORE */}
                    <div className="
                        flex
                        items-center
                        justify-center
                    ">

                        <div className="
                            relative
                            w-32
                            h-32
                            md:w-40
                            md:h-40
                        ">

                            <svg
                                className="
                                    w-32
                                    h-32
                                    md:w-40
                                    md:h-40
                                    -rotate-90
                                "
                            >
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="68"
                                    stroke="#E5E7EB"
                                    strokeWidth="12"
                                    fill="none"
                                />

                                <circle
                                    cx="80"
                                    cy="80"
                                    r="68"
                                    stroke="#2563EB"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={427}
                                    strokeDashoffset={
                                        427 -
                                        (427 *
                                            (aiScore || 0)) /
                                        100
                                    }
                                    strokeLinecap="round"
                                />
                            </svg>

                            <div className="
                                absolute
                                inset-0
                                flex
                                flex-col
                                items-center
                                justify-center
                            ">
                                <span className="
                                    text-3xl
                                    md:text-4xl
                                    font-bold
                                    text-gray-900
                                ">
                                    {aiScore}%
                                </span>

                                <span className="
                                    text-sm
                                    text-gray-500
                                ">
                                    Match Score
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* MESSAGE */}
                    <div className="
                        mt-6
                        text-center
                    ">
                        {aiScore &&
                            aiScore >= 80 && (
                                <p className="
                                    text-green-600
                                    font-medium
                                ">
                                    Excellent match
                                    for this role
                                </p>
                            )}

                        {aiScore &&
                            aiScore >= 60 &&
                            aiScore < 80 && (
                                <p className="
                                    text-yellow-600
                                    font-medium
                                ">
                                    Good match.
                                    Consider applying.
                                </p>
                            )}

                        {aiScore &&
                            aiScore < 60 && (
                                <p className="
                                    text-red-600
                                    font-medium
                                ">
                                    Low match score
                                    for this role
                                </p>
                            )}
                    </div>

                    {/* SUMMARY */}
                    {summary && (
                        <div className="
                            mt-6
                            bg-white
                            border
                            border-blue-100
                            rounded-xl
                            p-4
                        ">
                            <h4 className="
                                font-semibold
                                text-gray-900
                                mb-2
                            ">
                                AI Summary
                            </h4>

                            <p className="
                                text-sm
                                text-gray-600
                                leading-6
                            ">
                                {summary}
                            </p>
                        </div>
                    )}

                    {/* MATCHED SKILLS */}
                    {matchedSkills.length > 0 && (
                        <div className="mt-6">

                            <h4 className="
                                font-semibold
                                text-green-700
                                mb-3
                            ">
                                Matched Skills
                            </h4>

                            <div className="
                                flex
                                flex-wrap
                                gap-2
                            ">
                                {matchedSkills.map(
                                    (
                                        skill,
                                        index
                                    ) => (
                                        <span
                                            key={index}
                                            className="
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-green-100
                                                text-green-700
                                                text-sm
                                            "
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* MISSING SKILLS */}
                    {missingSkills.length > 0 && (
                        <div className="mt-6">

                            <h4 className="
                                font-semibold
                                text-red-700
                                mb-3
                            ">
                                Missing Skills
                            </h4>

                            <div className="
                                flex
                                flex-wrap
                                gap-2
                            ">
                                {missingSkills.map(
                                    (
                                        skill,
                                        index
                                    ) => (
                                        <span
                                            key={index}
                                            className="
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-red-100
                                                text-red-700
                                                text-sm
                                            "
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* APPLY BUTTON */}
                    <button
                        onClick={
                            handleFinalApply
                        }

                        disabled={
                            analyzing
                        }

                        className="
                            mt-6
                            w-full
                            h-12
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            font-medium
                            transition
                            disabled:opacity-50
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >

                        {analyzing && (
                            <Loader2
                                className="
                                    w-4
                                    h-4
                                    animate-spin
                                "
                            />
                        )}

                        {analyzing
                            ? "Submitting..."
                            : "Apply to this Job"}
                    </button>
                </div>
            )}

            {/* ANALYZE BUTTON */}
            {!analysisDone && (
                <button
                    onClick={
                        handleAnalyze
                    }

                    disabled={
                        !file ||
                        loading
                    }

                    className="
                        w-full
                        h-12
                        rounded-xl
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        font-medium
                        transition
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        flex
                        items-center
                        justify-center
                        gap-2
                    "
                >

                    {loading && (
                        <Loader2
                            className="
                                w-4
                                h-4
                                animate-spin
                            "
                        />
                    )}

                    {loading
                        ? "Analyzing..."
                        : "Analyze Resume"}
                </button>
            )}
        </div>
    );
}