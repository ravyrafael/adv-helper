# Guia de Deploy na Vercel

Este guia te ajudará a publicar sua aplicação DataExtractor na Vercel com todas as variáveis de ambiente configuradas corretamente.

## 📋 Pré-requisitos

1. **Conta na Vercel**: Acesse [vercel.com](https://vercel.com) e crie uma conta
2. **Chave da OpenAI**: Obtenha sua chave API em [platform.openai.com](https://platform.openai.com/account/api-keys)
3. **Vercel CLI** (opcional): `npm i -g vercel`

## 🚀 Passos para Deploy

### 1. Preparar o Repositório

```bash
# Adicionar arquivos ao git
git add .
git commit -m "Configuração para deploy na Vercel"
git push origin main
```

### 2. Conectar com a Vercel

**Opção A: Via Dashboard Web**

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **"New Project"**
3. Conecte com seu repositório GitHub/GitLab
4. Selecione o repositório `dataExtractor`

**Opção B: Via CLI**

```bash
npx vercel
# Siga as instruções no terminal
```

### 3. Configurar Variáveis de Ambiente

No dashboard da Vercel:

1. Vá para **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

| Nome              | Valor                        | Ambiente                         |
| ----------------- | ---------------------------- | -------------------------------- |
| `OPENAI_API_KEY`  | `sk-proj-xxxxxxxxx`          | Production, Preview, Development |
| `ALLOWED_ORIGINS` | `https://seu-app.vercel.app` | Production                       |
| `NODE_ENV`        | `production`                 | Production                       |
| `API_URL`         | `https://seu-app.vercel.app` | Production, Preview              |

### 4. Configurações Específicas

#### 4.1 Framework Preset

- **Framework**: Next.js
- **Root Directory**: `web`
- **Build Command**: `cd server && npm run build && cd ../web && npm run build`
- **Output Directory**: `web/.next`

#### 4.2 Configurações de Build

```json
{
  "buildCommand": "cd server && npm run build",
  "outputDirectory": "web/.next",
  "installCommand": "npm install && cd server && npm install && cd ../web && npm install"
}
```

## 🔧 Configuração das Variáveis de Ambiente

### OPENAI_API_KEY

```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- **Obrigatória** para análise de documentos
- Obtida em: https://platform.openai.com/account/api-keys

### ALLOWED_ORIGINS

```
https://seu-app.vercel.app,https://dominio-customizado.com
```

- URLs permitidas para CORS
- Substitua pelos domínios reais do seu app

### NODE_ENV

```
production
```

- Define o ambiente de execução
- Desabilita Swagger em produção

### API_URL

```
https://seu-app.vercel.app
```

- URL base da API para o frontend
- Usado para rewrites no Next.js

## 📁 Estrutura do Projeto na Vercel

```
dataExtractor/
├── web/          # Frontend Next.js
├── server/       # Backend NestJS (Serverless Functions)
├── vercel.json   # Configuração de deploy
└── env.example   # Exemplo de variáveis
```

## 🛠️ Como Configurar na Vercel

### 1. No Dashboard da Vercel

1. **Acesse seu projeto** → Settings → Environment Variables
2. **Clique em "Add New"**
3. **Para cada variável**:
   - Name: `OPENAI_API_KEY`
   - Value: Sua chave da OpenAI
   - Environments: ✅ Production ✅ Preview ✅ Development

### 2. Exemplo de Configuração

```bash
# Via CLI (se preferir)
vercel env add OPENAI_API_KEY
# Cole sua chave quando solicitado

vercel env add ALLOWED_ORIGINS
# Digite: https://seu-app.vercel.app

vercel env add NODE_ENV
# Digite: production

vercel env add API_URL
# Digite: https://seu-app.vercel.app
```

## 🔄 Após Configurar

1. **Redeploy**: Vercel → seu projeto → Deployments → menu ⋯ → Redeploy
2. **Teste**: Acesse sua URL e teste o upload de PDF
3. **Logs**: Em caso de erro, veja os logs em Function Logs

## ⚠️ Pontos Importantes

- ✅ O projeto já está configurado para deploy automático
- ✅ CORS configurado para produção
- ✅ Swagger desabilitado em produção
- ✅ Middleware de segurança habilitado
- ⚠️ Certifique-se de ter créditos na OpenAI
- ⚠️ O domínio em ALLOWED_ORIGINS deve ser exato

## 🐛 Troubleshooting

### Erro de CORS

- Verifique se `ALLOWED_ORIGINS` contém a URL exata da Vercel
- Formato: `https://seu-app.vercel.app` (sem barra no final)

### OpenAI não funciona

- Confirme se `OPENAI_API_KEY` está configurada
- Verifique se tem créditos na conta OpenAI
- Teste a chave em: https://platform.openai.com/playground

### Build falha

- Verifique se todas as dependências estão no package.json
- Logs detalhados estão em: Vercel Dashboard → Deployments → Build Logs

## 📞 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs
- **Este projeto**: Verifique os logs da Vercel em caso de erro
