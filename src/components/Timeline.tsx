import * as React from "react";
import { Circle, Microscope, School, Computer } from "lucide-react";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const timelineData: TimelineItem[] = [
  {
    date: "Sept 2020 - Current",
    title: "Associate professor",
    description: "LISTIC lab, Université Savoie Mont-Blanc",
    icon: <School className="text-blue-500" />,
  },
  {
    date: "Oct 2019 - Aug 2020",
    title: "Post-doc",
    description: "Aalto University, under Esa Ollila's supervision",
    icon: <Computer className="text-green-500" />,
  },
  {
    date: "Oct 2016 - Sept 2019",
    title: "Ph.D candidate",
    description: "SONDRA lab, CentraleSupélec",
    icon: <Microscope className="text-red-500" />,
  },
];

interface TimelineProps {
  gap?: string;
}

export function Timeline({ gap = "mb-6" }: TimelineProps) {
  return (
    <div className="relative pl-6">
      {timelineData.map((item, index) => (
        <div key={index} className={`relative flex items-start ${gap}`}>
          {/* Connector Line */}
          {index !== timelineData.length - 1 && (
            <div className="absolute left-3.5 top-6 h-full w-1 bg-gray-300" 
            style={{ height: `calc(110% + ${gap.replace('mb-', '')}px)` }} />
          )}
          
          {/* Icon Container */}
          <div className="relative z-10 w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded-full">
            {item.icon}
          </div>
          
          {/* Content */}
          <div className="ml-6">
            <h3 className="font-bold text-lg">{item.title}</h3>
            <span className="text-gray-500 text-sm">{item.date}</span>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

