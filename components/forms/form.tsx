'use client';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { usePocketBase } from '@/lib/Pocketbase';

import {
  FormItem,
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Checkbox } from '../ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CurrencyInput from '../ui/CurrencyInput';
import { Seguradora } from '@/types/Seguradora';
import { Vendedor } from '@/types/Vendedor';

const formSchema = z.object({
  customersNames: z.string().min(2, {
    message: 'Nome do cliente deve ter no mínimo 3 caracteres.',
  }),
  vehicles: z.string().min(3, {
    message: 'Digite um nome válido de veículo',
  }),
  address: z.string().min(3, {
    message: 'Digite um endereço válido',
  }),
  monthlyValueLiability: z.coerce.number(),
  optionADueToday: z.coerce.number(),
  optionBDueToday: z.coerce.number(),
  optionCDueToday: z.coerce.number(),
  optionAMonthly: z.coerce.number(),
  optionBMonthly: z.coerce.number(),
  optionCMonthly: z.coerce.number(),
  fee: z.coerce.number().optional(), // Fee is optional
  paymentOptions: z.enum(['3', '5', '6', '11']),
  isFinanced: z.boolean(),
  language: z.enum(['Português', 'Espanhol']),
  seguradora: z.string().nonempty({ message: 'Seguradora é obrigatória' }),
  vendedor: z.string().nonempty({ message: 'Vendedor é obrigatório' }),
});

export function ProposalForm() {
  const [loadingRequest, setLoadingRequest] = useState<boolean>(false);
  const pb = usePocketBase();

  const [seguradoras, setSeguradoras] = useState<Seguradora[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loadingSeguradoras, setLoadingSeguradoras] = useState<boolean>(true);
  const [loadingVendedores, setLoadingVendedores] = useState<boolean>(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customersNames: '',
      vehicles: '',
      address: '',
      monthlyValueLiability: 0,
      optionADueToday: 0,
      optionBDueToday: 0,
      optionCDueToday: 0,
      optionAMonthly: 0,
      optionBMonthly: 0,
      optionCMonthly: 0,
      fee: 250, // Default fee value set to 250
      paymentOptions: '6',
      isFinanced: true, // Default to "Financiado"
      language: 'Português',
      seguradora: '', // Empty by default
      vendedor: '', // Empty by default
    },
  });


  useEffect(() => {
    async function fetchSeguradoras() {
      try {
        setLoadingSeguradoras(true);
        const seguradorasData: Seguradora[] | undefined = await pb
          ?.collection('seguradoras')
          .getFullList();
        setSeguradoras(seguradorasData as unknown as Seguradora[]);

        const progressive = seguradorasData?.find(
          (seguradora: Seguradora) => seguradora.name === 'Progressive'
        );
        if (progressive) {
          form.setValue('seguradora', progressive.id);
        }
      } catch (error) {
        console.error('Failed to fetch seguradoras:', error);
      } finally {
        setLoadingSeguradoras(false);
      }
    }

    async function fetchVendedores() {
      try {
        setLoadingVendedores(true);
        const vendedoresData = await pb?.collection('vendedores').getFullList();
        setVendedores(vendedoresData as unknown as Vendedor[]);
      } catch (error) {
        console.error('Failed to fetch vendedores:', error);
      } finally {
        setLoadingVendedores(false);
      }
    }

    fetchSeguradoras();
    fetchVendedores();
  }, [pb, form]);

  // Watch isFinanciado to conditionally render fields
  const isFinanciado = useWatch({

    control: form.control,
    name: 'isFinanced',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoadingRequest(true);

      await pb?.collection('propostas').create({
        backoffice: JSON.parse(
          localStorage.getItem('pocketbase_auth') as string
        )?.model?.id,
        seguradora: values.seguradora,
        vendedor: values.vendedor,
        cliente: values.customersNames,
        veiculo: values.vehicles,
        local: values.address,
      });
    } catch (e) {
      console.log(`error create proposal: ${e}`);
    } finally {
      setLoadingRequest(false);
    }

    const fee = values.fee ?? 250;
    const paramsObj: Record<string, string> = {
      customersNames: values.customersNames,
      vehicles: values.vehicles,
      address: values.address,
      monthlyValueLiability: values.monthlyValueLiability.toString(),
      optionBDueToday: values.optionBDueToday.toString(),
      optionCDueToday: values.optionCDueToday.toString(),
      optionBMonthly: values.optionBMonthly.toString(),
      optionCMonthly: values.optionCMonthly.toString(),
      fee: fee.toString(),
      paymentOptions: values.paymentOptions,
      isFinanced: values.isFinanced.toString(),
      language: values.language,
    };

    // Only include Liability options if isFinanced is false
    if (!values.isFinanced) {
      paramsObj.optionADueToday = values.optionADueToday.toString();
      paramsObj.optionAMonthly = values.optionAMonthly.toString();
    }

    const params = new URLSearchParams(paramsObj);

    const imageUrl = isFinanciado ? `/api/og-financed-miniatura?${params.toString()}` : `/api/og-own-miniatura?${params.toString()}`;
    console.log(paramsObj)
    window.open(imageUrl, '_blank');
  }

  const isLoading = loadingSeguradoras || loadingVendedores;

  return (
    <div className="flex flex-col mt-12 items-center justify-center space-y-8 w-[100%]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-8 border rounded-md shadow-lg w-[100%] max-w-lg"
        >
          {/* Group 1: Informações da cotação */}
          <div className="border p-4 rounded-md relative w-[100%]">
            <div className="absolute -top-4 left-3 px-1 bg-white dark:bg-background">
              <span className="text-xl font-medium">
                Informações da cotação      
              </span>
            </div>
            <div className="space-y-4 mt-2">
              <FormField
                control={form.control}
                name="customersNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-left">
                      Nome do cliente
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do cliente..."
                        {...field}
                        onChange={(e) => {
                          const uppercasedValue = e.target.value.toUpperCase();
                          field.onChange(uppercasedValue);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-left">
                      Veículos
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Veículos do cliente..."
                        {...field}
                        onChange={(e) => {
                          const uppercasedValue = e.target.value.toUpperCase();
                          field.onChange(uppercasedValue);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-left">
                      Endereço
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Endereço do cliente..."
                        {...field}
                        onChange={(e) => {
                          const uppercasedValue = e.target.value.toUpperCase();
                          field.onChange(uppercasedValue);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFinanced"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-left">
                      Status do veículo
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <span className="ml-2">Financiado</span>
                        </label>
                        <label className="flex items-center">
                          <Checkbox
                            checked={!field.value}
                            onCheckedChange={() => field.onChange(false)}
                          />
                          <span className="ml-2">Quitado</span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Group 2: Valores */}
          <div className="border p-4 rounded-md relative">
            <div className="absolute -top-4 left-3 px-1 bg-white dark:bg-background px-2">
              <span className="text-xl font-medium">Valores</span>
            </div>
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-left">Fee</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          value={field.value || 250}
                          onChange={field.onChange}
                          placeholder="Valor do Fee..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentOptions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-left">
                        Quantidade de pagamentos
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="border p-2 rounded-md w-full text-base dark:bg-inherit"
                        >
                          <option value="3" className="dark:text-black">
                            3
                          </option>
                          <option value="5" className="dark:text-black">
                            5
                          </option>
                          <option value="6" className="dark:text-black">
                            6
                          </option>
                          <option value="11" className="dark:text-black">
                            11
                          </option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Option A: Liability - Only show if not Financiado */}
              {!isFinanciado && (
                <div className="text-left">
                  <div className="flex items-center my-2">
                    <hr className="flex-grow border-t-2 border-green-500" />
                    <span className="mx-2 text-green-500 font-semibold">
                      Liability
                    </span>
                    <hr className="flex-grow border-t-2 border-green-500" />
                  </div>

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="optionADueToday"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base text-left">
                            Entrada
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              value={field.value || 0}
                              onChange={field.onChange}
                              placeholder="Valor a pagar hoje"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="optionAMonthly"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base text-left">
                            Mensal
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              value={field.value || 0}
                              onChange={field.onChange}
                              placeholder="Valor mensal"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Option B: Full Coverage */}
              <div className="text-left">
                <div className="flex items-center my-2">
                  <hr className="flex-grow border-t-2 border-blue-500" />
                  <span className="mx-2 text-blue-500 font-semibold">
                    Full Coverage
                  </span>
                  <hr className="flex-grow border-t-2 border-blue-500" />
                </div>

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="optionBDueToday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base text-left">
                          Entrada
                        </FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value || 0}
                            onChange={field.onChange}
                            placeholder="Valor a pagar hoje"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="optionBMonthly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base text-left">
                          Mensal
                        </FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value || 0}
                            onChange={field.onChange}
                            placeholder="Valor mensal"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Option C: Full Coverage + Reboque */}
              <div className="text-left">
                <div className="flex items-center my-2">
                  <hr className="flex-grow border-t-2 border-red-500" />
                  <span className="mx-2 text-red-500 font-semibold">
                    Full Coverage + Reboque
                  </span>
                  <hr className="flex-grow border-t-2 border-red-500" />
                </div>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="optionCDueToday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base text-left">
                          Entrada
                        </FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value || 0}
                            onChange={field.onChange}
                            placeholder="Valor a pagar hoje"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="optionCMonthly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base text-left">
                          Mensal
                        </FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value || 0}
                            onChange={field.onChange}
                            placeholder="Valor mensal"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Language Selection Field */}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-left">Idioma</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border p-2 rounded-md w-full dark:bg-inherit"
                  >
                    <option value="Português" className="dark:text-black">
                      Português
                    </option>
                    <option value="Espanhol" className="dark:text-black">
                      Espanhol
                    </option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Seguradora Selection Field */}
          <FormField
            control={form.control}
            name="seguradora"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-left">
                  Seguradora
                </FormLabel>
                <FormControl>
                  {loadingSeguradoras ? (
                    <div>Carregando seguradoras...</div>
                  ) : (
                    <select
                      {...field}
                      className="border p-2 rounded-md w-full dark:bg-inherit"
                    >
                      <option value="" disabled>
                        Selecione uma seguradora
                      </option>
                      {seguradoras.map((seguradora) => (
                        <option
                          key={seguradora.id}
                          value={seguradora.id}
                          className="dark:text-black"
                        >
                          {seguradora.name}
                        </option>
                      ))}
                    </select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vendedor Selection Field */}
          <FormField
            control={form.control}
            name="vendedor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-left">Vendedor</FormLabel>
                <FormControl>
                  {loadingVendedores ? (
                    <div>Carregando vendedores...</div>
                  ) : (
                    <select
                      {...field}
                      className="border p-2 rounded-md w-full dark:bg-inherit"
                    >
                      <option value="" disabled>
                        Selecione um vendedor
                      </option>
                      {vendedores.map((vendedor) => (
                        <option
                          key={vendedor.id}
                          value={vendedor.id}
                          className="dark:text-black"
                        >
                          {vendedor.name}
                        </option>
                      ))}
                    </select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-48"
              disabled={loadingRequest || isLoading}
            >
              {loadingRequest ? 'Aguarde...' : 'Gerar Proposta'}
            </Button>

            <Button
              type="button"
              variant="reset"
              className="w-48 mx-2"
              onClick={() => form.reset()}
              disabled={isLoading}
            >
              Resetar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
