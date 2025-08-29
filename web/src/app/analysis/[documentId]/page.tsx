'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/toast';
import {
  ArrowLeft,
  FileText,
  Calendar,
  CreditCard,
  DollarSign,
  Clock,
  MapPin,
} from 'lucide-react';
import { apiRequest } from '@/lib/utils';

interface ContractDetails {
  contrato: string;
  banco: string;
  situacao: string;
  origem_averbacao: string;
  data_inclusao: string;
  inicio_desconto: string;
  fim_desconto: string;
  qtd_parcelas: string;
  parcela: string;
  emprestado: string;
  liberado: string;
  iof: string;
  cet_mensal: string;
  cet_anual: string;
  taxa_juros_mensal: string;
  taxa_juros_anual: string;
  valor_pago: string;
  primeiro_desconto: string;
  suspensao_banco: string;
  suspensao_inss: string;
  reativacao_banco: string;
  reativacao_inss: string;
  data_exclusao?: string;
  origem_da_exclusao?: string;
  motivo_da_exclusao?: string;
  [key: string]: any;
}

interface DiscountDetails {
  contrato: string;
  tipo: string;
  banco: string;
  situacao: string;
  competencia: string;
  saldo_devedor: string;
  desconto: string;
  utilizado_no_mes: string;
  iof: string;
  cet_mensal: string;
  cet_anual: string;
  taxa_juros_mensal: string;
  taxa_juros_anual: string;
  [key: string]: any;
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const documentId = params.documentId as string;

  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'contracts' | 'discounts' | 'raw'
  >('overview');

  useEffect(() => {
    loadAnalysis();
  }, [documentId]);

  const loadAnalysis = async () => {
    try {
      setIsLoading(true);
      const response = (await apiRequest(`/api/v1/pdf/analyze/${documentId}`, {
        method: 'POST',
      })) as any;
      if (response && response.analysis) {
        setAnalysis(response.analysis);
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar análise',
          description: 'Não foi possível carregar a análise',
        });
        router.push('/upload');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar análise',
        description: error.message,
      });
      router.push('/upload');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Análise não encontrada
            </h1>
            <Button onClick={() => router.push('/upload')} className="mt-4">
              Voltar para Upload
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const ContractCard = ({
    contract,
    index,
  }: {
    contract: ContractDetails;
    index: number;
  }) => (
    <Card key={index} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{contract.contrato}</CardTitle>
            <CardDescription className="text-sm">
              {contract.banco}
            </CardDescription>
          </div>
          <Badge
            variant={
              contract.situacao?.toLowerCase().includes('ativo')
                ? 'default'
                : contract.situacao?.toLowerCase().includes('excluído')
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {contract.situacao}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Origem e Datas
            </h4>
            <div className="space-y-1">
              <div>
                <span className="text-gray-600">Origem:</span>{' '}
                {contract.origem_averbacao || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Data Inclusão:</span>{' '}
                {contract.data_inclusao || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Início Desconto:</span>{' '}
                {contract.inicio_desconto || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Fim Desconto:</span>{' '}
                {contract.fim_desconto || 'N/A'}
              </div>
              {contract.data_exclusao && (
                <div>
                  <span className="text-gray-600">Data Exclusão:</span>{' '}
                  {contract.data_exclusao}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Valores Financeiros
            </h4>
            <div className="space-y-1">
              <div>
                <span className="text-gray-600">Parcelas:</span>{' '}
                {contract.qtd_parcelas || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Valor Parcela:</span>{' '}
                {contract.parcela || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Emprestado:</span>{' '}
                {contract.emprestado || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Liberado:</span>{' '}
                {contract.liberado || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">IOF:</span>{' '}
                {contract.iof || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Valor Pago:</span>{' '}
                {contract.valor_pago || 'N/A'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Taxas e Status
            </h4>
            <div className="space-y-1">
              <div>
                <span className="text-gray-600">CET Mensal:</span>{' '}
                {contract.cet_mensal || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">CET Anual:</span>{' '}
                {contract.cet_anual || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Taxa Juros Mensal:</span>{' '}
                {contract.taxa_juros_mensal || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Taxa Juros Anual:</span>{' '}
                {contract.taxa_juros_anual || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Primeiro Desconto:</span>{' '}
                {contract.primeiro_desconto || 'N/A'}
              </div>
              {contract.origem_da_exclusao && (
                <div>
                  <span className="text-gray-600">Origem Exclusão:</span>{' '}
                  {contract.origem_da_exclusao}
                </div>
              )}
              {contract.motivo_da_exclusao && (
                <div>
                  <span className="text-gray-600">Motivo Exclusão:</span>{' '}
                  {contract.motivo_da_exclusao}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DiscountCard = ({
    discount,
    index,
  }: {
    discount: DiscountDetails;
    index: number;
  }) => (
    <Card key={index} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{discount.contrato}</CardTitle>
            <CardDescription className="text-sm">
              {discount.banco}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{discount.tipo}</Badge>
            <Badge
              variant={
                discount.situacao?.toLowerCase().includes('ativo')
                  ? 'default'
                  : 'secondary'
              }
            >
              {discount.situacao}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Período e Competência
            </h4>
            <div className="space-y-1">
              <div>
                <span className="text-gray-600">Competência:</span>{' '}
                {discount.competencia || 'N/A'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Valores do Cartão
            </h4>
            <div className="space-y-1">
              <div>
                <span className="text-gray-600">Saldo Devedor:</span>{' '}
                {discount.saldo_devedor || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Desconto:</span>{' '}
                {discount.desconto || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Utilizado no Mês:</span>{' '}
                {discount.utilizado_no_mes || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">IOF:</span>{' '}
                {discount.iof || 'N/A'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Taxas de Juros
            </h4>
            <div className="space-y-1">
              <div>
                <span className="text-gray-600">CET Mensal:</span>{' '}
                {discount.cet_mensal || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">CET Anual:</span>{' '}
                {discount.cet_anual || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Taxa Juros Mensal:</span>{' '}
                {discount.taxa_juros_mensal || 'N/A'}
              </div>
              <div>
                <span className="text-gray-600">Taxa Juros Anual:</span>{' '}
                {discount.taxa_juros_anual || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/upload')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Upload
          </Button>

          <h1 className="text-3xl font-bold text-secondary-900">
            Análise Completa do Documento
          </h1>
          <p className="text-lg text-secondary-600 mt-2">
            {analysis.beneficiario?.nome || 'Documento Analisado'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Visão Geral', icon: FileText },
                {
                  id: 'contracts',
                  label: `Contratos (${analysis.contratos?.length || 0})`,
                  icon: FileText,
                },
                {
                  id: 'discounts',
                  label: `Descontos Cartão (${analysis.descontos_cartao?.length || 0})`,
                  icon: CreditCard,
                },
                { id: 'raw', label: 'Dados Brutos', icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {analysis.contratos?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Total de Contratos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-secondary-600">
                  {analysis.descontos_cartao?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Descontos de Cartão</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent-600">
                  {analysis.quantitativo_emprestimos?.ativos || 0}
                </div>
                <div className="text-sm text-gray-600">Contratos Ativos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-600">
                  {analysis.metadata?.total_paginas || 0}
                </div>
                <div className="text-sm text-gray-600">Páginas Processadas</div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Todos os Contratos Bancários
            </h2>
            {analysis.contratos?.map(
              (contract: ContractDetails, index: number) => (
                <ContractCard key={index} contract={contract} index={index} />
              ),
            )}
          </div>
        )}

        {activeTab === 'discounts' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Todos os Descontos de Cartão
            </h2>
            {analysis.descontos_cartao?.map(
              (discount: DiscountDetails, index: number) => (
                <DiscountCard key={index} discount={discount} index={index} />
              ),
            )}
          </div>
        )}

        {activeTab === 'raw' && (
          <Card>
            <CardHeader>
              <CardTitle>Dados Brutos (JSON)</CardTitle>
              <CardDescription>
                Estrutura completa dos dados extraídos pela IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                  {JSON.stringify(analysis, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
