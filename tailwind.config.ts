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
          'gradient-game': 'radial-gradient(at 100% 0%, hsla(14,100%,57%,0.12) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(200,100%,50%,0.08) 0px, transparent 50%)',
          'gradient-speed': 'linear-gradient(135deg, hsla(14,100%,57%,0.1) 0%, hsla(200,100%,50%,0.1) 50%, hsla(120,100%,50%,0.1) 100%)',
          'gradient-fire': 'linear-gradient(135deg, hsl(14,100%,57%) 0%, hsl(25,100%,50%) 100%)',
          'gradient-ocean': 'linear-gradient(135deg, hsl(200,100%,50%) 0%, hsl(210,100%,60%) 100%)',
          'gradient-neon': 'linear-gradient(135deg, hsl(120,100%,50%) 0%, hsl(140,100%,60%) 100%)',
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
  				// 主题颜色系统 (通用命名)
  				theme: {
  					// 火焰橙色系 - 主色调
  					fire: {
  						50: 'hsl(14, 100%, 95%)',
  						100: 'hsl(14, 100%, 90%)',
  						200: 'hsl(14, 100%, 80%)',
  						300: 'hsl(14, 100%, 70%)',
  						400: 'hsl(14, 100%, 62%)',
  						500: 'hsl(14, 100%, 57%)', // 主色
  						600: 'hsl(14, 100%, 52%)',
  						700: 'hsl(14, 95%, 45%)',
  						800: 'hsl(14, 90%, 35%)',
  						900: 'hsl(14, 80%, 25%)',
  						950: 'hsl(14, 70%, 15%)'
  					},
  					// 电蓝色系 - 次要色
  					ocean: {
  						50: 'hsl(200, 100%, 95%)',
  						100: 'hsl(200, 100%, 90%)',
  						200: 'hsl(200, 100%, 80%)',
  						300: 'hsl(200, 100%, 70%)',
  						400: 'hsl(200, 100%, 60%)',
  						500: 'hsl(200, 100%, 50%)', // 次要色
  						600: 'hsl(200, 100%, 45%)',
  						700: 'hsl(200, 95%, 40%)',
  						800: 'hsl(200, 90%, 30%)',
  						900: 'hsl(200, 80%, 20%)',
  						950: 'hsl(200, 70%, 15%)'
  					},
  					// 霓虹绿色系 - 强调色
  					neon: {
  						50: 'hsl(120, 100%, 95%)',
  						100: 'hsl(120, 100%, 90%)',
  						200: 'hsl(120, 100%, 80%)',
  						300: 'hsl(120, 100%, 70%)',
  						400: 'hsl(120, 100%, 60%)',
  						500: 'hsl(120, 100%, 50%)', // 强调色
  						600: 'hsl(120, 100%, 45%)',
  						700: 'hsl(120, 95%, 40%)',
  						800: 'hsl(120, 90%, 30%)',
  						900: 'hsl(120, 80%, 20%)',
  						950: 'hsl(120, 70%, 15%)'
  					},
  					// 暗色背景系
  					dark: {
  						50: 'hsl(220, 15%, 95%)',
  						100: 'hsl(220, 15%, 85%)',
  						200: 'hsl(220, 15%, 70%)',
  						300: 'hsl(220, 15%, 55%)',
  						400: 'hsl(220, 15%, 40%)',
  						500: 'hsl(220, 15%, 25%)',
  						600: 'hsl(220, 15%, 20%)',
  						700: 'hsl(220, 15%, 15%)',
  						800: 'hsl(220, 15%, 12%)', // 卡片背景
  						900: 'hsl(220, 15%, 8%)', // 页面背景
  						950: 'hsl(220, 15%, 5%)'
  					}
  				},
  								// 文字颜色语义化
				text: {
					primary: 'hsl(0, 0%, 95%)', // 主要文字 - 白色
					secondary: 'hsl(0, 0%, 85%)', // 次要文字 - 浅灰 (提高对比度)
					muted: 'hsl(0, 0%, 75%)', // 静音文字 - 中灰 (提高对比度)
					accent: 'hsl(120, 100%, 50%)', // 强调文字 - 霓虹绿
					fire: 'hsl(14, 100%, 57%)', // 火焰文字
					ocean: 'hsl(200, 100%, 50%)', // 海洋文字
				}
  		},
  		boxShadow: {
          'game': '0 4px 20px -8px hsla(14,100%,57%,0.2), 0 2px 8px hsla(200,100%,50%,0.1)',
          'game-hover': '0 12px 40px -8px hsla(14,100%,57%,0.35), 0 6px 20px hsla(200,100%,50%,0.2), 0 0 20px hsla(120,100%,50%,0.15)',
          'neon': '0 0 20px hsla(14,100%,57%,0.5), 0 0 40px hsla(14,100%,57%,0.3)',
          'speed': '0 4px 30px hsla(200,100%,50%,0.3), inset 0 1px 0 hsla(14,100%,70%,0.2)',
        },
  				fontFamily: {
			// 主题字体系统 - 使用Next.js字体变量
			'theme-display': ['var(--font-orbitron)', 'Orbitron', 'Rajdhani', 'Impact', 'Arial Black', 'sans-serif'], // 显示字体 - 标题用
			'theme-heading': ['var(--font-orbitron)', 'Orbitron', 'Rajdhani', 'Montserrat', 'sans-serif'], // 标题字体
			'theme-body': ['var(--font-rajdhani)', 'Rajdhani', 'system-ui', 'sans-serif'], // 正文字体
			'theme-mono': ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'], // 等宽字体
			'theme-gaming': ['var(--font-orbitron)', 'Orbitron', 'Exo 2', 'Audiowide', 'sans-serif'], // 游戏风格字体
			// 兼容性别名
			heading: ['var(--font-orbitron)', 'Orbitron', 'Rajdhani', 'Montserrat', 'sans-serif'],
			body: ['var(--font-rajdhani)', 'Rajdhani', 'system-ui', 'sans-serif'],
			mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
			display: ['var(--font-orbitron)', 'Orbitron', 'Rajdhani', 'Impact', 'Arial Black', 'sans-serif'],
		},
  		fontSize: {
  			// 主题字体大小系统
  			'theme-xs': ['0.75rem', { lineHeight: '1rem' }], // 12px
  			'theme-sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
  			'theme-base': ['1rem', { lineHeight: '1.5rem' }], // 16px
  			'theme-lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
  			'theme-xl': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
  			'theme-2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
  			'theme-3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  			'theme-4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  			'theme-5xl': ['3rem', { lineHeight: '1' }], // 48px
  			'theme-6xl': ['3.75rem', { lineHeight: '1' }], // 60px
  			'theme-7xl': ['4.5rem', { lineHeight: '1' }], // 72px
  			'theme-8xl': ['6rem', { lineHeight: '1' }], // 96px
  			'theme-9xl': ['8rem', { lineHeight: '1' }], // 128px
  		},
  		spacing: {
  			// 主题间距系统
  			'theme-xs': '0.25rem', // 4px
  			'theme-sm': '0.5rem', // 8px
  			'theme-md': '1rem', // 16px
  			'theme-lg': '1.5rem', // 24px
  			'theme-xl': '2rem', // 32px
  			'theme-2xl': '2.5rem', // 40px
  			'theme-3xl': '3rem', // 48px
  			'theme-4xl': '4rem', // 64px
  			'theme-5xl': '5rem', // 80px
  			'theme-6xl': '6rem', // 96px
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'bounce': {
  				'0%, 20%, 53%, 80%, 100%': {
  					transform: 'translate3d(0,0,0)'
  				},
  				'40%, 43%': {
  					transform: 'translate3d(0, -8px, 0)'
  				},
  				'70%': {
  					transform: 'translate3d(0, -4px, 0)'
  				},
  				'90%': {
  					transform: 'translate3d(0, -2px, 0)'
  				}
  			},
  			'pulse': {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.8'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'bounce': 'bounce 1s ease-in-out',
  			'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
