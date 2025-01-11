import Subjects from "@/components/features/mapel/Subjects";
import React from "react";

const SubjectsPage = () => {
  return (
    <main className="min-h-screen py-3 ">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          <div className="overflow-hidden bg-white">
            <Subjects />
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubjectsPage;
