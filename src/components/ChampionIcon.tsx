import { useState } from "react";
import { ChampionData } from "../types/champion";
import { translations } from "../constants/translations";
import { getChampionData } from "../api/aram";

interface ChampionIconProps {
  id: string;
  imageUrl: string;
  language: string;
  side: "blue" | "red";
}

export const ChampionIcon = ({
  id,
  imageUrl,
  language,
  side,
}: ChampionIconProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const [championData, setChampionData] = useState<ChampionData | null>(null);

  const handleClick = async () => {
    if (showInfo) {
      setShowInfo(false);
      return;
    }

    try {
      const data = getChampionData(id);
      if (data) {
        setChampionData(data);
        setShowInfo(true);
      }
    } catch (error) {
      console.error("Error fetching champion data:", error);
    }
  };

  const formatAttribute = (identifier: string, value: number) => {
    if (identifier === "ability_haste") {
      return value > 0 ? `+${value}` : `${value}`;
    }
    if (identifier === "total_as" || identifier === "tenacity") {
      return `+${((value - 1) * 100).toFixed(1)}%`;
    }
    return `${(value * 100).toFixed(0)}%`;
  };

  const bgColor = side === "blue" ? "bg-blue-900/50" : "bg-red-900/50";
  const hoverBgColor =
    side === "blue" ? "hover:bg-blue-800/50" : "hover:bg-red-800/50";
  const textColor = side === "blue" ? "text-blue-100" : "text-red-100";

  return (
    <div
      className={`relative flex items-center gap-3 p-2 ${bgColor} ${hoverBgColor} rounded-lg transition-colors group`}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={id}
          className="w-[50px] h-[50px] cursor-pointer rounded-lg transition-transform group-hover:scale-105"
          onClick={handleClick}
        />
        <div
          className={`absolute inset-0 rounded-lg border-2 ${
            side === "blue" ? "border-blue-400/50" : "border-red-400/50"
          } pointer-events-none`}
        ></div>
      </div>
      <span className={`font-medium ${textColor}`}>{id}</span>
      {showInfo && championData && (
        <div
          className={`
            absolute z-10 bg-gray-800 p-4 rounded-lg shadow-xl min-w-[220px] animate-fade-in border
            ${side === "blue" ? "border-blue-500" : "border-red-500"}
            left-0 md:left-full top-full md:top-0
            mt-2 md:mt-0 md:ml-4
          `}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            onClick={() => setShowInfo(false)}
          >
            ×
          </button>
          <h3 className="font-bold mb-2 text-white">{championData.apiname}</h3>
          {Object.keys(championData.aram).length === 0 ? (
            <p className="text-green-400">
              {translations[language].perfectlyBalanced}
            </p>
          ) : (
            Object.entries(championData.aram).map(([key, value]) => (
              <div
                key={key}
                className={`mb-1 ${
                  key === "dmg_taken"
                    ? value > 1
                      ? "text-red-400"
                      : "text-green-400"
                    : value > 1
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {
                  translations[language].attributes[
                    key as keyof (typeof translations)[typeof language]["attributes"]
                  ]
                }
                : {formatAttribute(key, value)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
