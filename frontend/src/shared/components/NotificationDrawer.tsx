"use client";

import { X, Bell } from "lucide-react";

interface NotificationDrawerProps {
    open: boolean;
    onClose: () => void;
    notifications: any[];
}

export default function NotificationDrawer({ open, onClose, notifications }: NotificationDrawerProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-99999 bg-black/40 backdrop-blur-sm flex items-start justify-end">
            <div className="w-full max-w-md h-screen bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300">

                {/* HEADER */}
                <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between shrink-0">

                    <div className="flex items-center gap-3">

                        <Bell className="w-5 h-5 text-blue-600" />

                        <h2 className="text-[18px] font-bold text-gray-900">
                            Notifications
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto">

                    {notifications.length === 0 && (

                        <div className="h-full flex items-center justify-center text-sm text-gray-500">
                            No notifications yet
                        </div>
                    )}

                    {notifications.map(
                        (item, index) => (

                            <div
                                key={index}
                                className="p-5 border-b border-gray-100 hover:bg-gray-50 transition"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex-1">

                                        <h3 className="text-[14px] font-semibold text-gray-900">
                                            {item.type}
                                        </h3>

                                        <p className="mt-1 text-[13px] text-gray-600 leading-relaxed">
                                            {item.message}
                                        </p>

                                        {/* APPLICANT */}
                                        {item.applicant && (

                                            <div className="mt-4 rounded-xl border border-gray-200 p-4 bg-gray-50 space-y-2">

                                                <div>
                                                    <span className="text-[11px] text-gray-400 uppercase">
                                                        Applicant
                                                    </span>

                                                    <p className="text-[14px] font-medium text-gray-900">
                                                        {item.applicant.name}
                                                    </p>
                                                </div>

                                                <div>
                                                    <span className="text-[11px] text-gray-400 uppercase">
                                                        Email
                                                    </span>

                                                    <p className="text-[13px] text-gray-700">
                                                        {item.applicant.email}
                                                    </p>
                                                </div>

                                                <div>
                                                    <span className="text-[11px] text-gray-400 uppercase">
                                                        AI Match Score
                                                    </span>

                                                    <p className="text-[13px] font-semibold text-green-600">
                                                        {item.aiScore}%
                                                    </p>
                                                </div>

                                                {item.resumeUrl && (

                                                    <a
                                                        href={item.resumeUrl}
                                                        target="_blank"
                                                        className="inline-flex mt-2 text-[13px] font-medium text-blue-600 hover:underline"
                                                    >
                                                        View Resume
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        <span className="mt-3 inline-block text-[11px] text-gray-400">
                                            just now
                                        </span>
                                    </div>

                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}