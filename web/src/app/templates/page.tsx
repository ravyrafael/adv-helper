'use client';

import { useState } from 'react';
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
  Edit3,
  Copy,
  Trash2,
  Plus,
  Save,
  Eye,
  ArrowRight,
  Download,
  Code,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'consignado' | 'cartao' | 'financiamento' | 'geral';
  content: string;
  placeholders: string[];
  createdAt: string;
  isDefault: boolean;
  usage: number;
}

// Mock templates
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Petição Inicial - Empréstimo Consignado',
    description:
      'Template para questionar práticas abusivas em contratos de empréstimo consignado',
    category: 'consignado',
    content: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA {{vara}} VARA CÍVEL DA COMARCA DE {{comarca}}

{{requerente}}, {{qualificacao_requerente}}, vem respeitosamente à presença de Vossa Excelência, por intermédio de seu advogado que esta subscreve, propor a presente

AÇÃO REVISIONAL DE CONTRATO C/C REPETIÇÃO DE INDÉBITO

em face de {{requerido}}, {{qualificacao_requerido}}, pelos fundamentos de fato e de direito que passa a expor:

I - DOS FATOS

O requerente celebrou contrato de empréstimo consignado com o requerido em {{data_contrato}}, no valor de {{valor_emprestado}}.

Ocorre que o contrato apresenta as seguintes irregularidades:

{{pontos_criticos}}

II - DO DIREITO

{{fundamentacao_juridica}}

III - DOS PEDIDOS

Diante do exposto, requer:

a) A revisão do contrato para afastar as cláusulas abusivas;
b) A repetição do indébito dos valores pagos indevidamente;
c) A condenação do réu ao pagamento das custas e honorários advocatícios.

Termos em que pede deferimento.

{{local}}, {{data}}.

{{advogado}}`,
    placeholders: [
      '{{vara}}',
      '{{comarca}}',
      '{{requerente}}',
      '{{qualificacao_requerente}}',
      '{{requerido}}',
      '{{qualificacao_requerido}}',
      '{{data_contrato}}',
      '{{valor_emprestado}}',
      '{{pontos_criticos}}',
      '{{fundamentacao_juridica}}',
      '{{local}}',
      '{{data}}',
      '{{advogado}}',
    ],
    createdAt: '2024-01-15',
    isDefault: true,
    usage: 45,
  },
  {
    id: '2',
    name: 'Petição - Cartão de Crédito Abusivo',
    description:
      'Template para questionar cobranças abusivas em cartão de crédito',
    category: 'cartao',
    content: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO

{{requerente}} vem propor AÇÃO DECLARATÓRIA DE INEXIGIBILIDADE DE DÉBITO C/C DANOS MORAIS em face de {{requerido}}.

I - BREVE RELATO DOS FATOS

O autor é portador do cartão de crédito nº {{numero_cartao}} emitido pelo réu.

Verificou-se as seguintes irregularidades:
{{pontos_criticos}}

II - DA COBRANÇA DE ANUIDADE ANTECIPADA

{{fundamentacao_anuidade}}

III - DOS PEDIDOS

Ante o exposto, requer-se:
a) Declaração de inexigibilidade dos débitos;
b) Restituição em dobro dos valores cobrados indevidamente;
c) Indenização por danos morais.

{{local}}, {{data}}.`,
    placeholders: [
      '{{requerente}}',
      '{{requerido}}',
      '{{numero_cartao}}',
      '{{pontos_criticos}}',
      '{{fundamentacao_anuidade}}',
      '{{local}}',
      '{{data}}',
    ],
    createdAt: '2024-02-01',
    isDefault: true,
    usage: 32,
  },
  {
    id: '3',
    name: 'Petição - Financiamento Veicular',
    description:
      'Template para revisão de contratos de financiamento de veículos',
    category: 'financiamento',
    content: `AÇÃO REVISIONAL DE CONTRATO DE FINANCIAMENTO

{{requerente}} propõe a presente ação em face de {{requerido}}.

O autor adquiriu o veículo {{veiculo}} através de financiamento no valor de {{valor_financiado}}.

VÍCIOS CONTRATUAIS IDENTIFICADOS:
{{pontos_criticos}}

PEDIDOS:
- Revisão das cláusulas abusivas
- Recálculo do débito
- Repetição do indébito

{{local}}, {{data}}.`,
    placeholders: [
      '{{requerente}}',
      '{{requerido}}',
      '{{veiculo}}',
      '{{valor_financiado}}',
      '{{pontos_criticos}}',
      '{{local}}',
      '{{data}}',
    ],
    createdAt: '2024-01-20',
    isDefault: false,
    usage: 18,
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { toast } = useToast();

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const startEditing = (template: Template) => {
    setSelectedTemplate(template);
    setEditContent(template.content);
    setIsEditing(true);
  };

  const saveTemplate = () => {
    if (!selectedTemplate) return;

    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id ? { ...t, content: editContent } : t,
      ),
    );

    setIsEditing(false);
    toast({
      variant: 'success',
      title: 'Template salvo!',
      description: 'As alterações foram salvas com sucesso.',
    });
  };

  const duplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Cópia)`,
      isDefault: false,
      usage: 0,
      createdAt: new Date().toISOString(),
    };

    setTemplates((prev) => [...prev, newTemplate]);
    toast({
      variant: 'success',
      title: 'Template duplicado!',
      description: 'Uma cópia do template foi criada.',
    });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    toast({
      variant: 'success',
      title: 'Template removido!',
      description: 'O template foi removido com sucesso.',
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'consignado':
        return 'Empréstimo Consignado';
      case 'cartao':
        return 'Cartão de Crédito';
      case 'financiamento':
        return 'Financiamento';
      case 'geral':
        return 'Geral';
      default:
        return 'Outros';
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'consignado':
        return 'default';
      case 'cartao':
        return 'secondary';
      case 'financiamento':
        return 'accent';
      case 'geral':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-secondary-900">
                Templates de Petição
              </h1>
              <p className="mt-2 text-lg text-secondary-600">
                Crie e gerencie templates inteligentes para acelerar a criação
                de petições jurídicas.
              </p>
            </div>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Novo Template
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Templates List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="sm:w-48">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-secondary-300 bg-white text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    >
                      <option value="all">Todas as categorias</option>
                      <option value="consignado">Empréstimo Consignado</option>
                      <option value="cartao">Cartão de Crédito</option>
                      <option value="financiamento">Financiamento</option>
                      <option value="geral">Geral</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Templates Grid */}
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-elegant-lg ${
                    selectedTemplate?.id === template.id
                      ? 'ring-2 ring-primary-500'
                      : ''
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-lg">
                            {template.name}
                          </CardTitle>
                          {template.isDefault && (
                            <Badge variant="accent">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Padrão
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getCategoryVariant(template.category)}>
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-secondary-500">
                        <span>Usado {template.usage} vezes</span>
                        <span>•</span>
                        <span>{template.placeholders.length} placeholders</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(template);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateTemplate(template);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {!template.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTemplate(template.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Template Preview/Editor */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {selectedTemplate ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {isEditing
                          ? 'Editando Template'
                          : 'Preview do Template'}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsEditing(false)}
                            >
                              Cancelar
                            </Button>
                            <Button size="sm" onClick={saveTemplate}>
                              <Save className="h-4 w-4 mr-1" />
                              Salvar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(selectedTemplate)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      {selectedTemplate.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-96 p-3 border border-secondary-300 rounded-lg font-mono text-sm resize-none focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        placeholder="Conteúdo do template..."
                      />
                    ) : (
                      <div className="space-y-4">
                        <div className="max-h-64 overflow-y-auto bg-secondary-50 p-3 rounded-lg">
                          <pre className="text-xs font-mono text-secondary-700 whitespace-pre-wrap">
                            {selectedTemplate.content.substring(0, 500)}
                            {selectedTemplate.content.length > 500 && '...'}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-medium text-secondary-900 mb-2">
                            Placeholders ({selectedTemplate.placeholders.length}
                            )
                          </h4>
                          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {selectedTemplate.placeholders.map(
                              (placeholder, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  <Code className="h-3 w-3 mr-1" />
                                  {placeholder}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-secondary-200">
                          <Link href="/documents">
                            <Button className="w-full" size="lg">
                              Usar Template
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-secondary-400 mb-4" />
                      <h3 className="text-lg font-medium text-secondary-900 mb-2">
                        Selecione um Template
                      </h3>
                      <p className="text-sm text-secondary-500">
                        Clique em um template ao lado para visualizar e editar.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acelere seu fluxo de trabalho com estas opções.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Plus className="h-6 w-6" />
                  <span>Criar Novo Template</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Download className="h-6 w-6" />
                  <span>Importar Template</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <FileText className="h-6 w-6" />
                  <span>Gerar Petição</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
