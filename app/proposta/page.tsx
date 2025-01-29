import React from 'react';

import { ProposalForm } from '@/components/forms/form';
import { Header } from '@/components/headers/header';

export default async function Proposta() {
  return (
    <div className="flex flex-col mb-5 w-[100%]">
      <Header activeTab="proposta" />
      <ProposalForm />
    </div>
  );
}
