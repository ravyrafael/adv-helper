# AdvHelper - Assistência Jurídica com IA

> 🏛️ Plataforma inteligente para análise de documentos jurídicos e geração automatizada de petições

## 📖 Sobre o Projeto

O **AdvHelper** é uma plataforma completa de assistência jurídica que utiliza inteligência artificial para:

- 📄 **Converter PDFs em imagens** de alta qualidade
- 🔍 **Analisar contratos** e identificar pontos críticos automaticamente
- ⚖️ **Detectar cláusulas abusivas** em documentos jurídicos
- 📝 **Gerar petições personalizadas** usando templates inteligentes
- 📊 **Fornecer análises auditáveis** com referências de página

## 🏗️ Arquitetura do Projeto

Este é um **monorepo** com duas aplicações principais:

```
adv-helper/
├── 🌐 web/          # Frontend Next.js
├── 🚀 server/       # Backend NestJS
├── 📁 docs/         # Documentos de exemplo
├── 📁 output/       # Arquivos processados
└── 📄 package.json  # Configuração do monorepo
```

### 🌐 Frontend (Next.js)

- **Framework**: Next.js 15 com App Router
- **UI**: Tailwind CSS + Componentes personalizados
- **Linguagem**: TypeScript
- **Funcionalidades**:
  - Interface elegante e responsiva
  - Upload drag-and-drop de PDFs
  - Visualização de resultados da IA
  - Editor de templates de petição
  - Sistema de notificações

### 🚀 Backend (NestJS)

- **Framework**: NestJS com TypeScript
- **Arquitetura**: Modular (PDF, Auth, Common modules)
- **Conversão**: pdf-to-img (puro JavaScript)
- **Funcionalidades**:
  - API RESTful com Swagger
  - Conversão de PDF para imagem
  - Rate limiting e segurança
  - Worker threads para ES modules
  - Logs estruturados

## 🚀 Como Executar

### Pré-requisitos

- Node.js >= 18.0.0
- npm >= 8.0.0

### Instalação e Execução

```bash
# 1. Clonar o repositório
git clone <repository-url>
cd adv-helper

# 2. Instalar dependências
npm install

# 3. Executar em modo desenvolvimento
npm run dev

# Ou executar individualmente:
npm run dev:web    # Frontend na porta 3001
npm run dev:server # Backend na porta 3000
```

### URLs de Acesso

- 🌐 **Frontend**: http://localhost:3001
- 🚀 **API**: http://localhost:3000
- 📚 **Documentação**: http://localhost:3000/api/docs

## 📁 Estrutura Detalhada

### Frontend (/web)

```
web/
├── src/
│   ├── app/              # Páginas (App Router)
│   │   ├── page.tsx      # Home com hero
│   │   ├── upload/       # Upload de PDFs
│   │   ├── contracts/    # Seleção de contratos
│   │   ├── templates/    # Editor de templates
│   │   └── documents/    # Documentos gerados
│   ├── components/
│   │   ├── ui/           # Componentes base
│   │   ├── layout/       # Header, Footer
│   │   └── features/     # Componentes específicos
│   └── lib/              # Utilitários e hooks
├── public/               # Assets estáticos
└── tailwind.config.ts    # Configuração do Tailwind
```

### Backend (/server)

```
server/
├── src/
│   ├── app.module.ts     # Módulo raiz
│   ├── main.ts          # Bootstrap da aplicação
│   ├── pdf/             # Módulo de PDF
│   │   ├── controllers/ # Endpoints da API
│   │   ├── services/    # Lógica de negócio
│   │   ├── dto/         # Data Transfer Objects
│   │   └── interfaces/  # Tipos TypeScript
│   ├── auth/            # Módulo de autenticação
│   └── common/          # Utilitários compartilhados
├── uploads/             # Arquivos temporários
└── nest-cli.json        # Configuração do NestJS
```

## 🔧 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev          # Executa frontend + backend
npm run dev:web      # Apenas frontend
npm run dev:server   # Apenas backend
```

### Produção

```bash
npm run build        # Build completo
npm run start        # Executa em produção
```

### Qualidade de Código

```bash
npm run lint         # ESLint em ambos projetos
npm run test         # Testes do backend
```

### Limpeza

```bash
npm run clean        # Remove builds e node_modules
```

## 🎨 Design System

O projeto utiliza um design system elegante com:

- **Paleta de Cores**:
  - 🔵 Primary: Azul-petróleo (#0ea5e9)
  - ⚫ Secondary: Cinza-grafite (#64748b)
  - 🟡 Accent: Dourado suave (#eab308)

- **Tipografia**: Inter (principal) + JetBrains Mono (código)
- **Componentes**: Button, Card, Badge, Input, Progress, Toast
- **Responsividade**: Mobile-first design
- **Acessibilidade**: Alto contraste e navegação por teclado

## 🛡️ Segurança e Conformidade

- ✅ **LGPD Compliant**: Políticas de privacidade implementadas
- 🔒 **Dados Seguros**: Criptografia e armazenamento local
- 🛡️ **Rate Limiting**: Proteção contra abuso da API
- 🔍 **Auditabilidade**: Logs detalhados e rastreamento
- ⚠️ **Revisão Humana**: Avisos obrigatórios em toda interface

## 🤖 Tecnologias da IA

- **PDF Processing**: pdf-to-img (JavaScript puro)
- **Worker Threads**: Isolamento de ES modules
- **High Quality**: Conversão 3x scale (~300 DPI)
- **Batch Processing**: Múltiplos arquivos simultâneos

## 📊 Funcionalidades Principais

### 1. 📤 Upload de Documentos

- Drag & drop intuitivo
- Validação de tipo e tamanho
- Feedback visual de progresso
- Suporte a múltiplos arquivos

### 2. 🔍 Análise Inteligente

- Detecção automática de contratos
- Identificação de cláusulas problemáticas
- Score de confiança da IA
- Classificação de risco (alto/médio/baixo)

### 3. 📝 Geração de Petições

- Templates personalizáveis
- Placeholders dinâmicos
- Preview em tempo real
- Export PDF/DOCX

### 4. 📋 Gestão de Documentos

- Histórico de conversões
- Versionamento de documentos
- Download e compartilhamento
- Busca e filtros avançados

## 🔄 Fluxo de Trabalho

1. **📤 Upload**: Usuário faz upload de PDFs
2. **🔄 Conversão**: API converte PDF em imagens
3. **🤖 Análise**: IA identifica contratos e problemas
4. **✅ Seleção**: Usuário escolhe contratos relevantes
5. **📝 Template**: Escolha ou edição de template
6. **📄 Geração**: Criação da petição final
7. **💾 Download**: Export em PDF/DOCX

## 🚨 Importante

> **⚠️ AVISO LEGAL**: Esta ferramenta é um assistente tecnológico. A **revisão humana por um profissional jurídico qualificado é sempre obrigatória** antes de qualquer ação legal.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

Desenvolvido com ❤️ pela equipe AdvHelper

---

**🏛️ AdvHelper** - Transformando a prática jurídica com inteligência artificial
