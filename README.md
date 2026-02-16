📦 Como rodar o projeto localmente

1️⃣ Clonar o repositório
git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git

Depois:
cd NOME-DO-REPOSITORIO

2️⃣ Instalar as dependências
npm install

ou se estiver usando:
pnpm install

3️⃣ Configurar o Firebase

Crie um arquivo:
src/services/firebase.ts

Com o seguinte conteúdo (substituindo pelas suas credenciais):
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

4️⃣ Rodar o projeto
npm run dev

O projeto abrirá em:
http://localhost:5173

🏗️ Build para Produção
Para gerar a versão final:

npm run build

Os arquivos finais ficarão na pasta:
dist/

🔥 Deploy no Firebase Hosting
1️⃣ Instalar Firebase CLI (caso não tenha)
npm install -g firebase-tools

2️⃣ Fazer login
firebase login

3️⃣ Inicializar o Firebase (caso ainda não tenha feito)
firebase init


Selecionar:

Hosting

Escolher o projeto existente

Pasta pública: dist

SPA? → Yes

Overwrite index.html? → No

4️⃣ Fazer build
npm run build

5️⃣ Fazer deploy
firebase deploy

Após isso o projeto estará disponível na URL do Firebase Hosting.