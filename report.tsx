"use client";

import React, { useState } from "react";

const ReportPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [detail, setDetail] = useState("");
    const [location, setLocation] = useState("");
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [attachment, setAttachment] = useState("");
    const [file, setFile] = useState();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Simulate an API call or data fetching
        const reportData = { title, detail, location };

        // Simulate fetching data with a timeout
        const fetchData = async () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(`Report submitted successfully! Title: ${title}, Detail: ${detail}, Location: ${location}`);
                }, 1000);
            });
        };

        //const response = await fetchData();
        //setConfirmationMessage(response);

        // Clear the form fields (optional)
        setTitle("");
        setDetail("");
        setLocation("");
    };
    setTimeout(() => {
        setConfirmationMessage("");
    }, 5000);
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-semibold text-white mb-4">
                Report an Issue
            </h1>
            <h2 className="text-sm font-semibold text-white text-justify mb-6" >
                This form is designed to report issues and propose suggestions for improvement. Your feedback is invaluable in helping us make our services better and resolve issues promptly. Please complete the form below in as much detail as possible.
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xl font-semibold text-white">
                    Title
                    </label>
                    <div className="my-2 text-black">
                    <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="eg. Green band error"
                            className="placeholder:text-gray-400 placeholder:italic w-30"
                            required
                        />
                    </div>
                </div>
                  
                <label className="block text-xl font-semibold text-white">
                    Detail
                    <select
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        required
                        className="w-full px-4 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="" className="text-gray-500">Select dataset</option>
                        <option value="Landsat-8">Landsat-8</option>
                        <option value="Landsat-9">Landsat-9</option>
                    </select>
                </label>

                <div className="flex-col gap-8">
                    <label className="block text-xl font-semibold text-white">
                        Location (Latitude, Longitude)
                    </label>
                    <div className=" my-2 text-black">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., 40.7128, -74.0060"
                            className="placeholder:text-gray-400 placeholder:italic w-30"
                            required
                        />
                    </div>
                </div>

                <label className="block gap-10 text-xl font-semibold text-white">
                    Attachment
                    <div className="flex gap-10 items-center">
                        <input
                            type="file"
                            className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                    </div>
                </label>

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-transform duration-200 hover:scale-105"
                    >
                        Submit Report
                    </button>
                </div>
            </form>
            {confirmationMessage && (
                <div className="mt-4 text-green-500">
                    {confirmationMessage}
                </div>
            )}
        </div>
    );
};

export default ReportPage;