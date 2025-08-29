import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Search,
  FileText,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  Scale,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm font-medium"
            >
              <Zap className="mr-2 h-4 w-4" />
              Powered by AI
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-6xl">
              Encontre pontos críticos
              <span className="text-gradient block mt-2">em segundos</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-xl leading-8 text-secondary-600 max-w-2xl mx-auto">
              Plataforma de assistência jurídica que utiliza IA para analisar
              documentos PDF, identificar cláusulas importantes e acelerar a
              criação de petições.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/upload">
                <Button size="xl" className="font-semibold">
                  Começar agora
                  <Upload className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                Ver demonstração
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-secondary-500">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>LGPD Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span>Dados Seguros</span>
              </div>
              <div className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-primary-500" />
                <span>Auditável</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div
          className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
          aria-hidden="true"
        >
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary-200 to-accent-200 opacity-30"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Como funciona
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
              Transforme documentos em petições em 3 passos
            </p>
            <p className="mt-6 text-lg leading-8 text-secondary-600">
              Nossa IA analisa seus documentos e acelera a criação de petições
              jurídicas com precisão e confiabilidade.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="accent" className="font-bold">
                    01
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                    <Upload className="h-6 w-6 text-primary-600" />
                  </div>
                  <CardTitle>Upload do PDF</CardTitle>
                  <CardDescription>
                    Faça upload do documento que precisa analisar. Suportamos
                    contratos, acordos e documentos jurídicos de qualquer
                    tamanho.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Drag & drop intuitivo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Validação automática</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Feedback em tempo real</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="accent" className="font-bold">
                    02
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-100">
                    <Search className="h-6 w-6 text-secondary-600" />
                  </div>
                  <CardTitle>Análise Inteligente</CardTitle>
                  <CardDescription>
                    Nossa IA identifica contratos, cláusulas importantes e
                    pontos críticos que merecem atenção especial na petição.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Detecção de contratos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Análise de cláusulas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Pontos críticos destacados</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="accent" className="font-bold">
                    03
                  </Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100">
                    <FileText className="h-6 w-6 text-accent-600" />
                  </div>
                  <CardTitle>Gere a Petição</CardTitle>
                  <CardDescription>
                    Crie petições personalizadas usando nossos templates
                    inteligentes com os dados extraídos automaticamente.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Templates personalizáveis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Dados preenchidos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Export PDF/DOCX</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Características
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
              Tecnologia jurídica de ponta
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-primary-100">
                  <Clock className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-secondary-900">
                  Economia de Tempo
                </h3>
                <p className="mt-2 text-secondary-600">
                  Reduza horas de análise manual para minutos com nossa IA
                  especializada.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-secondary-100">
                  <Shield className="h-8 w-8 text-secondary-600" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-secondary-900">
                  Segurança Total
                </h3>
                <p className="mt-2 text-secondary-600">
                  Seus documentos são processados com criptografia e
                  conformidade LGPD.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-accent-100">
                  <Scale className="h-8 w-8 text-accent-600" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-secondary-900">
                  Auditabilidade
                </h3>
                <p className="mt-2 text-secondary-600">
                  Todas as análises são rastreáveis com referências de página e
                  justificativas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para acelerar sua prática jurídica?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Comece gratuitamente e descubra como nossa IA pode transformar sua
              análise de documentos.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/upload">
                <Button size="xl" variant="secondary">
                  Começar agora
                  <Upload className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-primary-200">
              ⚠️ Lembre-se: A revisão humana é sempre obrigatória
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
