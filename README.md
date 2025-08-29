# Sistema de Auxílio de Advocacia - API de Conversão PDF

API Node.js para converter documentos PDF em imagens PNG, desenvolvida especificamente para auxiliar profissionais da advocacia.

## 🚀 Funcionalidades

- ✅ Upload de arquivos PDF (até 50MB)
- ✅ Conversão de PDF para imagens PNG de alta qualidade (300 DPI)
- ✅ Armazenamento automático no disco local
- ✅ Processamento de múltiplas páginas
- ✅ API RESTful com endpoints organizados
- ✅ Listagem de conversões realizadas

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Sistema operacional: Windows, macOS ou Linux

## 🔧 Instalação

1. Clone ou baixe o projeto
2. Instale as dependências:

```bash
npm install
```

3. Execute o servidor:

```bash
# Modo de desenvolvimento (com auto-reload)
npm run dev

# Modo de produção
npm start
```

O servidor estará disponível em: `http://localhost:3000`

## 📚 Endpoints da API

### GET `/`

Informações gerais da API

### GET `/health`

Verificação de saúde do servidor

### POST `/api/convert-pdf`

Converte um PDF em imagens PNG

**Parâmetros:**

- `pdf` (file): Arquivo PDF a ser convertido

**Exemplo usando curl:**

```bash
curl -X POST -F "pdf=@documento.pdf" http://localhost:3000/api/convert-pdf
```

**Resposta de sucesso:**

```json
{
  "success": true,
  "message": "PDF convertido com sucesso",
  "originalFile": "documento.pdf",
  "totalPages": 3,
  "outputDirectory": "output/uuid_documento",
  "images": [
    {
      "page": 1,
      "filename": "page.1.png",
      "path": "output/uuid_documento/page.1.png"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET `/api/conversions`

Lista todas as conversões realizadas

## 📁 Estrutura de Diretórios

```
dataExtractor/
├── src/
│   └── server.js          # Servidor principal
├── uploads/               # Arquivos temporários (PDFs)
├── output/                # Imagens convertidas
├── package.json
└── README.md
```

## ⚙️ Configuração

### Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 3000)

### Parâmetros de Conversão

A conversão é otimizada para documentos jurídicos:

- **DPI**: 300 (alta qualidade para leitura)
- **Formato**: PNG (preserva qualidade)
- **Dimensões**: A4 (2480x3508 pixels)

## 🛠️ Tecnologias Utilizadas

- **Express.js**: Framework web
- **Multer**: Upload de arquivos
- **pdf2pic**: Conversão PDF para imagem
- **fs-extra**: Manipulação de arquivos
- **UUID**: Geração de identificadores únicos
- **CORS**: Habilitação de requisições cross-origin

## 🔒 Segurança

- ✅ Validação de tipo de arquivo (apenas PDFs)
- ✅ Limite de tamanho de arquivo (50MB)
- ✅ Limpeza automática de arquivos temporários
- ✅ Tratamento de erros robusto

## 📝 Exemplo de Uso

1. Inicie o servidor:

```bash
npm run dev
```

2. Faça upload de um PDF:

```bash
curl -X POST -F "pdf=@contrato.pdf" http://localhost:3000/api/convert-pdf
```

3. As imagens serão salvas em `output/[uuid]_contrato/`

## 🚨 Tratamento de Erros

A API trata diversos cenários de erro:

- Arquivo não é PDF
- Arquivo muito grande (>50MB)
- Erro na conversão
- Problemas de I/O no disco

## 🔮 Próximos Passos

Este é o primeiro módulo do sistema de auxílio de advocacia. Próximas funcionalidades podem incluir:

- Extração de texto via OCR
- Análise de documentos jurídicos
- Interface web para upload
- Integração com banco de dados
- Autenticação e autorização

## 📄 Licença

ISC License
