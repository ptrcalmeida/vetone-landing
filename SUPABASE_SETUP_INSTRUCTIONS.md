# 📋 Instruções de Setup do Supabase - VetOne.AI Landing Page

## 🎯 Passo 1: Acessar o SQL Editor do Supabase

1. Abra seu navegador e vá para: **https://supabase.com/dashboard/project/kdeqieidgwvthfvqyedq/sql**
2. Faça login se necessário

## 📝 Passo 2: Criar as Tabelas

1. Clique em "New query" (Nova consulta)
2. Copie **TODO** o conteúdo do arquivo [`supabase-setup.sql`](supabase-setup.sql)
3. Cole no editor SQL
4. Clique em "Run" (Executar) no canto inferior direito

Você verá uma mensagem de sucesso confirmando que as tabelas foram criadas.

## ✅ Passo 3: Verificar se Deu Certo

Execute este comando no terminal:

```bash
node setup-supabase.js
```

Se tudo estiver correto, você verá:

```
✅ Connection successful!
✅ Tables found and ready to use

📊 Database Status:
   - contacts table: Ready
   - waitlist table: Ready

🎉 Setup complete! Your backend is ready to use Supabase.
```

## 🚀 Passo 4: Iniciar o Servidor

Agora você pode usar o servidor com Supabase:

```bash
# Parar servidor antigo (se estiver rodando)
# Ctrl+C ou use o comando de kill

# Iniciar servidor com Supabase
node server-supabase.js
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

## 🧪 Passo 5: Testar a Integração

Execute estes testes:

### Teste 1: Health Check
```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-12T..."
}
```

### Teste 2: Contact Form
```bash
curl -X POST http://localhost:3000/api/contact \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Teste","email":"teste@email.com","subject":"Assunto teste","message":"Esta é uma mensagem de teste com mais de 10 caracteres"}'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso! Entraremos em contato em breve.",
  "contactId": "uuid-aqui"
}
```

### Teste 3: Waitlist Form
```bash
curl -X POST http://localhost:3000/api/waitlist \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Dr. Teste","email":"teste@vet.com","phone":"(11) 98765-4321","specialty":"Clínica Geral"}'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso! Você está na lista de espera.",
  "waitlistId": "uuid-aqui",
  "position": 1
}
```

## 📊 Visualizar Dados no Supabase

Depois de testar, veja os dados salvos:

1. **Contacts:** https://supabase.com/dashboard/project/kdeqieidgwvthfvqyedq/editor/public.contacts
2. **Waitlist:** https://supabase.com/dashboard/project/kdeqieidgwvthfvqyedq/editor/public.waitlist

## 🔧 Estrutura das Tabelas Criadas

### `contacts` - Formulário de Contato
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único (auto-gerado) |
| name | VARCHAR(255) | Nome do contato |
| email | VARCHAR(255) | Email do contato |
| subject | VARCHAR(500) | Assunto da mensagem |
| message | TEXT | Mensagem completa |
| submitted_at | TIMESTAMP | Data/hora de submissão |
| status | VARCHAR(50) | Status: 'new', 'contacted', 'resolved' |

### `waitlist` - Lista de Espera
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único (auto-gerado) |
| name | VARCHAR(255) | Nome do veterinário |
| email | VARCHAR(255) | Email (único) |
| phone | VARCHAR(50) | Telefone |
| specialty | VARCHAR(255) | Especialidade |
| submitted_at | TIMESTAMP | Data/hora de submissão |
| status | VARCHAR(50) | Status: 'pending', 'approved', 'invited', 'activated' |

## 🔐 Políticas de Segurança (RLS)

As tabelas têm Row Level Security (RLS) habilitado com as seguintes políticas:

- **INSERT:** Qualquer pessoa (anon) pode inserir dados
- **SELECT:** Apenas service role pode ler (para admin/backend)

Isso significa:
- ✅ Landing page pode submeter formulários
- ✅ Backend pode ler todos os dados
- ❌ Usuários anônimos não podem ler dados de outras pessoas

## 🐛 Troubleshooting

### Erro: "Could not find the table 'public.contacts'"
**Solução:** Execute o SQL no Supabase SQL Editor (Passo 2)

### Erro: "SUPABASE_URL and SUPABASE_ANON_KEY must be set"
**Solução:** Verifique se o arquivo `.env` existe com as credenciais corretas

### Erro: "Database connection failed"
**Solução:** Verifique se as credenciais do Supabase estão corretas no `.env`

### Erro: "Este email já está cadastrado na lista de espera!"
**Solução:** Isso é esperado! O sistema não permite emails duplicados na waitlist

## 📝 Próximos Passos

Após configurar o Supabase:

1. ✅ Testar formulários na landing page local
2. ✅ Fazer deploy do backend (Railway/Render/Vercel)
3. ✅ Atualizar `script.js` com URL do backend em produção
4. ✅ Fazer deploy da landing page (Vercel/Netlify)

## 🆘 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs do servidor: veja a saída do `node server-supabase.js`
2. Verifique o Supabase Dashboard: https://supabase.com/dashboard/project/kdeqieidgwvthfvqyedq
3. Entre em contato: development@vetone.ai
