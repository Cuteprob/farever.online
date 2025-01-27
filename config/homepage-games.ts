import { GameCategory } from "./sprunkigame";

export const games = [
  {
    id: "sprunksters",
    title: "Sprunksters",
    createdAt: "2024-1-1",
    description: "Original Sprunki sprunksters game",
    image: "/sprunksters.png",
    iframeUrl: "https://games.sprunkiphase.xyz/sprunksters/index.html",
    rating: 5,
    categories: [GameCategory.SPRUNKI],
    metadata: {
      title: "Sprunki Sprunksters - Play Sprunki Sprunksters Game Online Free",
      description: "Play Sprunki Sprunksters, the ultimate online music creation game! Enhanced sound design, real-time mixing & sharing.",
      keywords: ["sprunksters"]
    },
    controls: {
      fullscreenTip: "",
      guide: {
        movement: [
          "Drag & Drop - Add sounds",
          "Click - Toggle sounds",
          "Space - Play/Pause",
          "R - Reset composition"
        ],
        actions: []
      }
    },
    features: [],
    faqs: []
  },
  {
    id: "sprunkr",
    title: "Sprunki Sprunkr",
    createdAt: "2024-1-2",
    description: "Sprunki Sprunkr version",
    image: "/sprunki-sprunkr.webp",
    iframeUrl: "https://game.sprunkiretake.net/Incredibox-Sprunkr-2.html",
    rating: 5,
    categories: [GameCategory.SPRUNKI],
    metadata: {
      title: "Sprunki Sprunkr",
      description: "Sprunki Sprunkr",
      keywords: ["sprunkr"]
    },
    controls: {
      fullscreenTip: "",
      guide: {
        movement: [
          "Drag & Drop - Add sounds",
          "Click - Toggle sounds",
          "Space - Play/Pause",
          "R - Reset composition"
        ],
        actions: []
      }
    },
    features: [],
    faqs: []
  },
  {
    id: "Sprunki Pyramixed",
    title: "Sprunki Pyramixed",
    createdAt: "2024-1-3",
    description: "Sprunki Pyramixed version",
    image: "/pyramixed.webp",
    iframeUrl: "https://wowtbc.net/sprunkin/sprunki-pyramixed/index.html",
    rating: 5,
    categories: [GameCategory.SPRUNKI],
    metadata: {
      title: "Sprunki Pyramixed",
      description: "Sprunki Pyramixed",
      keywords: ["sprunki pyramixed"]
    },
    controls: {
      fullscreenTip: "",
      guide: {
        movement: [
          "Drag & Drop - Add sounds",
          "Click - Toggle sounds",
          "Space - Play/Pause",
          "R - Reset composition"
        ],
        actions: []
      }
    },
    features: [],
    faqs: []
  }
];