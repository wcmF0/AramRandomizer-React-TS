import { champions } from './champions';

export const getChampionData = (id: string) => {
  const championData = champions.find(
    (champ) => champ.id.toLowerCase() === id.toLowerCase()
  );
  return championData || null;
};