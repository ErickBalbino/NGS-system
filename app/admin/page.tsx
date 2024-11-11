'use client';

import { useEffect, useState } from 'react';
// import { DataTable } from './data-table';
// import { columns } from './columns';
import { Vendedor } from '@/types/Vendedor';
import { User } from '@/types/User';
import { Seguradora } from '@/types/Seguradora';
import { usePocketBase } from '@/lib/Pocketbase';
import { useMutation } from '@tanstack/react-query';

import { Header } from '@/components/headers/header';
import PrivateRoute from '@/components/private/PrivateRoute';

interface RequestData {
  id: string;
  expand: {
    vendedor: Vendedor;
    backoffice: User;
    seguradora: Seguradora;
  };
  cliente: string;
  veiculo: string;
  local: string;
}

export default function Admin() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [records, setRecords] = useState<RequestData[]>([]);
  const pb = usePocketBase();

  async function fetchRecords() {
    try {
      const records: RequestData[] | undefined = await pb
        ?.collection('propostas')
        .getFullList({
          expand: 'backoffice, seguradora, vendedor',
          requestKey: null,
        });

      if (records) {
        // Mapeando os registros para obter os nomes das referências
        const formattedRecords = records?.map((record: RequestData) => ({
          backoffice: record.expand.backoffice
            ? record.expand.backoffice.name
            : record.expand.backoffice,
          seguradora: record.expand.seguradora
            ? record.expand.seguradora.name
            : record.expand.seguradora,
          vendedor: record.expand.vendedor
            ? record.expand.vendedor.name
            : record.expand.vendedor,
          cliente: record.cliente,
          id: record.id,
        }));

        setRecords(formattedRecords as unknown as RequestData[]);
      }
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      await fetchRecords();
    },
    onError: (e) => {
      console.log(`error fetch data: ${e}`);
    },
  });

  useEffect(() => {
    if (pb) {
      mutation.mutate();
    }
  }, [pb]);

  return (
    <PrivateRoute>
      <div className="flex flex-col mx-auto justify-center ">
        <Header activeTab="financeiras" />
        {/* <div className="">
          <DataTable data={records} columns={columns} />
        </div> */}
      </div>
    </PrivateRoute>
  );
}
