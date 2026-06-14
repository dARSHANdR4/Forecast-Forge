import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs':   ['11px', { lineHeight: '16px', letterSpacing: '0.02em' }],
        'sm':   ['13px', { lineHeight: '20px', letterSpacing: '0.01em' }],
        'base': ['15px', { lineHeight: '24px', letterSpacing: '0' }],
        'lg':   ['17px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        'xl':   ['20px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        '2xl':  ['24px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
        '3xl':  ['30px', { lineHeight: '40px', letterSpacing: '-0.03em' }],
        '4xl':  ['36px', { lineHeight: '44px', letterSpacing: '-0.03em' }],
        '5xl':  ['48px', { lineHeight: '56px', letterSpacing: '-0.04em' }],
        '6xl':  ['64px', { lineHeight: '72px', letterSpacing: '-0.05em' }],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Design system extended colors
        'forge-red': {
          50:  '#FFF1F0',
          100: '#FFE0DD',
          200: '#FFBDB8',
          300: '#FF9089',
          400: '#FF5C52',
          500: '#E84040',
          600: '#CC2E2E',
          700: '#A82323',
          800: '#861B1B',
          900: '#5C0F0F',
        },
        'surface': {
          0: '#0F0F11',
          1: '#161618',
          2: '#1E1E21',
          3: '#252528',
          4: '#2E2E32',
        },
        'success': {
          subtle:  '#0F2A1A',
          muted:   '#1A4A2E',
          DEFAULT: '#22C55E',
          strong:  '#4ADE80',
        },
        'warning': {
          subtle:  '#2A200A',
          muted:   '#4A380A',
          DEFAULT: '#F59E0B',
          strong:  '#FCD34D',
        },
        'error': {
          subtle:  '#2A0F0F',
          muted:   '#4A1A1A',
          DEFAULT: '#EF4444',
          strong:  '#F87171',
        },
        'info': {
          subtle:  '#0A1A2A',
          muted:   '#0F2A4A',
          DEFAULT: '#3B82F6',
          strong:  '#60A5FA',
        },
        chart: {
          '1': '#E84040',
          '2': '#3B82F6',
          '3': '#22C55E',
          '4': '#F59E0B',
          '5': '#A855F7',
          '6': '#06B6D4',
          '7': '#F97316',
          '8': '#EC4899',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.4)',
        'md': '0 4px 12px rgba(0,0,0,0.5)',
        'lg': '0 8px 24px rgba(0,0,0,0.6)',
        'xl': '0 16px 48px rgba(0,0,0,0.7)',
        'accent': '0 0 0 1px rgba(232,64,64,0.4)',
        'focus': '0 0 0 2px rgba(232,64,64,0.6)',
      },
      spacing: {
        'sidebar': '240px',
        'sidebar-collapsed': '64px',
        'topbar': '56px',
      },
      maxWidth: {
        'content': '1280px',
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-400% 0' },
          '100%': { backgroundPosition: '400% 0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in': 'slide-in 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
