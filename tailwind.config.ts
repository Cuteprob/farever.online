import type { Config } from "tailwindcss";

const config: Config = {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		backgroundImage: {
          // Farever 奇幻主题渐变
          'gradient-game': 'radial-gradient(at 100% 0%, hsla(270,60%,55%,0.12) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(195,90%,55%,0.08) 0px, transparent 50%)',
          'gradient-fantasy': 'linear-gradient(135deg, hsla(270,60%,55%,0.1) 0%, hsla(45,80%,60%,0.1) 50%, hsla(195,90%,55%,0.1) 100%)',
          'gradient-primary': 'linear-gradient(135deg, hsl(270,60%,55%) 0%, hsl(280,70%,45%) 100%)',
          'gradient-gold': 'linear-gradient(135deg, hsl(45,80%,55%) 0%, hsl(35,85%,50%) 100%)',
          'gradient-frost': 'linear-gradient(135deg, hsl(195,90%,55%) 0%, hsl(210,80%,50%) 100%)',
          'gradient-hero': 'radial-gradient(ellipse at 30% 20%, hsla(270,60%,55%,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(45,80%,60%,0.1) 0%, transparent 50%), linear-gradient(180deg, hsl(230,20%,7%) 0%, hsl(230,18%,11%) 100%)',
        },
  			borderRadius: {
  				lg: 'var(--radius)',
  				md: 'calc(var(--radius) - 2px)',
  				sm: 'calc(var(--radius) - 4px)'
  			},
  			colors: {
  				// 基础语义颜色
  				background: 'hsl(var(--background))',
  				foreground: 'hsl(var(--foreground))',
  				card: {
  					DEFAULT: 'hsl(var(--card))',
  					foreground: 'hsl(var(--card-foreground))'
  				},
  				popover: {
  					DEFAULT: 'hsl(var(--popover))',
  					foreground: 'hsl(var(--popover-foreground))'
  				},
  				primary: {
  					DEFAULT: 'hsl(var(--primary))',
  					foreground: 'hsl(var(--primary-foreground))'
  				},
  				secondary: {
  					DEFAULT: 'hsl(var(--secondary))',
  					foreground: 'hsl(var(--secondary-foreground))'
  				},
  				muted: {
  					DEFAULT: 'hsl(var(--muted))',
  					foreground: 'hsl(var(--muted-foreground))'
  				},
  				accent: {
  					DEFAULT: 'hsl(var(--accent))',
  					foreground: 'hsl(var(--accent-foreground))'
  				},
  				destructive: {
  					DEFAULT: 'hsl(var(--destructive))',
  					foreground: 'hsl(var(--destructive-foreground))'
  				},
  				border: 'hsl(var(--border))',
  				input: 'hsl(var(--input))',
  				ring: 'hsl(var(--ring))',
  				chart: {
  					'1': 'hsl(var(--chart-1))',
  					'2': 'hsl(var(--chart-2))',
  					'3': 'hsl(var(--chart-3))',
  					'4': 'hsl(var(--chart-4))',
  					'5': 'hsl(var(--chart-5))'
  				},
  				// Farever 主题颜色系统
  				theme: {
  					// 魔法紫色系 - 主色调
  					purple: {
  						50: 'hsl(270, 60%, 95%)',
  						100: 'hsl(270, 60%, 90%)',
  						200: 'hsl(270, 60%, 80%)',
  						300: 'hsl(270, 60%, 70%)',
  						400: 'hsl(270, 60%, 62%)',
  						500: 'hsl(270, 60%, 55%)', // 主色
  						600: 'hsl(270, 60%, 48%)',
  						700: 'hsl(270, 55%, 40%)',
  						800: 'hsl(270, 50%, 32%)',
  						900: 'hsl(270, 45%, 22%)',
  						950: 'hsl(270, 40%, 15%)'
  					},
  					// 古金色系 - RPG 质感
  					gold: {
  						50: 'hsl(45, 80%, 95%)',
  						100: 'hsl(45, 80%, 88%)',
  						200: 'hsl(45, 80%, 78%)',
  						300: 'hsl(45, 80%, 68%)',
  						400: 'hsl(45, 80%, 62%)',
  						500: 'hsl(45, 80%, 55%)', // RPG 金色
  						600: 'hsl(42, 75%, 48%)',
  						700: 'hsl(38, 70%, 40%)',
  						800: 'hsl(35, 65%, 30%)',
  						900: 'hsl(30, 60%, 20%)',
  						950: 'hsl(25, 55%, 12%)'
  					},
  					// 冰蓝色系 - 法术/技能感
  					frost: {
  						50: 'hsl(195, 90%, 95%)',
  						100: 'hsl(195, 90%, 88%)',
  						200: 'hsl(195, 90%, 78%)',
  						300: 'hsl(195, 90%, 68%)',
  						400: 'hsl(195, 90%, 60%)',
  						500: 'hsl(195, 90%, 55%)', // 冰蓝
  						600: 'hsl(195, 85%, 45%)',
  						700: 'hsl(195, 80%, 38%)',
  						800: 'hsl(195, 75%, 28%)',
  						900: 'hsl(195, 70%, 18%)',
  						950: 'hsl(195, 65%, 12%)'
  					},
  					// 暗色背景系 - 深蓝黑
  					dark: {
  						50: 'hsl(230, 20%, 95%)',
  						100: 'hsl(230, 20%, 85%)',
  						200: 'hsl(230, 20%, 70%)',
  						300: 'hsl(230, 20%, 55%)',
  						400: 'hsl(230, 20%, 40%)',
  						500: 'hsl(230, 20%, 25%)',
  						600: 'hsl(230, 18%, 18%)',
  						700: 'hsl(230, 18%, 14%)',
  						800: 'hsl(230, 18%, 11%)', // 卡片背景
  						900: 'hsl(230, 20%, 7%)', // 页面背景
  						950: 'hsl(230, 22%, 4%)'
  					},
  					// 数据来源状态色
  					verified: {
  						DEFAULT: 'hsl(142, 70%, 45%)',
  						light: 'hsl(142, 70%, 55%)',
  					},
  					community: {
  						DEFAULT: 'hsl(45, 80%, 55%)',
  						light: 'hsl(45, 80%, 65%)',
  					},
  					unverified: {
  						DEFAULT: 'hsl(0, 0%, 55%)',
  						light: 'hsl(0, 0%, 65%)',
  					},
  					needstest: {
  						DEFAULT: 'hsl(25, 90%, 55%)',
  						light: 'hsl(25, 90%, 65%)',
  					},
  				},
  				// 文字颜色语义化
				text: {
					primary: 'hsl(0, 0%, 95%)',
					secondary: 'hsl(230, 15%, 78%)',
					muted: 'hsl(230, 10%, 60%)',
					accent: 'hsl(45, 80%, 55%)',
					purple: 'hsl(270, 60%, 65%)',
					frost: 'hsl(195, 90%, 55%)',
				}
  		},
  		boxShadow: {
          'game': '0 4px 20px -8px hsla(270,60%,55%,0.2), 0 2px 8px hsla(195,90%,55%,0.1)',
          'game-hover': '0 12px 40px -8px hsla(270,60%,55%,0.35), 0 6px 20px hsla(195,90%,55%,0.2), 0 0 20px hsla(45,80%,55%,0.1)',
          'neon': '0 0 20px hsla(270,60%,55%,0.4), 0 0 40px hsla(270,60%,55%,0.2)',
          'gold': '0 0 20px hsla(45,80%,55%,0.3), 0 0 40px hsla(45,80%,55%,0.15)',
          'frost': '0 4px 30px hsla(195,90%,55%,0.2), inset 0 1px 0 hsla(195,90%,55%,0.1)',
        },
  				fontFamily: {
			// Farever 奇幻主题字体系统
			'theme-display': ['var(--font-cinzel)', 'Cinzel', 'Georgia', 'serif'], // 奇幻标题
			'theme-heading': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'], // 标题字体
			'theme-body': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'], // 正文字体
			'theme-mono': ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'], // 等宽字体
			// 兼容性别名
			heading: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
			body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
			mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
			display: ['var(--font-cinzel)', 'Cinzel', 'Georgia', 'serif'],
		},
  		fontSize: {
  			// 主题字体大小系统
  			'theme-xs': ['0.75rem', { lineHeight: '1rem' }],
  			'theme-sm': ['0.875rem', { lineHeight: '1.25rem' }],
  			'theme-base': ['1rem', { lineHeight: '1.5rem' }],
  			'theme-lg': ['1.125rem', { lineHeight: '1.75rem' }],
  			'theme-xl': ['1.25rem', { lineHeight: '1.75rem' }],
  			'theme-2xl': ['1.5rem', { lineHeight: '2rem' }],
  			'theme-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  			'theme-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  			'theme-5xl': ['3rem', { lineHeight: '1' }],
  			'theme-6xl': ['3.75rem', { lineHeight: '1' }],
  			'theme-7xl': ['4.5rem', { lineHeight: '1' }],
  			'theme-8xl': ['6rem', { lineHeight: '1' }],
  			'theme-9xl': ['8rem', { lineHeight: '1' }],
  		},
  		spacing: {
  			// 主题间距系统
  			'theme-xs': '0.25rem',
  			'theme-sm': '0.5rem',
  			'theme-md': '1rem',
  			'theme-lg': '1.5rem',
  			'theme-xl': '2rem',
  			'theme-2xl': '2.5rem',
  			'theme-3xl': '3rem',
  			'theme-4xl': '4rem',
  			'theme-5xl': '5rem',
  			'theme-6xl': '6rem',
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'shimmer': {
  				'0%': { backgroundPosition: '-200% 0' },
  				'100%': { backgroundPosition: '200% 0' }
  			},
  			'pulse-glow': {
  				'0%, 100%': { opacity: '1', boxShadow: '0 0 20px hsla(270,60%,55%,0.3)' },
  				'50%': { opacity: '0.85', boxShadow: '0 0 30px hsla(270,60%,55%,0.5)' }
  			},
  			'float': {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-6px)' }
  			},
  			'count-up': {
  				'0%': { opacity: '0', transform: 'translateY(8px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'shimmer': 'shimmer 2s ease-in-out infinite',
  			'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
  			'float': 'float 3s ease-in-out infinite',
  			'count-up': 'count-up 0.5s ease-out forwards'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
