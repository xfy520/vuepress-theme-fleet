import { defineClientConfig } from '@vuepress/client';
import { useDarkMode } from '@vuepress/theme-default/lib/client';
import type * as PrismType from 'prismjs';
import { onBeforeMount, onMounted, watch } from 'vue';

import 'prismjs';

import 'prismjs/components/prism-css-extras';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/treeview/prism-treeview.min.css';

import './static/plugins/prism-plugin';
import './static/language/prism-languages';

import type { PrismPluginThemeType } from '../shared';

import './static/styles/index.scss';

declare const Prism: PrismType.Environment;
declare const __PRISM_COMPONENT_NAME__: string;
declare const __PRISM_VERSION__: string;
declare const __PRISM_THEME__: PrismPluginThemeType;
declare const __PRISM_NORMALIZE_WHITESPACE__: unknown;

const PrismDefaultTheme = {
  coy: true,
  dark: true,
  funky: true,
  okaidia: true,
  solarizedlight: true,
  twilight: true,
};

if (typeof __PRISM_NORMALIZE_WHITESPACE__ !== 'undefined') {
  Prism.plugins.NormalizeWhitespace.setDefaults(__PRISM_NORMALIZE_WHITESPACE__);
}

export default defineClientConfig({
  enhance({ app }) {
    app.component(__PRISM_COMPONENT_NAME__, {
      setup(_, { slots }) {
        const { default: $default } = slots;
        onMounted(() => {
          Prism.highlightAll();
        });
        return $default;
      },
    });
  },
  rootComponents: [
    {
      setup() {
        const isDarkMode = useDarkMode();
        const initPrismTheme = (isDelete: boolean): void => {
          const createStyleElement = (href: string): void => {
            const styleElem = document.createElement('link');
            styleElem.id = 'prismPluginThemeStyleElem';
            styleElem.rel = 'stylesheet';
            styleElem.href = href;
            document.head.insertBefore(styleElem, document.head.firstChild);
          };
          if (!__PRISM_THEME__ || !PrismDefaultTheme[__PRISM_THEME__]) {
            const prismPluginThemeStyleElem = document.getElementById('prismPluginThemeStyleElem');
            if (isDelete && prismPluginThemeStyleElem) {
              prismPluginThemeStyleElem.remove();
            }
            if (!prismPluginThemeStyleElem || isDelete) {
              if (isDarkMode.value) {
                createStyleElement(
                  `https://cdn.bootcdn.net/ajax/libs/prism/${__PRISM_VERSION__}/themes/prism-tomorrow.min.css`
                );
              } else {
                createStyleElement(
                  `https://cdn.bootcdn.net/ajax/libs/prism/${__PRISM_VERSION__}/themes/prism-coy.min.css`
                );
              }
            }
          } else {
            const prismPluginThemeStyleElem = document.getElementById('prismPluginThemeStyleElem');
            if (!prismPluginThemeStyleElem) {
              createStyleElement(
                `https://cdn.bootcdn.net/ajax/libs/prism/${__PRISM_VERSION__}/themes/prism-${__PRISM_THEME__}.min.css`
              );
            }
          }
        };
        watch(isDarkMode, () => {
          initPrismTheme(true);
        });
        onBeforeMount(() => {
          initPrismTheme(false);
        });
        return () => null;
      },
    },
  ],
});
