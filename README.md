# 💰 App Fiap Bank

Aplicativo bancário móvel desenvolvido com **React Native** e **TypeScript** utilizando **Expo**, com funcionalidades essenciais como autenticação, envio/recebimento de dinheiro e visualização de transações.

## 📱 Funcionalidades

- **Autenticação**
  - Login com apelido e senha
  - Criação de conta com nome, documento, apelido e senha
  - Validação de campos e tratamento de erros

- **Dashboard (Extrato)**
  - Listagem de transações com data, descrição e valor
  - Cores distintas para crédito e débito
  - Scroll infinito/paginação
  - Pull-to-refresh
  - Exibição do saldo atual
  - Botão para iniciar nova transação

- **Detalhes da Transação**
  - Exibição completa das informações da transação selecionada

- **Envio de Dinheiro**
  - Formulário para envio com email do destinatário, valor e descrição
  - Validação de saldo
  - Feedback visual de sucesso ou erro

- **Recebimento de Dinheiro**
  - Tela com apelido e informações da conta para receber transferências

## 🚀 Tecnologias e Ferramentas

- [React Native](https://reactnative.dev/) (via [Expo](https://expo.dev/))
- TypeScript
- Context API para gerenciamento de estado
- React Navigation (expo-navigation)
- Fetch API para comunicação com backend
- Armazenamento local seguro para JWT

## 🔐 Autenticação

- O token JWT recebido após o login é armazenado localmente de forma segura.
- O token é utilizado em chamadas autenticadas automaticamente via contexto.

## 📦 Instalação

```bash
# clone o repositório
git clone https://github.com/correialeo/bank-app.git

# acesse o projeto
cd bank-app

# instale as dependências
npm i
# ou
yarn install
```

## ▶️ Execução

```bash
# inicie o projeto com Expo
npx expo start
```

## 👤 Autor
Leandro Correia

Projeto desenvolvido para fins acadêmicos e de prática com React Native.
