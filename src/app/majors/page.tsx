import Majors from "@/components/features/jurusan/Majors";
import React from "react";

const MajorsPage = () => {
  return (
    <main className="min-h-screen py-3 ">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          <div className="overflow-hidden bg-white">
            <Majors />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MajorsPage;
