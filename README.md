# 🚀 Desafio Frontend Flugo

Aplicação web desenvolvida como desafio técnico utilizando ReactJS, TypeScript, Material UI e Firebase.

---

## 🌐 Deploy Online

O projeto está hospedado na Vercel:

🔗 https://desafio-frontend-flugo.vercel.app

---

## 🛠️ Tecnologias Utilizadas

- ReactJS
- TypeScript
- Vite
- Material UI (MUI)
- Firebase (Firestore)
- React Router DOM
- Vercel

---

## 📦 Como Rodar o Projeto Localmente

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/LeonardoGomesFerreira/Challenge-Flugo.git
```

Entrar na pasta do projeto:

```bash
cd Challenge-Flugo
```

---

### 2️⃣ Instalar as Dependências

Usando npm:

```bash
npm install
```

Ou usando pnpm:

```bash
pnpm install
```

---

### 3️⃣ Configurar o Firebase

Crie o arquivo:

```
src/services/firebase.ts
```

Adicione o seguinte código (substitua pelas suas credenciais do Firebase):

```ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
```

Você encontra essas informações em:

Firebase Console → Configurações do Projeto → Geral → Seus Apps

---

### 4️⃣ Rodar o Projeto

```bash
npm run dev
```

O projeto será executado em:

```
http://localhost:5173
```

---

## 🏗️ Build para Produção

Para gerar a versão otimizada:

```bash
npm run build
```

Os arquivos finais ficarão na pasta:

```
dist/
```

---

## 🚀 Deploy na Vercel

Caso queira fazer deploy manual:

Instalar CLI:

```bash
npm i -g vercel
```

Fazer deploy:

```bash
vercel
```

Para produção:

```bash
vercel --prod
```

---

## 🔥 Deploy no Firebase Hosting (Opcional)

### 1️⃣ Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2️⃣ Login

```bash
firebase login
```

### 3️⃣ Inicializar

```bash
firebase init
```

Selecionar:

- Hosting
- Use existing project
- Public directory: `dist`
- Configure as SPA? → Yes
- Overwrite index.html? → No

### 4️⃣ Build

```bash
npm run build
```

### 5️⃣ Deploy

```bash
firebase deploy
```

---

## 📁 Estrutura do Projeto

```
src/
 ├── components/
 ├── pages/
 │    └── Colaboradores/
 ├── services/
 │    ├── firebase.ts
 │    └── colaboradores.service.ts
 ├── types/
 ├── theme/
 ├── App.tsx
 └── main.tsx
```

---

## ✅ Funcionalidades

- Cadastro de colaboradores em múltiplos passos
- Validação de formulário
- Salvamento no Firebase Firestore
- Listagem com ordenação
- Layout moderno e responsivo
- Deploy em produção

---

## 👨‍💻 Desenvolvedor

Leonardo Gomes Ferreira  
GitHub: https://github.com/LeonardoGomesFerreira

---

## 📄 Licença

Projeto desenvolvido para fins de desafio técnico.
