import { useState, useEffect } from 'react';
import { Language } from '../types/champion';

const URL_BASE = "https://ddragon.leagueoflegends.com/cdn/";

export const useChampions = () => {
  const [version, setVersion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestVersion();
  }, []);

  const fetchLatestVersion = async () => {
    try {
      const response = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
      if (!response.ok) throw new Error('Failed to fetch version');
      const versions = await response.json();
      setVersion(versions[0]);
    } catch (err) {
      setError('Failed to fetch game version');
    } finally {
      setLoading(false);
    }
  };

  const fetchChampions = async () => {
    if (!version) return [];
    try {
      const response = await fetch(`${URL_BASE}${version}/data/en_US/champion.json`);
      if (!response.ok) throw new Error('Failed to fetch champions');
      const data = await response.json();
      return Object.keys(data.data);
    } catch (err) {
      setError('Failed to fetch champions');
      return [];
    }
  };

  const getChampionImageUrl = (championId: string) => {
    return `${URL_BASE}${version}/img/champion/${championId}.png`;
  };

  const getRandomChampions = async (amount: number) => {
    const champions = await fetchChampions();
    const randomChampions = new Set<string>();
    
    while (randomChampions.size < amount * 2) {
      randomChampions.add(champions[Math.floor(Math.random() * champions.length)]);
    }
    
    const champArray = Array.from(randomChampions);
    return {
      blueTeam: champArray.filter((_, i) => i % 2 === 0),
      redTeam: champArray.filter((_, i) => i % 2 === 1)
    };
  };

  return {
    version,
    loading,
    error,
    getRandomChampions,
    getChampionImageUrl
  };
};