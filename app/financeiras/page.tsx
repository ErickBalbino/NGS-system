import React from "react";
import { Header } from "@/components/headers/header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { lienholderList } from "./financeiras";
import PrivateRoute from "@/components/private/PrivateRoute";

export default async function Financeiras() {
  return (
    <PrivateRoute>
      <div className="flex flex-col mx-auto justify-center ">
        <Header activeTab="financeiras" />
        <div className="">
          <DataTable data={lienholderList} columns={columns} />
        </div>
      </div>
    </PrivateRoute>
  );
}
