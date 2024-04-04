export interface TempAccount {
  email: string
  provider: string
  accessToken: string
  expires: number
}

export interface TempSession {
  accounts: TempAccount[]
  expires: number
}

interface From {
  address: string;
  name: string;
}

interface To {
  address: string;
  name: string;
}

export interface HydraMember {
  '@id': string;
  '@type': string;
  id: string;
  msgid: string;
  from: From;
  to: To[];
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
}

export interface TempMess {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:totalItems': number;
  'hydra:member': HydraMember[];
}