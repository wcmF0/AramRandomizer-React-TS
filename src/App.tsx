import { useState, useEffect } from "react";
import { useChampions } from "./hooks/useChampions";
import { TeamDisplay } from "./components/TeamDisplay";
import { ShareLink } from "./components/ShareLink";
import { translations } from "./constants/translations";
import { Language } from "./types/champion";
import Banner from "../public/Banner.png";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const [language, setLanguage] = useState<Language>("en-US");
  const [amount, setAmount] = useState(5);
  const [blueTeam, setBlueTeam] = useState<string[]>([]);
  const [redTeam, setRedTeam] = useState<string[]>([]);
  const [showShareLink, setShowShareLink] = useState(false);

  const { version, loading, error, getRandomChampions, getChampionImageUrl } =
    useChampions();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang") as Language;
    const championsParam = params.get("champions");
    const amtParam = params.get("amt");

    if (langParam && (langParam === "en-US" || langParam === "pt-BR")) {
      setLanguage(langParam);
    }

    if (championsParam && amtParam) {
      const decodedChampions = atob(championsParam).split(",");
      const blue = decodedChampions
        .filter((champion) => champion.startsWith("blue:"))
        .map((champion) => champion.replace("blue:", ""));
      const red = decodedChampions
        .filter((champion) => champion.startsWith("red:"))
        .map((champion) => champion.replace("red:", ""));

      setAmount(parseInt(amtParam, 10));
      setBlueTeam(blue);
      setRedTeam(red);
      setShowShareLink(true);
    }
  }, []);

  const handleGenerate = async () => {
    if (amount < 1 || amount > 50) {
      alert("Number of champions must be between 1 and 50");
      return;
    }

    const { blueTeam: blue, redTeam: red } = await getRandomChampions(amount);
    setBlueTeam(blue);
    setRedTeam(red);

    const championsWithSides = [
      ...blue.map((champion) => `blue:${champion}`),
      ...red.map((champion) => `red:${champion}`),
    ];

    const championsBase64 = btoa(championsWithSides.join(","));
    const newUrl = `${window.location.pathname}?champions=${encodeURIComponent(
      championsBase64
    )}&lang=${language}&amt=${amount}`;
    window.history.pushState({}, "", newUrl);
    setShowShareLink(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <header>
        <img
          data-aos="fade-in"
          className="w-full max-w-screen-xl mx-auto object-cover"
          src={Banner}
          alt="Banner"
        />
      </header>
      <div data-aos="fade-in" className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-4 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8">
            <div className="w-full md:w-auto">
              <label htmlFor="language" className="block mb-2 text-gray-300">
                {t.languageSelectorLabel}
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full md:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en-US">English</option>
                <option value="pt-BR">Português</option>
              </select>
            </div>
            <div data-aos="fade-in" className="w-full md:w-auto">
              <label htmlFor="amount" className="block mb-2 text-gray-300">
                {t.amountSelectorLabel}
              </label>
              <input
                type="number"
                id="amount"
                min="1"
                max="50"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value, 10))}
                className="w-full md:w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {t.generateButton}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-400 mb-8">Patch: {version}</div>

          <div className="grid md:grid-cols-2 gap-8">
            <TeamDisplay
              title={t.sideBlueTitle}
              champions={blueTeam}
              getChampionImageUrl={getChampionImageUrl}
              language={language}
              side="blue"
            />
            <TeamDisplay
              title={t.sideRedTitle}
              champions={redTeam}
              getChampionImageUrl={getChampionImageUrl}
              language={language}
              side="red"
            />
          </div>

          {showShareLink && (
            <ShareLink
              url={window.location.href}
              text={t.shareLinkText}
              buttonText={t.copyLinkButton}
            />
          )}
        </div>
      </div>
      <footer className="text-center">
        <p>
          <strong className="text-white">Made by</strong>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/wcmF0"
            className="git"
          >
            <strong> wcmF0</strong>
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
