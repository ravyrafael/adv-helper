'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronRight,
  User,
  CreditCard,
  FileText,
  Calendar,
} from 'lucide-react';

interface DocumentAnalysis {
  metadata?: {
    fonte: string;
    documento: string;
    total_paginas: number;
    data_processamento: string;
  };
  beneficiario?: {
    nome: string;
    [key: string]: any;
  };
  quantitativo_emprestimos?: {
    ativos: number;
    suspensos: number;
    reservados_portabilidade: number;
    reservados_refinanciamento: number;
  };
  valores_do_beneficio?: {
    base_de_calculo: string;
    maximo_de_comprometimento_permitido: string;
    total_comprometido: string;
    margem_extrapolada: string;
  };
  contratos?: Array<{
    contrato: string;
    banco: string;
    situação?: string;
    'origem da averbação'?: string;
    'data inclusão'?: string;
    valor?: {
      emprestado: string;
      liberado: string;
    };
    [key: string]: any;
  }>;
  descontos_cartao?: Array<{
    contrato: string;
    tipo: string;
    banco: string;
    situacao: string;
    competencia: string;
    saldo_devedor: string;
    desconto: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

interface DocumentViewerProps {
  analysis: DocumentAnalysis;
  isLoading?: boolean;
}

export function DocumentViewer({ analysis, isLoading }: DocumentViewerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['overview']),
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">Nenhum dado de análise disponível</p>
      </Card>
    );
  }

  const Section = ({
    title,
    icon: Icon,
    children,
    sectionKey,
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    sectionKey: string;
  }) => {
    const isExpanded = expandedSections.has(sectionKey);

    return (
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-left">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">{children}</div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Visão Geral */}
      <Section title="Visão Geral" icon={FileText} sectionKey="overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {analysis.contratos?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Contratos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-600">
              {analysis.descontos_cartao?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Descontos Cartão</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-600">
              {analysis.quantitativo_emprestimos?.ativos || 0}
            </div>
            <div className="text-sm text-gray-600">Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {analysis.metadata?.total_paginas || 0}
            </div>
            <div className="text-sm text-gray-600">Páginas</div>
          </div>
        </div>
      </Section>

      {/* Beneficiário */}
      {analysis.beneficiario && (
        <Section title="Beneficiário" icon={User} sectionKey="beneficiario">
          <div className="mt-4 space-y-3">
            <div>
              <span className="font-medium text-gray-700">Nome:</span>
              <span className="ml-2">{analysis.beneficiario.nome}</span>
            </div>
            {Object.entries(analysis.beneficiario)
              .filter(([key]) => key !== 'nome')
              .slice(0, 5)
              .map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="ml-2">
                    {typeof value === 'object'
                      ? JSON.stringify(value)
                      : String(value)}
                  </span>
                </div>
              ))}
          </div>
        </Section>
      )}

      {/* Valores do Benefício */}
      {analysis.valores_do_beneficio && (
        <Section
          title="Valores do Benefício"
          icon={Calendar}
          sectionKey="valores"
        >
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.valores_do_beneficio).map(
              ([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="text-right">{String(value)}</span>
                </div>
              ),
            )}
          </div>
        </Section>
      )}

      {/* Contratos */}
      {analysis.contratos && analysis.contratos.length > 0 && (
        <Section
          title="Contratos Bancários"
          icon={FileText}
          sectionKey="contratos"
        >
          <div className="mt-4 space-y-4">
            {analysis.contratos.slice(0, 5).map((contrato, index) => (
              <Card key={index} className="p-4 border-l-4 border-l-primary-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{contrato.contrato}</h4>
                    <p className="text-sm text-gray-600">{contrato.banco}</p>
                  </div>
                  <Badge
                    variant={
                      contrato.situação?.toLowerCase().includes('ativo')
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {contrato.situação || 'N/A'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Emprestado:</span>
                    <span className="ml-1 font-medium">
                      {contrato.valor?.emprestado || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Liberado:</span>
                    <span className="ml-1 font-medium">
                      {contrato.valor?.liberado || 'N/A'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
            {analysis.contratos.length > 5 && (
              <div className="text-center">
                <Badge variant="outline">
                  +{analysis.contratos.length - 5} contratos adicionais
                </Badge>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Descontos de Cartão */}
      {analysis.descontos_cartao && analysis.descontos_cartao.length > 0 && (
        <Section
          title="Descontos de Cartão"
          icon={CreditCard}
          sectionKey="cartao"
        >
          <div className="mt-4 space-y-4">
            {analysis.descontos_cartao.slice(0, 5).map((desconto, index) => (
              <Card
                key={index}
                className="p-4 border-l-4 border-l-secondary-500"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{desconto.contrato}</h4>
                    <p className="text-sm text-gray-600">{desconto.banco}</p>
                  </div>
                  <Badge
                    variant={
                      desconto.situacao?.toLowerCase().includes('ativo')
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {desconto.situacao}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Saldo Devedor:</span>
                    <span className="ml-1 font-medium">
                      {desconto.saldo_devedor}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Desconto:</span>
                    <span className="ml-1 font-medium">
                      {desconto.desconto}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
            {analysis.descontos_cartao.length > 5 && (
              <div className="text-center">
                <Badge variant="outline">
                  +{analysis.descontos_cartao.length - 5} descontos adicionais
                </Badge>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Dados Técnicos */}
      {analysis.metadata && (
        <Section
          title="Informações do Documento"
          icon={FileText}
          sectionKey="metadata"
        >
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Fonte:</span>
              <span>{analysis.metadata.fonte}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Documento:</span>
              <span>{analysis.metadata.documento}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total de Páginas:</span>
              <span>{analysis.metadata.total_paginas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processado em:</span>
              <span>
                {new Date(analysis.metadata.data_processamento).toLocaleString(
                  'pt-BR',
                )}
              </span>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
