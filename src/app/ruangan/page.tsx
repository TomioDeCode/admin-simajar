"use client"

import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { RuanganTable } from "@/components/features/ruangan/RuanganTable";
import {
  TbGenderDemigirl,
  TbGenderDemiboy,
  TbGenderBigender,
} from "react-icons/tb";
import { useCustomQuery } from "@/hooks/useCustomQuery";

interface Ruangan {
  is_practice_room: boolean;
}

interface RuanganResponse {
  data: Ruangan[];
  total_data: number;
}

interface RuanganStat {
  amount: number;
  title: string;
  icon: React.ReactNode;
}

const INITIAL_STATS: RuanganStat[] = [
  {
    amount: 0,
    title: "Semua Ruangan",
    icon: <TbGenderBigender className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />,
  },
  {
    amount: 0,
    title: "Jurusan",
    icon: <TbGenderDemiboy className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />,
  },
  {
    amount: 0,
    title: "Non Jurusan",
    icon: <TbGenderDemigirl className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />,
  },
]

const RuanganPage = () => {
  const [ruanganStats, setRuanganStats] = React.useState<RuanganStat[]>(INITIAL_STATS)

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

  const { data: ruanganData } = useCustomQuery<RuanganResponse>({
    queryKey: ['ruanganStats'],
    url: `${API_URL}/rooms`,
    fetchConfig: {
      requireAuth: true,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      }
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    staleTime: 300
  })
  
  React.useEffect(() => {
    if (!ruanganData?.data) return
    
    try {
      const totalRuangan = ruanganData?.data?.total_data;
      const ruangan = ruanganData.data.data;
      const practiceRuangan = ruangan.filter(item => item.is_practice_room).length
      const nonPracticeRuangan = ruangan.filter(item => !item.is_practice_room).length

      const updatedStats: RuanganStat[] = [
        {
          ...INITIAL_STATS[0],
          amount: totalRuangan,
        },
        {
          ...INITIAL_STATS[1],
          amount: practiceRuangan,
        },
        {
          ...INITIAL_STATS[2],
          amount: nonPracticeRuangan,
        },
      ];

      setRuanganStats(updatedStats)

    } catch (error) {
      console.log("Error Ambil Dada", error)
    }

  }, [ruanganStats])

  return (
    <main className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="gap-4 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {ruanganStats.map((stat, index) => (
          <MainCard
            key={index}
            onClick={() => console.log(stat.amount)}
            amount={stat.amount}
            title={stat.title}
            icon={stat.icon}
            className="w-full"
          />
        ))}
      </div>
      <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-gray-100">
        <RuanganTable />
      </div>
    </main>
  );
};

export default RuanganPage;
