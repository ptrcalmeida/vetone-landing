# VetOne.AI Landing Page

Landing page completa para VetOne.AI com sistema de backend para coleta de dados de formulários.

## 🚀 Estrutura do Projeto

```
vetone-landing/
├── index.html              # Página principal
├── pricing.html            # Página de preços
├── styles.css              # Estilos globais
├── script.js               # JavaScript frontend
├── pricing-calculator.js   # Calculadora de preços
├── server.js               # Servidor backend Node.js/Express
├── package.json            # Dependências do projeto
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
└── data/                   # Diretório de armazenamento (criado automaticamente)
    ├── contacts.json       # Dados do formulário de contato
    └── waitlist.json       # Dados do formulário de lista de espera
```

## 📋 Pré-requisitos

- **Node.js** versão 16 ou superior
- **npm** (vem com Node.js)

## 🔧 Instalação

1. **Clone ou baixe o repositório**

2. **Instale as dependências do backend:**
```bash
npm install
```

3. **Configure as variáveis de ambiente (opcional):**
```bash
cp .env.example .env
```

Edite o arquivo `.env` se precisar mudar a porta (padrão: 3000)

## ▶️ Como Executar

### Opção 1: Modo de Desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Opção 2: Modo de Produção

```bash
npm start
```

O servidor backend estará rodando em: `http://localhost:3000`

## 🌐 Acessando a Landing Page

1. **Abra o arquivo HTML no navegador:**

   - Abra `index.html` diretamente no navegador, OU
   - Use um servidor local como Live Server (VS Code extension)

2. **Verifique que o backend está rodando:**

   Acesse: `http://localhost:3000/api/health`

   Deve retornar: `{"status":"ok","timestamp":"..."}`

## 📝 Testando os Formulários

### 1. Formulário "Testar Grátis" (Waitlist)

- Acesse a seção "Lista de Espera" na página principal
- Preencha:
  - Nome (mínimo 2 caracteres)
  - Email (formato válido)
  - Telefone (mínimo 10 dígitos)
  - Especialidade
- Clique em "Entrar na Lista de Espera"

**Endpoint:** `POST /api/waitlist`

**Dados salvos em:** `data/waitlist.json`

### 2. Formulário de Contato

- Acesse a seção "Contato" na página principal
- Preencha:
  - Nome (mínimo 2 caracteres)
  - Email (formato válido)
  - Assunto (mínimo 3 caracteres)
  - Mensagem (mínimo 10 caracteres)
- Clique em "Enviar Mensagem"

**Endpoint:** `POST /api/contact`

**Dados salvos em:** `data/contacts.json`

## 🔍 Visualizando os Dados Coletados

### Via API (JSON)

**Estatísticas gerais:**
```bash
curl http://localhost:3000/api/stats
```

**Ver todos os contatos:**
```bash
cat data/contacts.json
```

**Ver toda a waitlist:**
```bash
cat data/waitlist.json
```

### Formato dos Dados

**contacts.json:**
```json
[
  {
    "id": "1699876543210",
    "name": "João Silva",
    "email": "joao@example.com",
    "subject": "Dúvida sobre planos",
    "message": "Gostaria de saber mais informações...",
    "submittedAt": "2025-11-12T14:30:00.000Z",
    "status": "new"
  }
]
```

**waitlist.json:**
```json
[
  {
    "id": "1699876543210",
    "name": "Maria Santos",
    "email": "maria@example.com",
    "phone": "(11) 98765-4321",
    "specialty": "Clínica Geral",
    "submittedAt": "2025-11-12T14:30:00.000Z",
    "status": "pending"
  }
]
```

## 🛠️ API Endpoints

### 1. Health Check
```
GET /api/health
```
Verifica se o servidor está funcionando.

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-12T14:30:00.000Z"
}
```

### 2. Submit Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "subject": "Dúvida",
  "message": "Mensagem aqui..."
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso! Entraremos em contato em breve.",
  "contactId": "1699876543210"
}
```

**Resposta de Erro (400):**
```json
{
  "success": false,
  "error": "Email inválido"
}
```

### 3. Submit Waitlist Form
```
POST /api/waitlist
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "phone": "(11) 98765-4321",
  "specialty": "Clínica Geral"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso! Você está na lista de espera.",
  "waitlistId": "1699876543210",
  "position": 15
}
```

**Resposta de Erro (409 - Email duplicado):**
```json
{
  "success": false,
  "error": "Este email já está cadastrado na lista de espera!"
}
```

### 4. Get Statistics
```
GET /api/stats
```

**Resposta:**
```json
{
  "contacts": {
    "total": 42,
    "new": 12
  },
  "waitlist": {
    "total": 156,
    "pending": 98
  }
}
```

## 🔐 Validações Implementadas

### Formulário de Contato:
- ✅ Nome: mínimo 2 caracteres
- ✅ Email: formato válido (regex)
- ✅ Assunto: mínimo 3 caracteres
- ✅ Mensagem: mínimo 10 caracteres

### Formulário de Waitlist:
- ✅ Nome: mínimo 2 caracteres
- ✅ Email: formato válido (regex)
- ✅ Telefone: mínimo 10 caracteres
- ✅ Especialidade: mínimo 2 caracteres
- ✅ Email duplicado: não permite cadastro com email já existente

## 🚀 Deploy em Produção

### Backend (Node.js)

1. **Opção 1: Vercel**
   - Instale Vercel CLI: `npm i -g vercel`
   - Execute: `vercel`
   - Configure: `vercel.json` (já incluído)

2. **Opção 2: Railway / Render / Heroku**
   - Configure variável `PORT` no `.env`
   - Deploy direto do Git

3. **Atualizar URL da API no frontend:**

   Em `script.js`, altere:
   ```javascript
   const API_BASE_URL = 'https://seu-backend.vercel.app/api';
   ```

### Frontend (HTML/CSS/JS)

1. **Opção 1: Vercel / Netlify**
   - Faça upload dos arquivos: `index.html`, `pricing.html`, `styles.css`, `script.js`, `pricing-calculator.js`

2. **Opção 2: GitHub Pages**
   - Push para repositório GitHub
   - Ative GitHub Pages nas configurações

## 📊 Sistema de Créditos

A landing page apresenta 4 planos baseados em créditos:

- **Iniciante:** R$ 0 (Grátis) - 20 créditos/mês
- **Essencial:** R$ 63/mês - 60 créditos/mês
- **Profissional:** R$ 99/mês - 100 créditos/mês
- **Clínica:** Preço customizado (entre em contato)

Para mais informações sobre o sistema de créditos, consulte: [CREDIT_SYSTEM.md](CREDIT_SYSTEM.md)

## 🐛 Troubleshooting

### Problema: "CORS error" ao submeter formulário

**Solução:** O backend já tem CORS habilitado. Certifique-se de que:
1. O servidor está rodando (`npm start`)
2. A URL em `script.js` está correta

### Problema: Formulário não envia dados

**Solução:** Abra o DevTools (F12) e verifique:
1. Console: erros JavaScript?
2. Network tab: requisição está sendo feita?
3. Backend está rodando? (`http://localhost:3000/api/health`)

### Problema: "Cannot find module 'express'"

**Solução:** Instale as dependências:
```bash
npm install
```

### Problema: Porta 3000 já está em uso

**Solução:** Mude a porta no `.env`:
```
PORT=3001
```

E atualize em `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

## 📞 Suporte

Para dúvidas ou problemas:
- Email: contato@vetone.ai
- Development: development@vetone.ai

---

**VetOne.AI** - Transformando o atendimento veterinário com IA 🐾
