import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const IMG_BASE_URL = 'http://localhost:3001/'; 
const MAX_NAME_LENGTH = 45;
const MAX_VEHICLE_LENGTH = 40;
const MAX_ADDRESS_LENGTH = 40;

// Função auxiliar para calcular valores de total
const calculateTotal = (dueToday: string, fee: string, monthly: string, payments: string) => {
  const totalValue = parseFloat(dueToday) + parseFloat(fee) + parseFloat(monthly) * (parseInt(payments) - 1);
  return totalValue > 9999 ? Math.ceil(totalValue) : totalValue.toFixed(2);
};

// Função para renderizar as opções de imagem baseadas em financiado e idioma
const getImageSrc = (isFinanciado: boolean, language: string) => {
 
  const langSuffix = language === 'Português' ? 'pt' : 'es';
  return `${IMG_BASE_URL}proposta-psd-${langSuffix}-2ops.png`;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Obter dados do formulário
    const customerName = searchParams.get('customersNames')?.slice(0, MAX_NAME_LENGTH) || 'Cliente';
    const vehicles = searchParams.get('vehicles')?.slice(0, MAX_VEHICLE_LENGTH) || 'Modelo do Carro';
    const address = searchParams.get('address')?.slice(0, MAX_ADDRESS_LENGTH) || 'Endereço não informado';
    const optionBDueToday = searchParams.get('optionBDueToday') || '0';
    const optionCDueToday = searchParams.get('optionCDueToday') || '0';
    const optionBMonthly = searchParams.get('optionBMonthly') || '0';
    const optionCMonthly = searchParams.get('optionCMonthly') || '0';
    const fee = searchParams.get('fee') || '250';
    const numberOfPayments = searchParams.get('paymentOptions') || '6';
    const language = searchParams.get('language') || 'Português';
    const isFinanciado = searchParams.get('isFinanciado') === 'true';

    // Gerar a imagem correta com base no financiamento e idioma
    const imageSrc = getImageSrc(isFinanciado, language);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          <img src={imageSrc} alt="proposta" />

          {/* Dados principais */}
          <div tw="flex absolute top-100 left-35 w-[150] overflow-hidden">
            <p tw="text-2xl font-extrabold text-black text-right">
              {customerName}
            </p>
          </div>
          <div tw="absolute top-[118] left-[35] flex overflow-hidden w-[150]">
            <p tw="text-2xl font-extrabold text-black text-right">
              {vehicles}
            </p>
          </div>
          <div tw="absolute top-[137] left-[35] flex overflow-hidden w-[150]">
            <p tw="text-2xl font-extrabold text-black text-right">
              {address}
            </p>
          </div>

          {/* Número de parcelas */}
          <div tw="flex absolute top-[119] right-[247] items-left w-[40] justify-center items-center">
            <p tw='text-3xl font-bold text-green-600'>({(parseInt(numberOfPayments) - 1)}x)</p>
          </div> 
          
          {/* Opção B */}
          <div tw="flex absolute top-[162] right-[146] w-[40] justify-center items-center">
            <p tw="text-[33px] font-bold text-black text-right">
              ${(parseInt(optionBDueToday) + parseInt(fee)).toFixed(2)}
            </p>
          </div>
          <div tw="flex absolute top-[162] right-[188] w-[40] justify-center items-center">
            <p tw="text-[33px] font-bold text-black text-right">
              ${(parseFloat(optionBMonthly)).toFixed(2)}
            </p>
          </div>
          <div tw="flex absolute top-[162] right-[105] w-[40] justify-center items-center">
            <p tw="text-[33px] font-extrabold text-black text-right">
              ${calculateTotal(optionBDueToday, fee, optionBMonthly, numberOfPayments)}
            </p>
          </div>

          {/* Opção C */}
          <div tw="flex absolute top-[196] right-[146] w-[40] justify-center items-center">
            <p tw="text-[33px] font-extrabold text-black text-right">
              ${(parseInt(optionCDueToday) + parseInt(fee)).toFixed(2)}
            </p>
          </div>
          <div tw="flex absolute top-[196] right-[188] w-[40] justify-center items-center">
            <p tw="text-[33px] font-extrabold text-black text-right">
              ${(parseFloat(optionCMonthly)).toFixed(2)}
            </p>
          </div>
          <div tw="flex absolute top-[196] right-[105] w-[40] justify-center items-center">
            <p tw="text-[33px] font-extrabold text-black text-right">
              ${calculateTotal(optionCDueToday, fee, optionCMonthly, numberOfPayments)}
            </p>
          </div>
        </div>
      ),
      {
        width: 1920,
        height: 1080,
      }
    );
  } catch (error) {
    console.error('Erro ao gerar a imagem:', error);
    return new Response('Erro ao gerar imagem', { status: 500 });
  }
}
