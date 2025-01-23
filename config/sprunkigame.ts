export enum GameCategory {
  // 游戏类型分类 (主分类)
  SPRUNKIPHASE = "Sprunki Phase Games",      
  SPRUNKI = "Sprunki Games",     
  INCREDIBOX = "Incredibox Games",  
  MUSIC = "Music Games",     
  MOD = "Mod Games", 
  HALLOWEEN = "Halloween Games",     
  NEW = "New Games",
  HOT = "Hot Games",
  FEATURED = "Featured Games",
}

export interface Game {
  id: string;
  title: string;
  description: string;
  description2?: string;
  iframeUrl: string;
  image: string;
  rating: number;
  categories: GameCategory[];  // 使用合并后的分类系统
  createdAt: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  controls: {
    fullscreenTip: string;
    guide: {
      movement: string[];
      actions: string[];
      special?: string[];
    };
  };
  features: string[];  // 游戏特定的特性列表
  faqs: {
    question: string;
    answer: string;
    category: 'gameplay' | 'technical' | 'features' | 'general' | 'tips' | 'audio';
  }[];
  video?: {
    youtubeId: string;    // YouTube 视频 ID
    clipId?: string;    // 可选的片段ID
    clipTime?: string;  // 可选的片段时间
    title: string;        // 视频标题
    thumbnail: string;   // 添加封面图字段
  };
}

export const games: Game[] = [
  {
    id: "sprunki-phase-0",
    title: "Sprunki Phase 0",
    createdAt: "2024-01-01",
    description: "Sprunki Phase 0 is a fun and engaging music creation game that allows players to mix and match adorable Sprunki characters to create their own unique tunes. It combines simplicity with creativity, making music accessible to everyone.",
    iframeUrl: "https://iframegame.com/embed/sprunki-babies/index.html",
    image: "/games/sprunki-survive.webp",
    rating: 4.8,
    categories: [
      GameCategory.SPRUNKI
    ],
    metadata: {
      title: "Sprunki Phase 0 - Create Music with Baby Sprunkis | Free Online Game",
      description: "Play Sprunki Phase 0 and create unique tunes with adorable baby Sprunki characters! Mix sounds, make music, and unleash your creativity in this fun music creation game.",
      keywords: [
        "sprunki phase 0",
        "baby sprunki",
      ]
    },
    controls: {
      fullscreenTip: "Click the fullscreen button for the best Sprunki Phase 0 experience",
      guide: {
        movement: [
          "Drag & Drop: Move characters",
          "Click: Activate/Deactivate sounds",
          "Spacebar: Reset all sounds"
        ],
        actions: [
          "Right Click: Remove sound",
          "Double Click: Special animation",
          "Scroll: Browse characters"
        ]
      }
    },
    features: [
      "Intuitive drag-and-drop interface",
      "Unique baby Sprunki characters",
      "Multiple sound combinations",
      "Real-time music creation",
      "Easy-to-follow tutorials",
      "Mobile-optimized gameplay",
      "High-quality sound output",
      "Creative sandbox environment"
    ],
    faqs: [
      {
        question: "What is Sprunki Phase 0?",
        answer: "Sprunki Phase 0 is a music creation game featuring baby Sprunki characters. It's designed as an entry point to the Sprunki Phase series, perfect for beginners and young players.",
        category: 'general'
      },
      {
        question: "How do I create music in Sprunki Phase 0?",
        answer: "Simply drag and drop baby Sprunki characters onto the canvas. Each character adds unique sounds to your mix, creating a fun and interactive music-making experience.",
        category: 'gameplay'
      },
      {
        question: "Is Sprunki Phase 0 suitable for children?",
        answer: "Yes! Sprunki Phase 0 is specifically designed for players of all ages, with a kid-friendly interface and intuitive controls that make music creation accessible and fun.",
        category: 'general'
      },
      {
        question: "Can I save my Sprunki Phase 0 creations?",
        answer: "Yes, you can save your musical creations and share them with friends. The game includes features for storing and sharing your favorite mixes.",
        category: 'technical'
      },
      {
        question: "What makes Sprunki Phase 0 unique?",
        answer: "Sprunki Phase 0 features adorable baby Sprunki characters, each with unique sounds. The game combines cute visuals with engaging sound mixing options in a creative sandbox environment.",
        category: 'features'
      },
      {
        question: "Are there tutorials available?",
        answer: "Yes, Sprunki Phase 0 includes easy-to-follow tutorials that help new players understand how to create music, choose characters, and use all available features.",
        category: 'gameplay'
      },
      {
        question: "What devices can I play Sprunki Phase 0 on?",
        answer: "Sprunki Phase 0 is optimized for both desktop and mobile devices. You can play it on any device with a modern web browser and internet connection.",
        category: 'technical'
      },
      {
        question: "How does Sprunki Phase 0 differ from other versions?",
        answer: "Sprunki Phase 0 is designed as an introduction to the series, featuring simpler mechanics and baby versions of the characters, making it perfect for newcomers.",
        category: 'features'
      }
    ],
    video: {
      youtubeId: "NSRrrdJHAMc",
      title: "Sprunki Phase 0 Gameplay Tutorial",
      thumbnail: "/sprunki-phase.webp"
    }
  },
  {
    id: "sprunki-survive",
    title: "Sprunki Survive",
    createdAt: "2024-12-18",
    description: "Experience Sprunki Survive, a unique survival-themed music creation game that transforms the familiar Sprunki universe into a tense, atmospheric journey. Create haunting melodies and rhythms as you navigate through a world where every beat tells a story of survival. Sprunki Survive combines innovative sound design with strategic gameplay, allowing you to craft soundscapes that reflect the struggle and triumph of survival.\n\nIn Sprunki Survive, each character and loop carries the weight of survival, creating an immersive experience where music becomes your tool for endurance. Play directly in your browser and discover how the power of sound can transform the survival experience.",
    iframeUrl: "https://games.sprunkimegalovania.org/game/sprunki-survive/index.html",
    image: "/games/sprunki-survive.webp",
    rating: 4.9,
    categories: [
      GameCategory.SPRUNKI
    ],
    metadata: {
      title: "Sprunki Survive - Survival Music Creation Game | Create Atmospheric Beats",
      description: "Play Sprunki Survive and create intense survival-themed music! Experience unique sound design, strategic composition, and immersive gameplay in this innovative Sprunki mod.",
      keywords: [
        "sprunki survive",
        "survival music game",
        "sprunki mod",
        "music creation",
        "survival game"
      ]
    },
    controls: {
      fullscreenTip: "Click the fullscreen button for an immersive Sprunki Survive experience",
      guide: {
        movement: [
          "Drag & Drop - Position survivors",
          "Click - Toggle survival sounds",
          "Space - Play/Pause composition",
          "R - Reset survival track"
        ],
        actions: [
          "M - Mute all sounds",
          "F - Toggle fullscreen",
          "S - Save survival mix",
          "H - Show/Hide controls"
        ]
      }
    },
    features: [
      "Survival-themed sound design",
      "Strategic music composition",
      "Atmospheric character roster",
      "Unique survival mechanics",
      "Real-time sound mixing",
      "Immersive visual effects",
      "Browser-based gameplay",
      "Shareable compositions"
    ],
    faqs: [
      {
        question: "What makes Sprunki Survive different from other music games?",
        answer: "Sprunki Survive introduces a unique survival theme to music creation, where each sound and character in the Sprunki universe has been reimagined to create tense, atmospheric compositions. The game combines strategic sound placement with survival elements, making it a distinctive experience in the music game genre.",
        category: 'features'
      },
      {
        question: "How do I create music in Sprunki Survive?",
        answer: "In Sprunki Survive, you'll drag and drop characters onto the stage, each adding unique survival-themed sounds to your composition. Experiment with different combinations to create atmospheric tracks that tell your survival story through music.",
        category: 'gameplay'
      },
      {
        question: "Can I save my Sprunki Survive compositions?",
        answer: "Yes! Sprunki Survive allows you to save your survival-themed compositions and share them with others. Your unique musical interpretations of survival can be preserved and shared with the community.",
        category: 'technical'
      },
      {
        question: "What are the special features in Sprunki Survive?",
        answer: "Sprunki Survive features a dark, atmospheric sound palette, survival-themed character designs, and unique gameplay mechanics that reflect the survival theme. Each element has been carefully crafted to enhance the survival experience through music.",
        category: 'features'
      },
      {
        question: "Is Sprunki Survive suitable for beginners?",
        answer: "While Sprunki Survive offers deeper gameplay mechanics, it remains accessible to newcomers. The survival theme adds an extra layer of strategy to the familiar Sprunki music creation system, making it engaging for both beginners and experienced players.",
        category: 'general'
      },
      {
        question: "How does the survival theme affect gameplay in Sprunki Survive?",
        answer: "In Sprunki Survive, the survival theme influences everything from sound design to visual presentation. Characters and sounds work together to create tense, atmospheric music that reflects the challenges of survival.",
        category: 'gameplay'
      },
      {
        question: "What types of music can I create in Sprunki Survive?",
        answer: "Sprunki Survive specializes in creating atmospheric, survival-themed music. From tense ambient soundscapes to rhythmic survival beats, the game offers various ways to express your musical survival story.",
        category: 'features'
      },
      {
        question: "How often is Sprunki Survive updated?",
        answer: "Sprunki Survive receives regular updates with new survival-themed characters, sounds, and features. Each update enhances the survival experience and expands your creative possibilities.",
        category: 'technical'
      },
      {
        question: "Can I play Sprunki Survive on mobile devices?",
        answer: "Yes, Sprunki Survive is optimized for both desktop and mobile browsers, allowing you to create survival-themed music on any device with an internet connection.",
        category: 'technical'
      },
      {
        question: "What makes the sound design unique in Sprunki Survive?",
        answer: "Sprunki Survive features carefully crafted sounds that combine musical elements with survival themes. Each character's audio has been designed to contribute to the tense, atmospheric nature of survival-themed composition.",
        category: 'audio'
      }
    ],
    video: {
      youtubeId: "your_video_id",
      title: "How to Play Sprunki Survive - Tutorial",
      thumbnail: "/games/sprunki-survive.webp"
    }
  },
  {
    id: "corruptbox-sprunki",
    title: "Corruptbox Sprunki",
    createdAt: "2024-12-19",
    description: "Experience Corruptbox Sprunki, a groundbreaking horror music creation game that merges experimental gameplay with eerie soundscapes. In Corruptbox Sprunki, players explore a fractured digital realm where corrupted characters become instruments of haunting melodies. This unique synesthetic experience allows you to manipulate glitch aesthetics and generate atmospheric compositions in ways never seen before.\n\nCorruptbox Sprunki challenges traditional gaming mechanics by transforming digital anomalies into musical art. Create and share your dark musical masterpieces in this innovative horror-themed sound laboratory, where every corrupted element contributes to your sinister symphony.",
    iframeUrl: "https://iframegame.com/embed/corruptbox-but-sprunki/index.html",
    image: "/games/corruptbox-sprunki.webp",
    rating: 4.9,
    categories: [
      GameCategory.SPRUNKI
    ],
    metadata: {
      title: "Corruptbox Sprunki - Horror Music Creation Game | Create Eerie Soundscapes",
      description: "Play Corruptbox Sprunki and create haunting melodies in this unique horror music game. Experience glitch aesthetics and experimental gameplay while crafting atmospheric compositions.",
      keywords: [
        "corruptbox sprunki",
        "horror music game",
        "experimental gameplay",
        "glitch music",
        "corrupted characters"
      ]
    },
    controls: {
      fullscreenTip: "Click the fullscreen button to immerse yourself in Corruptbox Sprunki's eerie atmosphere",
      guide: {
        movement: [
          "Drag & Drop - Position corrupted characters",
          "Click - Toggle horror sounds",
          "Space - Play/Pause composition",
          "R - Reset current track"
        ],
        actions: [
          "M - Mute all sounds",
          "F - Toggle fullscreen",
          "S - Save corrupted mix",
          "H - Show/Hide controls"
        ]
      }
    },
    features: [
      "Horror-themed music creation system",
      "Dynamic glitch aesthetics",
      "Corrupted character sound manipulation",
      "Real-time visual distortion effects",
      "Atmospheric sound generation",
      "Interactive corrupted elements",
      "Community sharing features",
      "Synesthetic gameplay experience"
    ],
    faqs: [
      {
        question: "What makes Corruptbox Sprunki different from other music games?",
        answer: "Corruptbox Sprunki uniquely combines horror elements with music creation, featuring corrupted characters and glitch aesthetics that generate haunting melodies. The game transforms digital anomalies into musical instruments, creating an unprecedented synesthetic experience.",
        category: 'features'
      },
      {
        question: "How do I create music in Corruptbox Sprunki?",
        answer: "In Corruptbox Sprunki, you'll manipulate corrupted characters and glitch elements to generate eerie soundscapes. Each corrupted element contributes unique sounds to your composition, allowing you to craft atmospheric horror music through experimental gameplay.",
        category: 'gameplay'
      },
      {
        question: "Can I share my Corruptbox Sprunki creations?",
        answer: "Yes! Corruptbox Sprunki features a robust community sharing system where you can share your horror music compositions with other players. The game encourages creative expression and community engagement through its sharing features.",
        category: 'technical'
      },
      {
        question: "What are the unique features in Corruptbox Sprunki?",
        answer: "Corruptbox Sprunki offers innovative features like real-time visual corruption, dynamic audio synthesis, and interactive glitch generation. These elements work together to create an immersive horror music creation experience.",
        category: 'features'
      },
      {
        question: "Is Corruptbox Sprunki suitable for beginners?",
        answer: "While Corruptbox Sprunki features experimental gameplay mechanics, it remains accessible to newcomers through intuitive controls and progressive complexity. The game allows players to explore horror music creation at their own pace.",
        category: 'general'
      },
      {
        question: "How does the corruption system affect gameplay in Corruptbox Sprunki?",
        answer: "In Corruptbox Sprunki, the corruption system directly influences both visuals and audio. Each corrupted element you interact with affects the sound generation, creating unique horror soundscapes based on your manipulation of glitch effects.",
        category: 'gameplay'
      },
      {
        question: "What types of music can I create in Corruptbox Sprunki?",
        answer: "Corruptbox Sprunki specializes in horror-themed atmospheric music. From eerie ambient soundscapes to intense glitch compositions, the game offers various ways to express your dark musical creativity.",
        category: 'features'
      },
      {
        question: "How often is Corruptbox Sprunki updated?",
        answer: "Corruptbox Sprunki receives regular updates with new corrupted characters, horror sound elements, and experimental features. Each update enhances the horror music creation experience and expands creative possibilities.",
        category: 'technical'
      },
      {
        question: "Can I play Corruptbox Sprunki on mobile devices?",
        answer: "Yes, Corruptbox Sprunki is optimized for both desktop and mobile browsers, allowing you to create horror music and experiment with corrupted elements on any device with an internet connection.",
        category: 'technical'
      },
      {
        question: "What makes the sound design unique in Corruptbox Sprunki?",
        answer: "Corruptbox Sprunki features a sophisticated sound design system where visual corruptions directly influence audio output. Each corrupted character and glitch effect contributes to creating unique, horror-themed musical experiences.",
        category: 'audio'
      }
    ],
    video: {
      youtubeId: "OCm0zYAC8vQ",
      title: "Corruptbox Sprunki - Horror Music Creation Gameplay",
      thumbnail: "/games/corruptbox-sprunki.webp"
    }
  },
  {
    id: "corruptbox2-but-sprunki",
    title: "Corruptbox2 but Sprunki",
    createdAt: "2024-12-20",
    description: "Corruptbox2 but Sprunki takes the horror music creation experience to new heights by merging military tactics with corrupted audio synthesis. In this innovative sequel, players command glitch-infested units across a surreal battlefield, where every tactical decision shapes the musical composition. The game transforms combat maneuvers into haunting melodies, creating a unique blend of strategy and experimental sound design.\n\nExperience Corruptbox2 but Sprunki's revolutionary sound engine that responds dynamically to your battlefield choices. Deploy corrupted units, orchestrate tactical formations, and witness how your military strategy evolves into an eerie symphony. Each session creates a distinct sonic landscape, making every playthrough a unique musical journey through this nightmarish digital realm.",
    iframeUrl: "https://iframegame.com/embed/corruptbox-2-but-sprunki/index.html",
    image: "/games/corruptbox2-but-sprunki.webp",
    rating: 4.8,
    categories: [
      GameCategory.SPRUNKI
    ],
    metadata: {
      title: "Corruptbox2 but Sprunki - Military Horror Music Strategy Game",
      description: "Play Corruptbox2 but Sprunki and create haunting music through tactical combat. Command corrupted units and transform battlefield strategies into eerie soundscapes.",
      keywords: [
        "corruptbox2 but sprunki",
        "tactical music game",
        "horror strategy",
        "corrupted audio",
        "military music"
      ]
    },
    controls: {
      fullscreenTip: "Click the fullscreen button to expand your tactical view in Corruptbox2 but Sprunki",
      guide: {
        movement: [
          "Drag & Drop - Deploy corrupted units",
          "Click - Activate unit abilities",
          "Space - Play/Pause battlefield audio",
          "R - Reset tactical formation"
        ],
        actions: [
          "M - Mute battlefield sounds",
          "F - Toggle fullscreen",
          "S - Save tactical composition",
          "H - Show/Hide battle controls"
        ]
      }
    },
    features: [
      "Military-themed sound generation",
      "Tactical unit deployment system",
      "Dynamic battlefield audio engine",
      "Corrupted character abilities",
      "Strategic formation mechanics",
      "Real-time sound manipulation",
      "Combat-based music creation",
      "Unique battle compositions"
    ],
    faqs: [
      {
        question: "How does Corruptbox2 but Sprunki combine music and combat?",
        answer: "In Corruptbox2 but Sprunki, every tactical decision influences the music. Unit placement, combat formations, and battlefield actions generate unique sounds that blend into a dynamic musical composition, creating a seamless fusion of strategy and audio creation.",
        category: 'gameplay'
      },
      {
        question: "What makes the tactical elements unique in Corruptbox2 but Sprunki?",
        answer: "The game features a revolutionary sound engine that responds to your military tactics. Different unit formations and combat maneuvers produce distinct audio patterns, allowing you to craft music through strategic gameplay decisions.",
        category: 'features'
      },
      {
        question: "How do corrupted units work in the game?",
        answer: "Each corrupted unit in Corruptbox2 but Sprunki has unique sound-generating abilities. When deployed on the battlefield, units interact with each other to create complex audio patterns, making unit selection and positioning crucial for your musical strategy.",
        category: 'gameplay'
      },
      {
        question: "Can I share my tactical compositions with others?",
        answer: "Yes! Corruptbox2 but Sprunki includes a sharing system where you can save and share your battlefield compositions. Other players can experience your tactical arrangements and the unique soundscapes they create.",
        category: 'technical'
      },
      {
        question: "Is previous experience with Corruptbox required?",
        answer: "No, Corruptbox2 but Sprunki is designed to be accessible to new players while offering depth for veterans. The game includes tutorials that introduce both tactical and musical elements gradually.",
        category: 'general'
      },
      {
        question: "How does the battlefield environment affect the music?",
        answer: "The battlefield conditions directly influence the audio output. Different combat zones, unit interactions, and tactical situations create varying sound patterns, making each battle a unique musical experience.",
        category: 'features'
      },
      {
        question: "What types of music can I create through combat?",
        answer: "Through tactical gameplay, you can create various styles of experimental music ranging from tense battle themes to atmospheric military soundscapes. The combination of unit types and formations offers endless musical possibilities.",
        category: 'audio'
      },
      {
        question: "How often are new units and sounds added?",
        answer: "Corruptbox2 but Sprunki regularly receives updates with new corrupted units, tactical options, and sound elements. Each update expands your strategic and musical possibilities on the battlefield.",
        category: 'technical'
      },
      {
        question: "Can I play Corruptbox2 but Sprunki on mobile devices?",
        answer: "Yes, the game is optimized for both desktop and mobile platforms, allowing you to command your corrupted forces and create tactical music on any device with an internet connection.",
        category: 'technical'
      },
      {
        question: "What makes each playthrough unique?",
        answer: "Every session of Corruptbox2 but Sprunki creates a distinct experience through the combination of tactical choices, unit interactions, and dynamic sound generation. Your strategic decisions directly shape the musical outcome.",
        category: 'gameplay'
      }
    ],
    video: {
      youtubeId: "OCm0zYAC8vQ",
      title: "Corruptbox2 but Sprunki - Tactical Music Creation Gameplay",
      thumbnail: "/games/corruptbox2-but-sprunki.webp"
    }
  },
  {
    id: "corruptbox3-x-sprunki",
    title: "Corruptbox3 x Sprunki",
    createdAt: "2024-12-21",
    description: "Experience the latest evolution of digital chaos in Corruptbox3 x Sprunki, where puzzle-solving meets experimental sound design in a glitch-filled universe. Navigate through corrupted environments while solving intricate puzzles that challenge both your logic and creativity. Each level presents unique challenges where distorted visuals and dynamic soundscapes work in perfect harmony.\n\nThis innovative installment pushes the boundaries of traditional rhythm games by incorporating avant-garde sound design and surreal storytelling. Create your own musical journey using quirky characters, each contributing distinct audio effects to the atmospheric symphony. Every puzzle solution and interaction shapes the soundscape, making each playthrough a unique artistic expression.",
    iframeUrl: "https://iframegame.com/embed/corruptbox3-x-sprunki/index.html",
    image: "/games/corruptbox3-x-sprunki.webp",
    rating: 4.9,
    categories: [
      GameCategory.SPRUNKI
    ],
    metadata: {
      title: "Corruptbox3 x Sprunki - Puzzle Music Creation Game",
      description: "Play Corruptbox3 x Sprunki and solve musical puzzles in a glitch-filled world. Experience dynamic sound design and create unique compositions through puzzle-solving.",
      keywords: [
        "corruptbox3 x sprunki",
        "puzzle music game",
        "glitch aesthetics",
        "experimental sound",
        "rhythm puzzles"
      ]
    },
    controls: {
      fullscreenTip: "Click the fullscreen button to fully immerse yourself in the corrupted world",
      guide: {
        movement: [
          "WASD/Arrows - Navigate puzzles",
          "Mouse - Interact with corrupted objects",
          "Space - Activate sound elements",
          "R - Reset current puzzle"
        ],
        actions: [
          "E - Interact with environment",
          "Q - Switch sound modes",
          "Tab - View objectives",
          "M - Mute audio"
        ]
      }
    },
    features: [
      "Advanced puzzle mechanics",
      "Dynamic sound generation",
      "Glitch-based visuals",
      "Experimental audio design",
      "Character-specific sound effects",
      "Interactive environments",
      "Progressive difficulty",
      "Community sharing system"
    ],
    faqs: [
      {
        question: "How do the puzzles work in Corruptbox3 x Sprunki?",
        answer: "Each puzzle in Corruptbox3 x Sprunki combines visual elements with sound mechanics. Players must manipulate corrupted objects and characters to create specific sound patterns while solving logical challenges. The solutions often require creative thinking about both audio and visual elements.",
        category: 'gameplay'
      },
      {
        question: "What makes the sound design special in this version?",
        answer: "The game features an advanced sound engine that responds to puzzle interactions. Every object manipulation and character interaction produces unique audio effects, creating an experimental soundscape that evolves as you progress through levels.",
        category: 'audio'
      },
      {
        question: "How does the glitch aesthetic affect gameplay?",
        answer: "The glitch visuals aren't just cosmetic - they're integral to puzzle solutions. Distorted environments and characters provide clues and mechanics that players must understand and utilize to progress through the game.",
        category: 'features'
      },
      {
        question: "Can I create my own music while solving puzzles?",
        answer: "Yes! As you solve puzzles, you're simultaneously creating unique musical compositions. The game encourages experimentation with different sound combinations, allowing you to craft your own soundtrack through puzzle-solving.",
        category: 'gameplay'
      },
      {
        question: "Is this game suitable for puzzle beginners?",
        answer: "While Corruptbox3 x Sprunki features complex puzzles, it introduces mechanics gradually. Early levels help players understand basic concepts before introducing more challenging combinations of sound and logic puzzles.",
        category: 'general'
      },
      {
        question: "How does the community sharing system work?",
        answer: "Players can share their puzzle solutions and musical creations with the community. The game includes weekly contests and events where players can showcase their most creative approaches to puzzle-solving and sound design.",
        category: 'technical'
      },
      {
        question: "What's new in this version compared to previous games?",
        answer: "Corruptbox3 x Sprunki introduces more sophisticated puzzle mechanics, enhanced sound design, and a deeper integration between visual glitches and audio elements. The game also features improved character interactions and more complex environmental puzzles.",
        category: 'features'
      },
      {
        question: "How often are new puzzles and sounds added?",
        answer: "The game receives regular updates with new puzzles, sound elements, and characters. These updates ensure fresh challenges and creative possibilities for both new and experienced players.",
        category: 'technical'
      },
      {
        question: "Can I play on mobile devices?",
        answer: "Yes, Corruptbox3 x Sprunki is optimized for both desktop and mobile platforms. The puzzle and sound mechanics are adapted to work smoothly on touchscreen devices.",
        category: 'technical'
      },
      {
        question: "How does the difficulty progression work?",
        answer: "The game features a carefully designed difficulty curve. Early puzzles focus on basic sound and logic mechanics, gradually introducing more complex elements that combine multiple concepts as you progress.",
        category: 'gameplay'
      }
    ],
    video: {
      youtubeId: "OCm0zYAC8vQ",
      title: "Corruptbox3 x Sprunki - Puzzle Music Creation Gameplay",
      thumbnail: "/games/corruptbox3-x-sprunki.webp"
    }
  },
  {
    id: "sprunki-amongus-edition",
    title: "Sprunki Among Us Edition",
    createdAt: "2024-11-21",
    description: "Experience a unique musical crossover in Sprunki Among Us Edition, where rhythm meets mystery. This innovative mod transforms the familiar Sprunki music creation system with the beloved Among Us aesthetic, creating an engaging experience that combines musical creativity with space-themed charm.\n\nCreate captivating tunes using iconic crewmate characters, each bringing their own unique sounds and animations to your compositions. The game features an intuitive drag-and-drop interface that lets you mix tracks while enjoying the suspenseful atmosphere inspired by Among Us. Share your musical creations with friends and join a growing community of creative players.",
    iframeUrl: "https://games.sprunkimegalovania.org/game/sprunki-amongus-edition/index.html",
    image: "/games/sprunki-amongus-edition.webp",
    rating: 4.8,
    categories: [
      GameCategory.SPRUNKI
    ],
    metadata: {
      title: "Sprunki Among Us Edition - Space-Themed Music Creation Game",
      description: "Play Sprunki Among Us Edition and create music with your favorite crewmate characters. Mix tracks, share compositions, and enjoy this unique musical crossover.",
      keywords: [
        "sprunki among us edition",
        "music creation game",
        "among us music",
        "rhythm game",
        "crewmate music maker"
      ]
    },
    controls: {
      fullscreenTip: "Click the fullscreen button to expand your musical space station",
      guide: {
        movement: [
          "Drag & Drop - Position crewmates",
          "Click - Toggle character sounds",
          "Space - Play/Pause composition",
          "R - Reset current track"
        ],
        actions: [
          "M - Mute all sounds",
          "F - Toggle fullscreen",
          "S - Save composition",
          "H - Show/Hide controls"
        ]
      }
    },
    features: [
      "Among Us themed characters",
      "Unique crewmate sounds",
      "Space station atmosphere",
      "Intuitive mixing interface",
      "Character-specific animations",
      "Community sharing system",
      "Family-friendly gameplay",
      "Regular content updates"
    ],
    faqs: [
      {
        question: "What makes Sprunki Among Us Edition special?",
        answer: "This edition uniquely combines Sprunki's music creation system with Among Us aesthetics. Each crewmate character (Red, Blue, Yellow, etc.) has distinct sounds and animations, allowing you to create space-themed musical compositions with a familiar twist.",
        category: 'features'
      },
      {
        question: "How do I create music with crewmates?",
        answer: "Simply drag and drop your favorite Among Us characters onto the stage. Each crewmate adds unique sounds to your composition, and you can arrange them in different combinations to create engaging musical patterns.",
        category: 'gameplay'
      },
      {
        question: "Can I share my crewmate compositions?",
        answer: "Yes! The game includes a sharing feature that lets you save and share your musical creations with friends and the community. It's a great way to showcase your creative arrangements.",
        category: 'technical'
      },
      {
        question: "Is this game suitable for children?",
        answer: "Absolutely! Sprunki Among Us Edition is designed to be family-friendly, making it perfect for players of all ages. It combines simple controls with creative music-making in a fun, engaging way.",
        category: 'general'
      },
      {
        question: "What kind of sounds can each crewmate make?",
        answer: "Each crewmate character has their own unique set of sounds that fit the space theme. These range from rhythmic beats to melodic tones, all designed to work together harmoniously.",
        category: 'audio'
      },
      {
        question: "How does the game maintain the Among Us atmosphere?",
        answer: "The game incorporates the iconic visual style of Among Us with space-themed interfaces and subtle sound effects that create an immersive experience while maintaining focus on music creation.",
        category: 'features'
      },
      {
        question: "Are there any system requirements?",
        answer: "The game runs smoothly on most devices with Android 8.0 and above, and is optimized for browser-based play. No downloads are required, just an internet connection.",
        category: 'technical'
      },
      {
        question: "How often is new content added?",
        answer: "The game receives regular updates with new characters, sounds, and features. All content is freely accessible, with no in-game purchases required.",
        category: 'technical'
      },
      {
        question: "Can I play with friends?",
        answer: "While the music creation is single-player, you can share your compositions with friends and the community, making it a social experience through music sharing.",
        category: 'gameplay'
      },
      {
        question: "What languages are supported?",
        answer: "Currently, Sprunki Among Us Edition is available in English, with plans for future language expansions to make it accessible to more players worldwide.",
        category: 'technical'
      }
    ],
    video: {
      youtubeId: "OCm0zYAC8vQ",
      title: "Sprunki Among Us Edition - Musical Crewmate Creation",
      thumbnail: "/games/sprunki-amongus-edition.webp"
    }
  },
  {
    id: "sprunki-sprunksters-2",
    title: "Sprunksters 2.0",
    createdAt: "2025-01-03",
    description: "Sprunksters 2.0 represents the next evolution in music creation gaming, delivering an enhanced and reimagined experience of the original Sprunksters mod. This upgraded version features stunning visual improvements, smoother animations, and refined sound mechanics that elevate the music-making experience to new heights. With its modernized interface and expanded creative tools, Sprunksters 2.0 offers both newcomers and veterans an engaging platform for musical expression.\n\nThe game introduces a comprehensive suite of enhanced features, including redesigned characters with fluid animations, upgraded sound loops, and intuitive controls that make music creation more accessible and enjoyable than ever. Whether you're crafting beats, mixing melodies, or experimenting with new sound combinations, Sprunksters 2.0 provides the perfect platform for unleashing your musical creativity.",
    image: "/sprunki-sprunkr-2.webp",
      iframeUrl: "https://game.sprunkiretake.net/Incredibox-Sprunkr-2.html",
    rating: 4.9,
    categories: [
      GameCategory.SPRUNKI
    ],
    metadata: {
      title: "Sprunksters 2.0 - Enhanced Music Creation Game Online",
      description: "Play Sprunksters 2.0, the enhanced version of the popular music creation game. Experience improved graphics, smoother animations, and better sound quality.",
      keywords: [
        "sprunksters 2.0"
      ]
    },
    controls: {
      fullscreenTip: "Click the fullscreen button for the best music creation experience",
      guide: {
        movement: [
          "Drag & Drop - Position characters",
          "Click - Toggle sounds",
          "Space - Play/Pause track",
          "R - Reset composition"
        ],
        actions: [
          "M - Mute all sounds",
          "F - Toggle fullscreen",
          "S - Save composition",
          "H - Show/Hide controls"
        ]
      }
    },
    features: [
      "Enhanced character designs",
      "Improved animations",
      "Refined sound quality",
      "Intuitive mixing interface",
      "Expanded sound library",
      "Modern visual effects",
      "Streamlined controls",
      "Community sharing features"
    ],
    faqs: [
      {
        question: "What's new in Sprunksters 2.0?",
        answer: "Sprunksters 2.0 introduces major improvements including enhanced graphics, smoother animations, refined soundscapes, and a more intuitive user interface. The game also features upgraded sound loops and improved mixing capabilities for a better music creation experience.",
        category: "features"
      },
      {
        question: "How does the music creation system work?",
        answer: "The game uses a simple drag-and-drop interface where you can arrange characters on stage to create music. Each character provides unique sound loops and effects that can be combined to create complex musical compositions.",
        category: "gameplay"
      },
      {
        question: "Can I import my compositions from the original Sprunksters?",
        answer: "Yes, Sprunksters 2.0 supports importing compositions from the original version. Your creations will be automatically enhanced with the improved sound quality and visual effects.",
        category: "technical"
      },
      {
        question: "What makes the sound quality better in 2.0?",
        answer: "Version 2.0 features upgraded audio processing, higher quality sound samples, and improved mixing algorithms. This results in clearer, more dynamic sound output and better overall audio quality.",
        category: "audio"
      },
      {
        question: "Is Sprunksters 2.0 suitable for beginners?",
        answer: "Absolutely! The game features an intuitive interface and helpful tutorials that make it easy for beginners to start creating music, while still offering depth for experienced users.",
        category: "general"
      },
      {
        question: "How can I share my musical creations?",
        answer: "The game includes built-in sharing features that allow you to save and share your compositions with the Sprunki community. You can also export your tracks for use in other applications.",
        category: "features"
      }
    ],
    video: {
      youtubeId: "I_m72UuBtVA",
      title: "Sprunksters 2.0 - Enhanced Music Creation Game | Create Amazing Beats",
      thumbnail: "/sprunki-sprunkr-2.webp"
    }
  },
  {
    id: "spunkr-4-oc",
    title: "Spunkr 4 OC",
    createdAt: "2025-01-04",
    description: "Spunkr 4 OC takes music creation to new heights with an incredible roster of 41 unique characters, including exciting hidden secrets waiting to be discovered. This fan-made masterpiece expands the Sprunki universe with innovative sounds, captivating animations, and fresh mechanics that will keep players engaged for hours. The game features the return of the beloved Mr. Fun Computer, now with a completely reimagined performance style that adds a fresh dimension to your musical creations.\n\nDive into a world where each character brings their own musical personality to life, creating endless possibilities for unique compositions. Whether you're discovering secret characters, experimenting with new sound combinations, or crafting the perfect mix, Spunkr 4 OC provides an expansive playground for musical creativity.",
    image: "/sprunkr-4-oc.webp",
    iframeUrl: "https://wowtbc.net/sprunkin/sprunki-restyle/index.html",
    rating: 4.8,
    categories: [
    
    ],
    metadata: {
      title: "Spunkr 4 OC - Incredible Music Creation Game Online",
      description: "Play Spunkr 4 OC and create music with 41 unique characters, including hidden secrets. Experience new sounds in this expanded fan-made masterpiece.",
      keywords: [
        
      ]
    },
    controls: {
      fullscreenTip: "Click the fullscreen button to explore all 41 characters in full view",
      guide: {
        movement: [
          "Drag & Drop - Place characters",
          "Click - Activate sounds",
          "Space - Play/Pause mix",
          "R - Reset track"
        ],
        actions: [
          "M - Mute sounds",
          "F - Fullscreen mode",
          "S - Save creation",
          "H - Help menu"
        ],
        special: [
          "Double Click - Character specials",
          "Shift + Click - Secret interactions"
        ]
      }
    },
    features: [
      "41 unique characters",
      "Hidden secret content",
      "Mr. Fun Computer's return",
      "Dynamic sound system",
      "Special character interactions",
      "Advanced mixing tools",
      "Community features",
      "Regular updates"
    ],
    faqs: [
      {
        question: "How many characters are available in Spunkr 4 OC?",
        answer: "Spunkr 4 OC features an impressive roster of 41 unique characters, including several hidden ones that can be discovered through gameplay. Each character brings their own distinct sounds and animations to your compositions.",
        category: "features"
      },
      {
        question: "What's special about Mr. Fun Computer in this version?",
        answer: "Mr. Fun Computer returns with a completely new performance style. While he may have forgotten his original singing voice, he brings fresh and exciting ways to contribute to your musical creations.",
        category: "features"
      },
      {
        question: "How do I unlock hidden characters?",
        answer: "Hidden characters can be discovered through various means, including specific character combinations, special interactions, and exploring the game's features. Each discovery adds new possibilities to your musical arsenal.",
        category: "gameplay"
      },
      {
        question: "What types of music can I create?",
        answer: "With 41 characters offering different sounds and effects, you can create a wide range of musical styles. From rhythmic beats to melodic compositions, the possibilities are virtually endless.",
        category: "audio"
      },
      {
        question: "How often is new content added?",
        answer: "The game receives regular updates that introduce new features, sounds, and sometimes even new characters. The development team actively listens to community feedback for improvements.",
        category: "technical"
      },
      {
        question: "Can I share my creations with others?",
        answer: "Yes! Spunkr 4 OC includes robust sharing features that let you save and share your musical creations with the community, allowing others to experience your unique compositions.",
        category: "features"
      },
      {
        question: "Is previous experience with Spunkr required?",
        answer: "While previous experience can be helpful, Spunkr 4 OC is designed to be accessible to newcomers while offering depth for veterans. The game includes tutorials and guides to help you get started.",
        category: "general"
      }
    ],
    video: {
      youtubeId: "eVVgEnKogy0",
      title: "Sprunksters 4 OC - Ultimate Music Creation Game | 41 Unique Characters",
      thumbnail: "/sprunkr-4-oc.webp"
    }
  }
];

// 辅助函数
// 1. 获取单个分类的游戏
export const getGamesByCategory = (category: GameCategory) => {
  return games.filter(game => game.categories.includes(category));
};

// 2. 获取多个分类的游戏（满足任意一个分类即可）
export const getGamesByCategories = (categories: GameCategory[]) => {
  return games.filter(game => 
    categories.some(category => game.categories.includes(category))
  );
};

// 3. 获取同时满足多个分类的游戏
export const getGamesByAllCategories = (categories: GameCategory[]) => {
  return games.filter(game => 
    categories.every(category => game.categories.includes(category))
  );
};

// 4. 按分类类型获取游戏
export const getGamesByCategoryType = (type: 'main') => {
  const categoryGroups = {
    main: [
      GameCategory.SPRUNKIPHASE,
      GameCategory.INCREDIBOX,
      GameCategory.SPRUNKI,
      GameCategory.HALLOWEEN,
      GameCategory.MOD, 
      GameCategory.NEW,
      GameCategory.HOT,
      GameCategory.FEATURED,
      GameCategory.MUSIC,
    ],
  };

  return categoryGroups[type];
};

// 获取主分类游戏
export const getGamesByMainCategory = (category: GameCategory) => {
  const mainCategories = [
    GameCategory.SPRUNKIPHASE,
    GameCategory.INCREDIBOX,
    GameCategory.SPRUNKI,
    GameCategory.HALLOWEEN,
    GameCategory.MOD, 
    GameCategory.NEW,
    GameCategory.HOT,
    GameCategory.FEATURED,
    GameCategory.MUSIC,
  ];
  
  if (!mainCategories.includes(category)) {
    return [];
  }
  
  return games.filter(game => game.categories.includes(category));
}; 