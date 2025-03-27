export interface ChampionAttributes {
  dmg_dealt?: number;
  dmg_taken?: number;
  healing?: number;
  energyregen_mod?: number;
  tenacity?: number;
  shielding?: number;
  ability_haste?: number;
  total_as?: number;
}

export interface ChampionData {
  apiname: string;
  aram: ChampionAttributes;
}

export interface Translations {
  languageSelectorLabel: string;
  amountSelectorLabel: string;
  generateButton: string;
  sideBlueTitle: string;
  sideRedTitle: string;
  shareLinkText: string;
  copyLinkButton: string;
  perfectlyBalanced: string;
  attributes: {
    dmg_dealt: string;
    dmg_taken: string;
    healing: string;
    energyregen_mod: string;
    tenacity: string;
    shielding: string;
    ability_haste: string;
    total_as: string;
  };
}

export type Language = 'pt-BR' | 'en-US';