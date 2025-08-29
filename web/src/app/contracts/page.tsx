'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/lib/toast';
import {
  Search,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Download,
  ArrowRight,
  Brain,
  Calendar,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { formatDate, apiRequest } from '@/lib/utils';
import Link from 'next/link';

interface Contract {
  id: string;
  name: string;
  type: 'emprestimo' | 'financiamento' | 'cartao' | 'conta' | 'outro';
  confidence: number;
  pages: number[];
  keyPoints: string[];
  parties: string[];
  value?: string;
  date?: string;
  location?: string;
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
}

interface Conversion {
  id: string;
  createdAt: string;
  totalPages: number;
  imageFiles: number;
  totalSize: number;
  path: string;
}

// Mock data for demonstration
const mockContracts: Contract[] = [
  {
    id: '1',
    name: 'Contrato de Empréstimo Consignado',
    type: 'emprestimo',
    confidence: 95,
    pages: [1, 2, 3],
    keyPoints: [
      'Taxa de juros: 2,5% ao mês',
      'Valor emprestado: R$ 50.000,00',
      'Prazo: 60 meses',
      'Desconto em folha automático',
    ],
    parties: ['Banco ABC S.A.', 'João Silva'],
    value: 'R$ 50.000,00',
    date: '2024-03-26',
    location: 'São Paulo, SP',
    riskLevel: 'medium',
    summary:
      'Contrato de empréstimo consignado com taxa elevada e cláusulas que podem ser questionadas.',
  },
  {
    id: '2',
    name: 'Cartão de Crédito - Anuidade',
    type: 'cartao',
    confidence: 88,
    pages: [4, 5],
    keyPoints: [
      'Anuidade: R$ 980,00',
      'Taxa rotativo: 15% ao mês',
      'Cobrança antecipada da anuidade',
      'Falta de informação clara sobre cancelamento',
    ],
    parties: ['Banco XYZ', 'Maria Santos'],
    value: 'R$ 980,00',
    date: '2024-03-15',
    riskLevel: 'high',
    summary:
      'Contrato de cartão com práticas abusivas na cobrança de anuidade.',
  },
  {
    id: '3',
    name: 'Financiamento Veicular',
    type: 'financiamento',
    confidence: 92,
    pages: [6, 7, 8, 9],
    keyPoints: [
      'Valor financiado: R$ 45.000,00',
      'Taxa: 1,8% ao mês',
      'Seguro obrigatório questionável',
      'Cláusula de vencimento antecipado',
    ],
    parties: ['Financeira DEF', 'Carlos Oliveira'],
    value: 'R$ 45.000,00',
    date: '2024-02-10',
    riskLevel: 'low',
    summary:
      'Financiamento com condições dentro da normalidade, mas com seguro possivelmente desnecessário.',
  },
];

export default function ContractsPage() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadConversions();
  }, []);

  const loadConversions = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest<{ conversions: Conversion[] }>(
        '/api/v1/pdf/conversions',
      );
      setConversions(response.conversions);

      // For demo purposes, use mock contracts
      // In real app, this would analyze the PDFs with AI
      if (response.conversions.length > 0) {
        setContracts(mockContracts);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar conversões',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.keyPoints.some((point) =>
        point.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesFilter = filterType === 'all' || contract.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const toggleContractSelection = (contractId: string) => {
    setSelectedContracts((prev) =>
      prev.includes(contractId)
        ? prev.filter((id) => id !== contractId)
        : [...prev, contractId],
    );
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'Alto Risco';
      case 'medium':
        return 'Médio Risco';
      case 'low':
        return 'Baixo Risco';
      default:
        return 'Indefinido';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2">Carregando contratos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-secondary-400" />
            <h3 className="mt-2 text-sm font-semibold text-secondary-900">
              Nenhum documento encontrado
            </h3>
            <p className="mt-1 text-sm text-secondary-500">
              Faça upload de documentos PDF para começar a análise.
            </p>
            <div className="mt-6">
              <Link href="/upload">
                <Button>Fazer Upload</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="h-6 w-6 text-primary-600" />
            <h1 className="text-3xl font-bold tracking-tight text-secondary-900">
              Contratos Identificados pela IA
            </h1>
          </div>
          <p className="text-lg text-secondary-600">
            Nossa IA analisou {conversions.length} documento(s) e identificou{' '}
            {contracts.length} contrato(s). Selecione os que deseja incluir na
            petição.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
            <CardDescription>
              Encontre rapidamente os contratos que precisa analisar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <Input
                    placeholder="Buscar por nome, valor, cláusulas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-secondary-300 bg-white text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="emprestimo">Empréstimos</option>
                  <option value="financiamento">Financiamentos</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="conta">Conta Bancária</option>
                  <option value="outro">Outros</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <div className="space-y-4 mb-8">
          {filteredContracts.map((contract) => (
            <Card
              key={contract.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedContracts.includes(contract.id)
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : 'hover:shadow-elegant-lg'
              }`}
              onClick={() => toggleContractSelection(contract.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedContracts.includes(contract.id)
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-secondary-300'
                        }`}
                      >
                        {selectedContracts.includes(contract.id) && (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{contract.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {contract.summary}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getRiskBadgeVariant(contract.riskLevel)}>
                      {getRiskLabel(contract.riskLevel)}
                    </Badge>
                    <Badge variant="outline">
                      {contract.confidence}% confiança
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {contract.value && (
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="h-4 w-4 text-secondary-500" />
                      <span className="font-medium">Valor:</span>
                      <span>{contract.value}</span>
                    </div>
                  )}
                  {contract.date && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-secondary-500" />
                      <span className="font-medium">Data:</span>
                      <span>{formatDate(contract.date)}</span>
                    </div>
                  )}
                  {contract.location && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-secondary-500" />
                      <span className="font-medium">Local:</span>
                      <span>{contract.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    <FileText className="h-4 w-4 text-secondary-500" />
                    <span className="font-medium">Páginas:</span>
                    <span>{contract.pages.join(', ')}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-secondary-900 mb-2">
                    Partes Envolvidas:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {contract.parties.map((party, index) => (
                      <Badge key={index} variant="secondary">
                        {party}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-secondary-900 mb-2">
                    Pontos Críticos Identificados:
                  </h4>
                  <ul className="space-y-1">
                    {contract.keyPoints.map((point, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-sm"
                      >
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-200">
                  <div className="text-sm text-secondary-500">
                    Análise baseada nas páginas {contract.pages.join(', ')} do
                    documento
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Summary & Next Steps */}
        {selectedContracts.length > 0 && (
          <Card className="bg-primary-50 border-primary-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-primary-600" />
                <span>Contratos Selecionados</span>
              </CardTitle>
              <CardDescription>
                {selectedContracts.length} contrato(s) selecionado(s) para
                incluir na petição.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/templates" className="flex-1">
                  <Button className="w-full" size="lg">
                    Criar Petição
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" className="sm:w-auto" size="lg">
                  Exportar Análise
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Disclaimer */}
        <div className="mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">
                Sobre a Análise da IA
              </h3>
            </div>
            <p className="text-yellow-700 text-sm">
              Esta análise foi gerada por inteligência artificial com base no
              conteúdo dos documentos. Os pontos críticos identificados são
              sugestões que devem ser{' '}
              <strong>validadas por um profissional jurídico</strong>. A IA pode
              identificar padrões suspeitos, mas a interpretação legal final
              sempre requer revisão humana especializada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
