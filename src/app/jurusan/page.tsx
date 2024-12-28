import React from "react";
import { MainCard } from "@/components/core/MainCard";
import { JurusanTable } from "@/components/features/jurusan/JurusanTable";
import { FaGraduationCap } from "react-icons/fa";

const JurusanPage = () => {
    const jurusanStats = [
        {
            amount: 3,
            title: "Total Jurusan",
            icon: (
                <FaGraduationCap className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />
            ),
        }
    ];

    return (
        <main className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {jurusanStats.map((stat, index) => (
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
                <JurusanTable />
            </div>
        </main>
    );
};

export default JurusanPage;