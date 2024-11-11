"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Proposta = {
  backoffice: string;
  seguradora: string;
  vendedor: string;
  cliente: string;
  created: Date;
};

export const columns: ColumnDef<Proposta>[] = [
  {
    accessorKey: "backoffice",
    header: "BackOffice",
  },
  {
    accessorKey: "seguradora",
    header: "Seguradora",
  },
  {
    accessorKey: "vendedor",
    header: "Vendedor",
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const proposta = row.original;

      return 
      // (
      //   <DropdownMenu>
      //     <DropdownMenuTrigger asChild>
      //       <Button variant="ghost" className="h-8 w-8 p-0">
      //         <span className="sr-only">Open menu</span>
      //         <MoreHorizontal className="h-4 w-4" />
      //       </Button>
      //     </DropdownMenuTrigger>
      //     <DropdownMenuContent align="end">
      //       <DropdownMenuLabel>Ações</DropdownMenuLabel>
      //       <DropdownMenuItem
      //         onClick={() => navigator.clipboard.writeText(proposta.backoffice)}
      //       >
      //         Copiar nome da Financeira
      //       </DropdownMenuItem>
      //       <DropdownMenuSeparator />
      //       <DropdownMenuItem
      //         onClick={() => navigator.clipboard.writeText(proposta.vendedor)}
      //       >
      //         Copiar endereço da Financeira
      //       </DropdownMenuItem>
      //     </DropdownMenuContent>
      //   </DropdownMenu>
      // );
    },
  },
];
