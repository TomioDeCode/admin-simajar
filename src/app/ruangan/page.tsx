import Rooms from "@/components/features/ruangan/Rooms";
import React from "react";

const RoomsPage = () => {
  return (
    <main className="min-h-screen py-3 ">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          <div className="overflow-hidden bg-white">
            <Rooms />
          </div>
        </div>
      </div>
    </main>
  );
};

export default RoomsPage;
