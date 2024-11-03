"use client";

import React, { useState, useEffect } from "react";

interface FormData {
    title: string;
    description: string;
    goal: string;
}

interface CreateCampaignFormProps {
    onSubmit: (formData: FormData, resetForm: () => void) => void;
}

const Createcampaignform: React.FC<CreateCampaignFormProps> = ({
    onSubmit,
}) => {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        goal: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            goal: "",
        });
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const minDate = tomorrow.toISOString().split("T")[0];

    const createCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData, resetForm);
    };

    return (
        <form
            onSubmit={createCampaign}
            className="flex flex-row space-x-4 w-full h-full justify-between rounded-lg items-start p-4 glass-background"
        >
            <div className="flex flex-col space-y-4 w-1/2">
                <p className="relative">
                    <span className="text-xs absolute z-10 left-4 bg-transparent top-1 shadow-none text-white text-opacity-50">
                        Name of Campaign
                    </span>
                    <input
                        type="text"
                        placeholder="GreenFund: Sustain Earth"
                        className="px-4 py-6 pb-3 outline-none border-none rounded-lg glass-background w-full"
                        value={formData.title}
                        onChange={handleChange}
                        name="title"
                        minLength={3}
                        required
                        autoComplete="off"
                    />
                </p>
                <p className="relative">
                    <span className="text-xs absolute z-10 left-4 bg-transparent top-1 shadow-none text-white text-opacity-50">
                        Campaign Goal (PYUSD)
                    </span>
                    <input
                        type="number"
                        className="px-4 py-6 pb-3 outline-none border-none rounded-lg glass-background w-full"
                        placeholder="5"
                        value={formData.goal}
                        onChange={handleChange}
                        name="goal"
                        min={1}
                        required
                    />
                </p>

                <button
                    type="submit"
                    className="rounded-lg px-5 py-3 font-bold custom-gradient"
                >
                    Create
                </button>
            </div>
            <p className="relative w-1/2">
                <span className="text-xs absolute z-10 left-4 bg-transparent top-1 shadow-none text-white text-opacity-50">
                    Campaign Description
                </span>

                <textarea
                    name="description"
                    rows={10}
                    className="w-full flex-grow glass-background appearance-none resize-none outline-none border-none rounded-lg px-4 py-6 pb-3 max-h-96 overflow-hidden custom-textarea"
                    placeholder="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam, eveniet!..."
                    style={{
                        overflowY: "hidden",
                        resize: "none",
                    }}
                    value={formData.description}
                    onChange={handleChange}
                    minLength={30}
                    maxLength={120}
                    required
                ></textarea>
            </p>
        </form>
    );
};

export default Createcampaignform;
