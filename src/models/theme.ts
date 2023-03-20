export enum TokenSetStatus {
  enabled = <any>'enabled',
  disabled = <any>'disabled',
  source = <any>'source',
}

interface TokenSets {
  [key: string]: TokenSetStatus;
}

export interface Theme {
  id: string;
  name: string;
  selectedTokenSets: TokenSets;
}
