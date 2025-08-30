'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/toast';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  Loader2,
  User,
  Calendar,
  Trash2,
} from 'lucide-react';
import { formatFileSize, apiRequest } from '@/lib/utils';
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UploadedFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  result?: any;
  error?: string;
}

interface ExistingDocument {
  id: string;
  filename: string;
  originalName: string;
  createdAt: string;
  totalImages: number;
  status: 'converted' | 'analyzed';
  hasAnalysis: boolean;
  analysisData?: {
    totalContratos: number;
    totalDescontosCartao: number;
    beneficiario: string;
    dataEmissao: string;
  };
}

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState<
    ExistingDocument[]
  >([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [documentAnalysis, setDocumentAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  // const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const { toast } = useToast();

  const loadExistingDocuments = useCallback(async () => {
    try {
      setIsLoadingDocuments(true);
      const response = (await apiRequest('/api/v1/pdf/documents')) as any;
      setExistingDocuments(response.data || []);
    } catch (error: any) {
      console.error('Erro ao carregar documentos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os documentos existentes.',
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [toast]);

  // Carregar documentos existentes
  useEffect(() => {
    loadExistingDocuments();
  }, [loadExistingDocuments]);

  const analyzeDocument = async (documentId: string) => {
    try {
      setIsAnalyzing(true);
      setSelectedDocument(documentId);

      const response = (await apiRequest(`/api/v1/pdf/analyze/${documentId}`, {
        method: 'POST',
      })) as any;

      setDocumentAnalysis(response.analysis);

      // Scroll para a seção de análise após carregar os dados
      setTimeout(() => {
        const analysisSection = document.getElementById('document-analysis');
        if (analysisSection) {
          analysisSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);

      toast({
        variant: 'success',
        title: 'Análise concluída!',
        description: 'Documento analisado com sucesso.',
      });

      // Recarregar lista para atualizar status
      await loadExistingDocuments();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro na análise',
        description: `Não foi possível analisar o documento: ${error.message}`,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const viewDocument = async (documentId: string) => {
    try {
      setIsAnalyzing(true);
      setSelectedDocument(documentId);

      const response = (await apiRequest(`/api/v1/pdf/analyze/${documentId}`, {
        method: 'POST',
      })) as any;

      console.log('🔍 Resposta da análise:', response);
      setDocumentAnalysis(response.analysis);

      // Scroll para a seção de análise após carregar os dados
      setTimeout(() => {
        const analysisSection = document.getElementById('document-analysis');
        if (analysisSection) {
          analysisSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);

      toast({
        variant: 'success',
        title: 'Documento carregado!',
        description: 'Análise carregada do cache com sucesso.',
      });
    } catch (error: any) {
      console.error('❌ Erro ao visualizar documento:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar',
        description: `Não foi possível carregar o documento: ${error.message}`,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      setIsDeleting(true);
      setDocumentToDelete(documentId);

      await apiRequest(`/api/v1/pdf/documents/${documentId}`, {
        method: 'DELETE',
      });

      toast({
        variant: 'success',
        title: 'Documento deletado!',
        description: 'O documento foi removido com sucesso.',
      });

      // Recarregar lista de documentos
      await loadExistingDocuments();

      // Limpar seleção se o documento deletado estava selecionado
      if (selectedDocument === documentId) {
        setDocumentAnalysis(null);
        setSelectedDocument(null);
      }
    } catch (error: any) {
      console.error('❌ Erro ao deletar documento:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar',
        description: `Não foi possível deletar o documento: ${error.message}`,
      });
    } finally {
      setIsDeleting(false);
      setDocumentToDelete(null);
    }
  };

  const confirmDeleteDocument = (documentId: string, documentName: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja deletar o documento "${documentName}"?\n\nEsta ação não pode ser desfeita e removerá permanentemente o documento e sua análise.`,
      )
    ) {
      deleteDocument(documentId);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        if (file.type !== 'application/pdf') {
          toast({
            variant: 'destructive',
            title: 'Arquivo inválido',
            description: `${file.name} não é um arquivo PDF válido.`,
          });
          return false;
        }

        if (file.size > 50 * 1024 * 1024) {
          // 50MB limit
          toast({
            variant: 'destructive',
            title: 'Arquivo muito grande',
            description: `${file.name} excede o limite de 50MB.`,
          });
          return false;
        }

        return true;
      });

      const newFiles: UploadedFile[] = validFiles.map((file) => ({
        file,
        progress: 0,
        status: 'uploading',
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Start upload for each file
      newFiles.forEach((uploadFile, index) => {
        uploadPdf(uploadFile, files.length + index);
      });
    },
    [files.length, toast],
  );

  const uploadPdf = useCallback(
    async (uploadFile: UploadedFile, index: number) => {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', uploadFile.file);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f, i) =>
              i === index && f.status === 'uploading'
                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                : f,
            ),
          );
        }, 200);

        const response = await apiRequest('/api/v1/pdf/convert', {
          method: 'POST',
          body: formData,
          headers: {
            // Remove Content-Type to let fetch set it with boundary for FormData
          },
        });

        clearInterval(progressInterval);

        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? { ...f, progress: 100, status: 'completed', result: response }
              : f,
          ),
        );

        toast({
          variant: 'success',
          title: 'Upload concluído!',
          description: `${uploadFile.file.name} foi processado com sucesso.`,
        });
      } catch (error: any) {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: 'error', error: error.message } : f,
          ),
        );

        toast({
          variant: 'destructive',
          title: 'Erro no upload',
          description: `Falha ao processar ${uploadFile.file.name}: ${error.message}`,
        });
      } finally {
        setIsUploading(false);
      }
    },
    [toast],
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 5,
    disabled: isUploading,
  });

  const completedFiles = files.filter((f) => f.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
            Upload de Documentos
          </h1>
          <p className="mt-4 text-lg text-secondary-600">
            Faça upload dos PDFs que deseja analisar. Nossa IA irá identificar
            contratos, cláusulas importantes e pontos críticos.
          </p>
        </div>

        {/* Documentos Existentes */}
        {!isLoadingDocuments && existingDocuments.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Documentos Convertidos</CardTitle>
              <CardDescription>
                Clique em &ldquo;Analisar&rdquo; para processar os documentos já
                convertidos ou visualize análises existentes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {existingDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="border border-secondary-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-secondary-500" />
                        <div>
                          <p className="font-medium text-secondary-900">
                            {document.originalName}
                          </p>
                          <p className="text-sm text-secondary-500">
                            {new Date(document.createdAt).toLocaleString(
                              'pt-BR',
                            )}{' '}
                            • {document.totalImages} páginas
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            document.status === 'analyzed'
                              ? 'success'
                              : 'default'
                          }
                        >
                          {document.status === 'analyzed'
                            ? 'Analisado'
                            : 'Convertido'}
                        </Badge>
                        {document.hasAnalysis ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDocument(document.id)}
                            disabled={
                              isAnalyzing && selectedDocument === document.id
                            }
                          >
                            {isAnalyzing && selectedDocument === document.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Eye className="h-4 w-4 mr-1" />
                            )}
                            Visualizar
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => analyzeDocument(document.id)}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing && selectedDocument === document.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <ArrowRight className="h-4 w-4 mr-1" />
                            )}
                            Analisar
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            confirmDeleteDocument(
                              document.id,
                              document.originalName,
                            )
                          }
                          disabled={
                            isDeleting && documentToDelete === document.id
                          }
                        >
                          {isDeleting && documentToDelete === document.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                          )}
                          Apagar
                        </Button>
                      </div>
                    </div>

                    {document.hasAnalysis && document.analysisData && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3 text-blue-600" />
                            <span className="text-blue-800">
                              {document.analysisData.beneficiario}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3 text-blue-600" />
                            <span className="text-blue-800">
                              {document.analysisData.totalContratos} contratos
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-blue-600" />
                            <span className="text-blue-800">
                              {document.analysisData.dataEmissao}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                            <span className="text-blue-800">
                              {document.analysisData.totalDescontosCartao}{' '}
                              descontos
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isLoadingDocuments && (
          <Card className="mb-8">
            <CardContent className="py-8">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Carregando documentos...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload de Novos Documentos</CardTitle>
            <CardDescription>
              Arraste e solte os arquivos ou clique para selecionar. Máximo de 5
              arquivos, 50MB cada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
                ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-300 hover:border-primary-400 hover:bg-secondary-50'
                }
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <Upload className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-secondary-900">
                    {isDragActive
                      ? 'Solte os arquivos aqui...'
                      : 'Arraste os PDFs aqui ou clique para selecionar'}
                  </p>
                  <p className="text-sm text-secondary-500 mt-2">
                    Suporta apenas arquivos PDF • Máximo 50MB cada
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Arquivos em Processamento</CardTitle>
              <CardDescription>
                Acompanhe o progresso do upload e conversão dos seus documentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((uploadFile, index) => (
                  <div
                    key={index}
                    className="border border-secondary-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-secondary-500" />
                        <div>
                          <p className="font-medium text-secondary-900">
                            {uploadFile.file.name}
                          </p>
                          <p className="text-sm text-secondary-500">
                            {formatFileSize(uploadFile.file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {uploadFile.status === 'completed' && (
                          <Badge variant="success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Concluído
                          </Badge>
                        )}
                        {uploadFile.status === 'error' && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Erro
                          </Badge>
                        )}
                        {uploadFile.status === 'uploading' && (
                          <Badge variant="default">Processando...</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          disabled={uploadFile.status === 'uploading'}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="mb-2" />
                    )}

                    {uploadFile.status === 'error' && uploadFile.error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                        <p className="text-sm text-red-800">
                          {uploadFile.error}
                        </p>
                      </div>
                    )}

                    {uploadFile.status === 'completed' && uploadFile.result && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
                        <p className="text-sm text-green-800">
                          ✅ {uploadFile.result.totalPages} páginas convertidas
                          •{uploadFile.result.images?.length || 0} imagens
                          geradas
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        {completedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Próximos Passos</span>
              </CardTitle>
              <CardDescription>
                Seus documentos foram processados com sucesso. Agora você pode
                analisá-los.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contracts" className="flex-1">
                  <Button className="w-full" size="lg">
                    Analisar Contratos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/documents" className="flex-1">
                  <Button variant="outline" className="w-full" size="lg">
                    Ver Conversões
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Analysis Viewer */}
        {documentAnalysis && (
          <Card id="document-analysis" className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Análise do Documento</CardTitle>
                  <CardDescription>
                    Dados estruturados extraídos pela IA do documento
                    selecionado.
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="default"
                    onClick={() => router.push(`/analysis/${selectedDocument}`)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Ver Análise Completa
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDocumentAnalysis(null);
                      setSelectedDocument(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Fechar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DocumentViewer
                analysis={documentAnalysis}
                isLoading={isAnalyzing && selectedDocument !== null}
              />
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <div className="mt-12 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Importante</h3>
            </div>
            <p className="text-yellow-700">
              Lembre-se de que a análise da IA é uma ferramenta de apoio.
              <strong> A revisão humana é sempre obrigatória</strong> antes de
              tomar qualquer ação jurídica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
