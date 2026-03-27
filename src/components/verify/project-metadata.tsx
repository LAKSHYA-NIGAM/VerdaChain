"use client";

import { motion } from "framer-motion";
import { MapPin, Building, Layers, Calendar, BookOpen, Hash } from "lucide-react";
import type { ProjectMetadata as ProjectMetadataType } from "@/lib/mock-data";

interface ProjectMetadataProps {
  metadata: ProjectMetadataType;
}

const fields = [
  { key: "projectName" as const, label: "Project Name", icon: Building },
  { key: "registry" as const, label: "Registry", icon: Layers },
  { key: "location" as const, label: "Location", icon: MapPin },
  { key: "vintage" as const, label: "Vintage", icon: Calendar },
  { key: "methodology" as const, label: "Methodology", icon: BookOpen },
];

export function ProjectMetadataPanel({ metadata }: ProjectMetadataProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Hash className="h-5 w-5 text-emerald-400" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Project Metadata
        </h3>
      </div>

      <div className="space-y-4">
        {fields.map((field, i) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="flex items-start gap-3"
          >
            <field.icon className="h-4 w-4 text-white/30 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/40 mb-0.5">{field.label}</p>
              <p className="text-sm text-white/90 font-medium">
                {metadata[field.key]}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Credits Issued */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-3 border-t border-white/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Credits Issued</span>
            <span className="text-lg font-bold text-emerald-400">
              {metadata.creditsIssued.toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
