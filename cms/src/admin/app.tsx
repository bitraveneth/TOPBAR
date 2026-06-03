import type { StrapiApp } from '@strapi/strapi/admin';
import topbarLogo from './extensions/topbar-logo.png';
import topbarMark from './extensions/topbar-mark.svg';
import './login-theme.css';

export default {
  config: {
    auth: {
      logo: topbarLogo,
    },
    menu: {
      logo: topbarLogo,
    },
    head: {
      favicon: topbarMark,
    },
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to TOPBAR',
        'Auth.form.welcome.subtitle': '',
        'Auth.link.forgot-password': 'Forgot password?',
      },
    },
    theme: {
      light: {
        colors: {
          primary100: '#2A3A2A',
          primary200: '#5A7A22',
          primary500: '#CCFF00',
          primary600: '#DFFF00',
          primary700: '#99CC00',
          buttonPrimary500: '#CCFF00',
          buttonPrimary600: '#DFFF00',
          buttonPrimary700: '#99CC00',
          danger700: '#B42318',
          neutral0: '#000000',
          neutral100: '#040604',
          neutral150: '#0A0D0A',
          neutral800: '#A8B8A8',
          neutral900: '#FFFFFF',
        },
      },
      dark: {
        colors: {
          primary100: '#2A3A2A',
          primary200: '#5A7A22',
          primary500: '#CCFF00',
          primary600: '#DFFF00',
          primary700: '#99CC00',
          buttonPrimary500: '#CCFF00',
          buttonPrimary600: '#DFFF00',
          buttonPrimary700: '#99CC00',
          neutral0: '#000000',
          neutral100: '#040604',
          neutral150: '#0A0D0A',
          neutral800: '#A8B8A8',
          neutral900: '#FFFFFF',
        },
      },
    },
    tutorials: false,
    notifications: {
      releases: false,
    },
  },
  bootstrap(_app: StrapiApp) {
    const updateAuthClass = () => {
      const isAuth = window.location.pathname.includes('/admin/auth');
      document.body.classList.toggle('topbar-auth-page', isAuth);
    };

    updateAuthClass();
    window.addEventListener('popstate', updateAuthClass);
  },
};
