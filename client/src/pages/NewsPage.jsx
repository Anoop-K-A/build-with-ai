import React, { useMemo } from "react";
import {
  TrendingUp,
  Newspaper,
  Wheat,
  Droplets,
  Leaf,
  AlertTriangle,
  MapPinned,
  Sprout,
  ArrowUpRight,
  Target,
  ShieldAlert,
  Flame,
  CloudRain,
} from "lucide-react";

const marketItems = [
  { crop: "Tomato", price: "₹42/kg", change: "+6.4%", trend: "up" },
  { crop: "Coconut", price: "₹29/pc", change: "+1.8%", trend: "up" },
  { crop: "Banana", price: "₹18/kg", change: "-2.1%", trend: "down" },
  { crop: "Rice", price: "₹2,980/q", change: "+0.9%", trend: "up" },
];

const feedNotes = [
  {
    title: "Vegetable prices firm up as summer demand rises",
    source: "Regional Market Desk",
    tag: "Market",
  },
  {
    title: "Rainfall alert issued for inland districts this week",
    source: "Weather Bureau",
    tag: "Weather",
  },
  {
    title: "Organic input suppliers report higher compost availability",
    source: "Agri Supply Watch",
    tag: "Inputs",
  },
  {
    title: "Farmers increase neem-based treatments after pest pressure spikes",
    source: "Crop Health Bulletin",
    tag: "Crop Health",
  },
];

const genericSuggestions = [
  {
    icon: Target,
    title: "Watch your most valuable crop today",
    body: "Open the latest plant card and scan the newest leaf first. Early detection is the fastest way to protect yield.",
  },
  {
    icon: CloudRain,
    title: "Water earlier if humidity is dropping",
    body: "If your local weather is dry, shift watering to early morning and keep soil covered with mulch.",
  },
  {
    icon: ShieldAlert,
    title: "Buy organic inputs before the next price jump",
    body: "Compost, neem, and quality top-dressings usually move first when market supply tightens.",
  },
];

const cropSuggestions = {
  tomato: [
    "Tomatoes benefit from a pH check and a calcium-rich organic top dressing this week.",
    "Keep foliage dry at night; fungal pressure rises quickly in warm, humid weather.",
    "If prices stay firm, harvest and list your best fruit sooner rather than later.",
  ],
  banana: [
    "Bananas respond well to steady moisture, so avoid long dry gaps in the soil.",
    "If the leaves are yellowing, check potassium balance and shaded stress first.",
    "Market prices are softer this week, so focus on health and uniformity.",
  ],
  coconut: [
    "Coconut palms need consistent moisture around the root zone, especially in hotter spells.",
    "Clear weeds around the trunk and keep organic mulch wide and even.",
    "Monitor for pests after dry weeks because stress rises faster than symptoms show.",
  ],
  rice: [
    "Rice benefits from watching water depth and local rainfall patterns closely this week.",
    "Use the next weather window to time field work and avoid loss from heavy rain.",
    "Track input costs before committing to a larger transplanting batch.",
  ],
};

function readGardenProfile() {
  const stored = localStorage.getItem("rooted_offline_ledger");
  const plants = stored ? JSON.parse(stored) : [];
  const activePlant = plants[0] || null;

  let weather = null;
  if (activePlant?.id) {
    const cachedWeather = localStorage.getItem(`weather_${activePlant.id}`);
    weather = cachedWeather ? JSON.parse(cachedWeather) : null;
  }

  return { activePlant, weather };
}

export default function NewsPage() {
  const { activePlant, weather } = useMemo(() => readGardenProfile(), []);

  const cropKey = (activePlant?.species || "").toLowerCase();
  const suggestions =
    cropSuggestions[cropKey] || genericSuggestions.map((item) => item.body);
  const suggestionTitle = activePlant
    ? `Suggestions for ${activePlant.nickname || activePlant.species}`
    : "Suggestions for your garden";
  const subtitle = activePlant
    ? `Personalized for ${activePlant.species}${activePlant.location?.name ? ` in ${activePlant.location.name}` : ""}.`
    : "Add a plant to get a more tailored market and crop briefing.";

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <section className="relative overflow-hidden rounded-4xl bg-linear-to-br from-forest via-forest to-emerald-950 text-cream p-7 md:p-10 shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(149,213,178,0.5),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_30%)]" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold tracking-wide backdrop-blur">
              <Newspaper className="w-4 h-4" />
              Personalized farm suggestions
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {suggestionTitle}
            </h1>
            <p className="text-cream/80 text-lg font-medium leading-relaxed max-w-2xl">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {activePlant?.location?.name && (
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-bold backdrop-blur">
                  <MapPinned className="w-4 h-4 inline mr-2" />
                  {activePlant.location.name}
                </span>
              )}
              {weather?.temperature != null && (
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-bold backdrop-blur">
                  <CloudRain className="w-4 h-4 inline mr-2" />
                  {Math.round(weather.temperature)}°C | {weather.humidity}%
                  humidity
                </span>
              )}
              {cropKey && (
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-bold backdrop-blur">
                  <Leaf className="w-4 h-4 inline mr-2" />
                  Tracking {activePlant?.species}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full lg:w-82.5">
            <div className="rounded-3xl bg-white/10 backdrop-blur p-4 border border-white/15">
              <p className="text-cream/60 text-xs font-black uppercase tracking-[0.2em]">
                Best move
              </p>
              <p className="text-2xl font-extrabold mt-2">Inspect</p>
              <p className="text-sm text-cream/70 mt-1">
                Open your latest plant first.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 backdrop-blur p-4 border border-white/15">
              <p className="text-cream/60 text-xs font-black uppercase tracking-[0.2em]">
                Weather watch
              </p>
              <p className="text-2xl font-extrabold mt-2">
                {weather?.humidity != null
                  ? `${Math.round(weather.humidity)}%`
                  : "Ready"}
              </p>
              <p className="text-sm text-cream/70 mt-1">
                Plan watering around local humidity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card rounded-4xl p-6 md:p-8 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-forest/45">
                  Suggested actions
                </p>
                <h2 className="text-3xl font-extrabold text-forest mt-2">
                  What you should do next
                </h2>
              </div>
              <Target className="w-8 h-8 text-forest" />
            </div>

            <div className="grid gap-4">
              {suggestions.map((item, index) => {
                const Icon = genericSuggestions[index]?.icon || ArrowUpRight;
                return (
                  <article
                    key={item}
                    className="rounded-[1.75rem] bg-white/80 border border-white p-5 shadow-sm hover:shadow-md transition-all flex gap-4"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-extrabold text-forest leading-tight">
                        {genericSuggestions[index]?.title ||
                          `Suggestion ${index + 1}`}
                      </p>
                      <p className="text-forest/70 font-semibold leading-relaxed mt-1">
                        {item}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-4xl p-6 md:p-8 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-forest/45">
                  Market movement
                </p>
                <h2 className="text-3xl font-extrabold text-forest mt-2">
                  Price signals worth watching
                </h2>
              </div>
              <TrendingUp className="w-8 h-8 text-forest" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {marketItems.map((item) => (
                <div
                  key={item.crop}
                  className="rounded-[1.75rem] bg-white/80 border border-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-forest/55">
                        {item.crop}
                      </p>
                      <p className="text-2xl font-extrabold text-forest mt-1">
                        {item.price}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-black ${item.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      {item.change}
                    </div>
                  </div>
                  <p className="text-sm text-forest/55 font-semibold mt-3">
                    {item.trend === "up"
                      ? "Better selling window this week."
                      : "Cheaper to buy if you need supply now."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="glass-card rounded-4xl p-6 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <MapPinned className="w-6 h-6 text-forest" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-forest/45">
                  For your garden
                </p>
                <h2 className="text-2xl font-extrabold text-forest">
                  Personal focus
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl bg-forest/5 border border-forest/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-forest/45">
                  Crop
                </p>
                <p className="text-lg font-extrabold text-forest mt-1">
                  {activePlant?.species || "Add a plant to personalize"}
                </p>
              </div>
              <div className="rounded-3xl bg-forest/5 border border-forest/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-forest/45">
                  Location
                </p>
                <p className="text-lg font-extrabold text-forest mt-1">
                  {activePlant?.location?.name || "Location not synced yet"}
                </p>
              </div>
              <div className="rounded-3xl bg-forest/5 border border-forest/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-forest/45">
                  Weather cue
                </p>
                <p className="text-lg font-extrabold text-forest mt-1">
                  {weather?.temperature != null
                    ? `${Math.round(weather.temperature)}°C and ${weather.humidity}% humidity`
                    : "No weather cache available"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl p-6 bg-linear-to-br from-sage/30 to-white border border-white/60 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Wheat className="w-6 h-6 text-forest" />
              <h2 className="text-2xl font-extrabold text-forest">
                Market and crop cues
              </h2>
            </div>
            <div className="space-y-3 text-forest font-bold">
              <div className="flex items-start gap-3">
                <Flame className="w-4 h-4 mt-1" />
                Strong demand is favoring faster harvest cycles for tomatoes.
              </div>
              <div className="flex items-start gap-3">
                <Droplets className="w-4 h-4 mt-1" />
                Humid spells can increase fungal pressure, so airflow matters
                more.
              </div>
              <div className="flex items-start gap-3">
                <Sprout className="w-4 h-4 mt-1" />
                Organic inputs are holding steady, but compost quality still
                matters.
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 mt-1" />
                Check pest pressure after rain changes or heat spikes.
              </div>
            </div>
          </div>

          <div className="glass-card rounded-4xl p-6 border border-white/50 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <Newspaper className="w-6 h-6 text-forest" />
              <h2 className="text-2xl font-extrabold text-forest">
                Quick feed
              </h2>
            </div>
            <div className="space-y-3">
              {feedNotes.map((story) => (
                <article
                  key={story.title}
                  className="rounded-3xl bg-white/75 border border-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-forest/10 text-forest px-2.5 py-1 rounded-full">
                      {story.tag}
                    </span>
                    <span className="text-xs text-forest/40 font-bold">
                      {story.source}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-forest/80 leading-relaxed">
                    {story.title}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
