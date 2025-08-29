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
  FileText,
  Download,
  Eye,
  Calendar,
  Clock,
  FileDown,
  Share2,
  Edit,
  Trash2,
  RefreshCw,
  Printer,
  Search,
  Filter,
  Plus,
} from 'lucide-react';
import { formatDate, formatFileSize, apiRequest } from '@/lib/utils';
import Link from 'next/link';

interface Document {
  id: string;
  name: string;
  type: 'petition' | 'analysis' | 'template';
  status: 'draft' | 'completed' | 'archived';
  createdAt: string;
  lastModified: string;
  size: number;
  pages: number;
  template: string;
  contracts: string[];
  author: string;
  version: number;
  downloadCount: number;
}

interface Conversion {
  id: string;
  createdAt: string;
  totalPages: number;
  imageFiles: number;
  totalSize: number;
  path: string;
}

// Mock documents
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Petição Inicial - João Silva vs Banco ABC',
    type: 'petition',
    status: 'completed',
    createdAt: '2024-03-26T10:30:00Z',
    lastModified: '2024-03-26T14:45:00Z',
    size: 245760, // ~240KB
    pages: 8,
    template: 'Empréstimo Consignado',
    contracts: ['Contrato de Empréstimo Consignado'],
    author: 'Dr. André Silva',
    version: 2,
    downloadCount: 3,
  },
  {
    id: '2',
    name: 'Análise Técnica - Cartão de Crédito',
    type: 'analysis',
    status: 'draft',
    createdAt: '2024-03-25T16:20:00Z',
    lastModified: '2024-03-26T09:15:00Z',
    size: 156432,
    pages: 5,
    template: 'Cartão de Crédito',
    contracts: ['Cartão de Crédito - Anuidade'],
    author: 'Dr. André Silva',
    version: 1,
    downloadCount: 0,
  },
  {
    id: '3',
    name: 'Petição Revisional - Financiamento Veicular',
    type: 'petition',
    status: 'completed',
    createdAt: '2024-03-24T11:00:00Z',
    lastModified: '2024-03-24T15:30:00Z',
    size: 198745,
    pages: 6,
    template: 'Financiamento Veicular',
    contracts: ['Financiamento Veicular'],
    author: 'Dr. André Silva',
    version: 1,
    downloadCount: 5,
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
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

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.contracts.some((contract) =>
        contract.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      default:
        return 'Indefinido';
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'petition':
        return 'default';
      case 'analysis':
        return 'accent';
      case 'template':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'petition':
        return 'Petição';
      case 'analysis':
        return 'Análise';
      case 'template':
        return 'Template';
      default:
        return 'Outro';
    }
  };

  const downloadDocument = (documentId: string) => {
    // In a real app, this would trigger the actual download
    const doc = documents.find((d) => d.id === documentId);
    if (doc) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === documentId
            ? { ...d, downloadCount: d.downloadCount + 1 }
            : d,
        ),
      );
      toast({
        variant: 'success',
        title: 'Download iniciado!',
        description: `${doc.name} está sendo baixado.`,
      });
    }
  };

  const deleteDocument = (documentId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== documentId));
    toast({
      variant: 'success',
      title: 'Documento removido!',
      description: 'O documento foi removido com sucesso.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2">Carregando documentos...</span>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-secondary-900">
                Documentos Gerados
              </h1>
              <p className="mt-2 text-lg text-secondary-600">
                Gerencie suas petições, análises e templates criados com a IA.
              </p>
            </div>
            <Link href="/templates">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Novo Documento
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-secondary-900">
                    {documents.length}
                  </p>
                  <p className="text-sm text-secondary-600">
                    Total de documentos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-secondary-900">
                    {documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}
                  </p>
                  <p className="text-sm text-secondary-600">
                    Downloads realizados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Edit className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-secondary-900">
                    {documents.filter((d) => d.status === 'draft').length}
                  </p>
                  <p className="text-sm text-secondary-600">Em rascunho</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-secondary-900">
                    {conversions.length}
                  </p>
                  <p className="text-sm text-secondary-600">PDFs processados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <Input
                    placeholder="Buscar documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-secondary-300 bg-white text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="all">Todos os status</option>
                  <option value="completed">Concluído</option>
                  <option value="draft">Rascunho</option>
                  <option value="archived">Arquivado</option>
                </select>
              </div>
              <div className="sm:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-secondary-300 bg-white text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="petition">Petições</option>
                  <option value="analysis">Análises</option>
                  <option value="template">Templates</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.map((document) => (
            <Card
              key={document.id}
              className="hover:shadow-elegant-lg transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{document.name}</CardTitle>
                      <Badge variant={getStatusVariant(document.status)}>
                        {getStatusLabel(document.status)}
                      </Badge>
                      <Badge variant={getTypeVariant(document.type)}>
                        {getTypeLabel(document.type)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Baseado no template: {document.template} •{' '}
                      {document.pages} páginas
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadDocument(document.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDocument(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <Calendar className="h-4 w-4" />
                    <span>Criado: {formatDate(document.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <Clock className="h-4 w-4" />
                    <span>Modificado: {formatDate(document.lastModified)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <FileDown className="h-4 w-4" />
                    <span>{formatFileSize(document.size)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <Download className="h-4 w-4" />
                    <span>{document.downloadCount} downloads</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-900 mb-1">
                      Contratos incluídos:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {document.contracts.map((contract, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {contract}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={() => downloadDocument(document.id)}>
                      <Download className="h-4 w-4 mr-1" />
                      Baixar PDF
                    </Button>
                    <Button variant="outline">
                      <Printer className="h-4 w-4 mr-1" />
                      Imprimir
                    </Button>
                  </div>
                </div>

                {document.version > 1 && (
                  <div className="mt-4 pt-4 border-t border-secondary-200">
                    <p className="text-sm text-secondary-500">
                      Versão {document.version} • Autor: {document.author}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <FileText className="mx-auto h-8 w-8 text-secondary-400 mb-2" />
                <p className="text-secondary-600">
                  {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                    ? 'Nenhum documento encontrado com os filtros aplicados.'
                    : 'Nenhum documento foi gerado ainda.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
              <CardDescription>
                Continue seu fluxo de trabalho com estas ações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/upload">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Plus className="h-6 w-6" />
                    <span>Analisar Novo PDF</span>
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <FileText className="h-6 w-6" />
                    <span>Criar Template</span>
                  </Button>
                </Link>
                <Link href="/contracts">
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <RefreshCw className="h-6 w-6" />
                    <span>Revisar Contratos</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
