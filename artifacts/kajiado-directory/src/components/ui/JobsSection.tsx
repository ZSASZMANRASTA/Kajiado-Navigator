"use client";

import { useState, useMemo } from "react";
import { Briefcase, MapPin, Clock, MessageCircle, ChevronRight, X } from "lucide-react";
import { Job } from "@/lib/types";
import { JOBS, JOB_CATEGORIES, JOB_TYPES } from "@/lib/data";

const TYPE_COLORS: Record<string, string> = {
  "Full-time": "bg-acacia/10 text-acacia border-acacia/30",
  "Part-time": "bg-blue-50 text-blue-600 border-blue-200",
  Contract: "bg-purple-50 text-purple-600 border-purple-200",
  Casual: "bg-orange-50 text-orange-600 border-orange-200",
};

const CAT_COLORS: Record<string, string> = {
  Retail: "bg-green-50 text-green-700",
  Hospitality: "bg-purple-50 text-purple-700",
  Technology: "bg-blue-50 text-blue-700",
  Logistics: "bg-yellow-50 text-yellow-700",
  Health: "bg-teal-50 text-teal-700",
  "Arts & Culture": "bg-ochre/10 text-ochre",
};

function JobCard({ job, onOpen }: { job: Job; onOpen: (j: Job) => void }) {
  const typeClass = TYPE_COLORS[job.type] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const catClass = CAT_COLORS[job.category] ?? "bg-gray-100 text-gray-600";
  const daysLabel = job.posted_days_ago === 0 ? "Today" : job.posted_days_ago === 1 ? "Yesterday" : `${job.posted_days_ago}d ago`;

  return (
    <button
      onClick={() => onOpen(job)}
      className="w-full text-left group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeClass}`}>{job.type}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catClass}`}>{job.category}</span>
          </div>
          <h3 className="font-bold text-gray-800 text-base group-hover:text-acacia transition-colors leading-tight">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-acacia transition-colors shrink-0 mt-1" />
      </div>

      <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">{job.description}</p>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            {job.town}
          </div>
          {job.salary && (
            <p className="text-xs font-bold text-acacia">{job.salary}</p>
          )}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Clock className="w-3 h-3" />
          {daysLabel}
        </div>
      </div>
    </button>
  );
}

function JobDetailModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const typeClass = TYPE_COLORS[job.type] ?? "bg-gray-100 text-gray-600 border-gray-200";

  const handleApply = () => {
    const msg = encodeURIComponent(`Hi! I'd like to apply for the *${job.title}* position at ${job.company}.`);
    window.open(`https://wa.me/${job.whatsapp.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ zIndex: 200 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-acacia to-acacia/80 px-5 pt-5 pb-4 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-white/20 text-white border-white/30`}>{job.type}</span>
              </div>
              <h2 className="text-white font-bold text-xl leading-tight">{job.title}</h2>
              <p className="text-white/70 text-sm mt-0.5">{job.company} · {job.town}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">
            {job.salary && (
              <div className="bg-acacia/5 border border-acacia/20 rounded-xl px-4 py-3">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-0.5">Salary</p>
                <p className="font-bold text-acacia text-lg">{job.salary}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">About the Role</p>
              <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Requirements</p>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-acacia mt-1.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={handleApply}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20be5a] text-white font-bold rounded-xl transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Apply via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobsSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const displayed = useMemo(() => {
    let list = JOBS;
    if (activeCategory !== "All") list = list.filter((j) => j.category === activeCategory);
    if (activeType !== "All") list = list.filter((j) => j.type === activeType);
    return list;
  }, [activeCategory, activeType]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 mb-8 text-white overflow-hidden relative">
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            {JOBS.length} Open Positions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Jobs in Kajiado</h2>
          <p className="text-white/70 text-sm max-w-md">
            Local job opportunities from verified businesses across Kitengela, Rongai, and Kajiado County. Apply directly via WhatsApp.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-[10px] text-gray-400 font-semibold shrink-0 uppercase tracking-wide">Category</span>
          {JOB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                activeCategory === cat
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-[10px] text-gray-400 font-semibold shrink-0 uppercase tracking-wide">Type</span>
          {JOB_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                activeType === t
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">{displayed.length} position{displayed.length !== 1 ? "s" : ""}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((job) => (
          <JobCard key={job.id} job={job} onOpen={setSelectedJob} />
        ))}
      </div>

      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}
