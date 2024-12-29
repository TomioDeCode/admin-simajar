"use client";

import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { MapelTable } from "@/components/features/mapel/MapelTable";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import {
  TbGenderDemigirl,
  TbGenderDemiboy,
  TbGenderBigender,
} from "react-icons/tb";

interface Subject {
  is_vocational_subject: boolean;
}

interface SubjectsResponse {
  data: Subject[];
  total_data: number;
}

interface MapelStat {
  amount: number;
  title: string;
  icon: React.ReactNode;
}

const INITIAL_STATS: MapelStat[] = [
  {
    amount: 0,
    title: "Semua Mapel",
    icon: <TbGenderBigender className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />,
  },
  {
    amount: 0,
    title: "Mapel Kejuruan",
    icon: <TbGenderDemiboy className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />,
  },
  {
    amount: 0,
    title: "Mapel Non Kejuruan",
    icon: <TbGenderDemigirl className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />,
  },
];

const MapelPage = () => {
  const [mapelStats, setMapelStats] = React.useState<MapelStat[]>(INITIAL_STATS);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

  const { data: subjectsData } = useCustomQuery<SubjectsResponse>({
    queryKey: ['mapelStats'],
    url: `${API_URL}/subjects`,
    fetchConfig: {
      requireAuth: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    staleTime: 2000,
  });

  React.useEffect(() => {
    if (!subjectsData?.data) return;

    try {
      const subjects = subjectsData.data.data;
      const totalSubjects = subjectsData.data.total_data;
      const vocationalSubjects = subjects.filter(item => item.is_vocational_subject).length;
      const nonVocationalSubjects = subjects.filter(item => !item.is_vocational_subject).length;

      const updatedStats: MapelStat[] = [
        {
          ...INITIAL_STATS[0],
          amount: totalSubjects,
        },
        {
          ...INITIAL_STATS[1],
          amount: vocationalSubjects,
        },
        {
          ...INITIAL_STATS[2],
          amount: nonVocationalSubjects,
        },
      ];

      setMapelStats(updatedStats);
    } catch (error) {
      console.error('Error processing subject data:', error);
    }
  }, [subjectsData]);

  return (
    <main className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {mapelStats.map((stat, index) => (
          <MainCard
            key={index}
            amount={stat.amount}
            title={stat.title}
            icon={stat.icon}
            className="w-full transition-transform duration-200 hover:scale-[1.02]"
          />
        ))}
      </div>
      <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-gray-100">
        <MapelTable />
      </div>
    </main>
  );
};

export default MapelPage;