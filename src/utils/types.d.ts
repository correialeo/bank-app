// dash
export interface Transacao {
    id: number;
    valor: number;
    data: string;
    descricao: string;
    categoria: string;
    tipo: string;
    contraparte: {
      apelido: string;
      nome: string;
    };
  }
  
export interface SaldoResponse {
    saldo: number;
  }

// newTransaction
export interface TransferResponse {
    mensagem: string;
    id: string;
  }
  
//receive
export interface UserInfo {
    id: string;
    nome: string;
    apelido: string;
    documento: string;
  }

// transactionDetails
export type RootStackParamList = {
    TransactionDetails: {
      transaction: {
        id: number;
        valor: number;
        data: string;
        descricao: string;
        categoria: string;
        tipo: string;
        contraparte: {
          apelido: string;
          nome: string;
        };
      };
    };
  };
  
  type TransactionDetailsScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'TransactionDetails'
  >;
  
  type TransactionDetailsScreenRouteProp = RouteProp<
    RootStackParamList,
    'TransactionDetails'
  >;
  
  type Props = {
    navigation: TransactionDetailsScreenNavigationProp;
    route: TransactionDetailsScreenRouteProp;
  };