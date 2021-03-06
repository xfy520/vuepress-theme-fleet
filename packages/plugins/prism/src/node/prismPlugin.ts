import type { Plugin } from '@vuepress/core';
import { fs, path } from '@vuepress/utils';
import { version } from 'prismjs/package.json';
import type {
  PrismLanguagesListType,
  PrismPluginListType,
  PrismPluginOptions,
  PrismPluginType,
} from '../shared';
import markdownItPlugin from './markdownItPlugin';

const defaultCss = () => {
  let codeScssPath = 'node_modules/@vuepress/theme-default/lib/client/styles/code.scss';
  fs.writeFileSync(path.resolve(codeScssPath), '');
  codeScssPath = 'node_modules/@vuepress/theme-default/lib/client/styles/code-group.scss';
  fs.writeFileSync(path.resolve(codeScssPath), '');
};

const writePuglin = (
  plugins: Array<string> = ['line-numbers', 'show-language', 'line-highlight']
) => {
  let pluginStr = '';
  if (plugins && plugins.length) {
    plugins.forEach((plugin) => {
      try {
        let buffer;
        if (plugin === 'download-button' || plugin === 'autolinker') {
          buffer = fs.readFileSync(
            path.resolve(__dirname, `../client/static/plugins/prism-${plugin}.js`)
          );
        } else {
          buffer = fs.readFileSync(`node_modules/prismjs/plugins/${plugin}/prism-${plugin}.min.js`);
        }
        pluginStr += buffer.toString();
      } catch (error) {
        console.error(error);
      }
    });
  }
  fs.writeFileSync(path.resolve(__dirname, '../client/static/plugins/prism-plugin.js'), pluginStr);
};

const writeLanguages = (
  languages: PrismLanguagesListType = [
    'css',
    'python',
    'java',
    'javascript',
    'typescript',
    'less',
    'markdown',
    'bash',
    'go',
    'go-module',
    'docker',
    'sql',
    'yaml',
    'cpp',
  ]
) => {
  let languageStr = '';
  if (languages && languages.length) {
    languages.forEach((language) => {
      try {
        if (language === 'cpp' && !languages.includes('c')) {
          const buffer = fs.readFileSync(`node_modules/prismjs/components/prism-c.min.js`);
          languageStr += buffer.toString();
        }
        const buffer = fs.readFileSync(`node_modules/prismjs/components/prism-${language}.min.js`);
        languageStr += buffer.toString();
      } catch (error) {
        console.error(error);
      }
    });
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../client/static/language/prism-languages.js'),
    languageStr
  );
};

const loadPlugin = (plugins?: PrismPluginListType): PrismPluginType => {
  const prismPlugins = {};
  if (plugins && plugins.length) {
    plugins.forEach((plugin) => {
      if (typeof plugin === 'string') {
        prismPlugins[plugin] = plugin;
      } else {
        prismPlugins[plugin.name] = plugin;
      }
    });
  }
  return prismPlugins;
};

export const prismPlugin = (
  options: PrismPluginOptions = {
    name: 'Prism',
    theme: '',
    plugins: [
      'line-numbers',
      'show-language',
      'line-highlight',
      {
        name: 'copy-to-clipboard',
        options: {
          copy: '??????',
          error: '???Ctrl+C??????',
          success: '?????????',
        },
      },
      {
        name: 'download-button',
        options: {
          label: '??????',
        },
      },
      'show-invisibles',
      'autolinker',
      'inline-color',
      'previewers',
      'match-braces',
      'highlight-keywords',
      'treeview',
      {
        name: 'normalize-whitespace',
        options: {
          'remove-trailing': true,
          'remove-indent': true,
          'left-trim': true,
          'right-trim': true,
        },
      },
    ],
    languages: [
      'css',
      'python',
      'java',
      'javascript',
      'typescript',
      'less',
      'markdown',
      'bash',
      'go',
      'go-module',
      'docker',
      'sql',
      'yaml',
      'cpp',
    ],
    vPreBlock: true,
    vPreInline: true,
    tabSize: 4,
  }
): Plugin => {
  defaultCss();
  const prismPlugins = loadPlugin(options.plugins);
  writePuglin(Object.keys(prismPlugins));
  writeLanguages(options.languages);
  return {
    name: 'vuepress-plugin-prism',
    extendsMarkdown(md) {
      md.use(markdownItPlugin, options, prismPlugins);
    },
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
    define: {
      __PRISM_COMPONENT_NAME__: options.name || 'Prism',
      __PRISM_THEME__: options.theme || '',
      __PRISM_NORMALIZE_WHITESPACE__: prismPlugins['normalize-whitespace'],
      __PRISM_VERSION__: version,
    },
  };
};
