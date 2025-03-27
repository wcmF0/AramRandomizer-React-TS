import { ChampionIcon } from "./ChampionIcon";

interface TeamDisplayProps {
  title: string;
  champions: string[];
  getChampionImageUrl: (id: string) => string;
  language: string;
  side: "blue" | "red";
}

export const TeamDisplay = ({
  title,
  champions,
  getChampionImageUrl,
  language,
  side,
}: TeamDisplayProps) => {
  const bgColor = side === "blue" ? "bg-blue-950" : "bg-red-950";
  const borderColor = side === "blue" ? "border-blue-500" : "border-red-500";
  const titleColor = side === "blue" ? "text-blue-400" : "text-red-400";

  return (
    <div className={`${bgColor} rounded-lg border-2 ${borderColor} p-4`}>
      <h2
        className={`text-2xl font-bold mb-6 ${titleColor} text-center uppercase tracking-wider`}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {champions.map((champion) => (
          <ChampionIcon
            key={champion}
            id={champion}
            imageUrl={getChampionImageUrl(champion)}
            language={language}
            side={side}
          />
        ))}
      </div>
    </div>
  );
};
