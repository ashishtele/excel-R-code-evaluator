"use client";

import React, { useState } from "react";
import Evaluator from "@/components/tool/Evaluator";
import { toast } from "sonner"; // Assuming sonner is set up; if not, replace with console.log

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string)?.trim() || "";
    const feedback = (formData.get("feedback") as string)?.trim() || "";

    if (!name || !feedback) {
      toast.error("Please enter your name and feedback.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message: feedback }),
      });

      if (res.ok) {
        toast.success("Feedback submitted!");
        e.currentTarget.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      toast.error("Error submitting feedback. Ensure the Python backend is running on port 8000.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <div className="flex-1">
        <Evaluator />
      </div>
      <div className="border-t border-border p-6 bg-card">
        <h3 className="text-lg font-semibold mb-4">Provide Feedback</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your name..."
            className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-ring/50"
            required
          />
          <textarea
            name="feedback"
            placeholder="Enter your text feedback here..."
            className="w-full h-24 p-3 border border-border rounded-md bg-background text-foreground resize-none focus:outline-ring/50"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}