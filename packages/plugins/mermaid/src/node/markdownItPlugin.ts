import { hash } from '@vuepress/utils';
import type * as MarkdownIt from 'markdown-it';
import type { MermaidPluginOptions } from '../shared';

const markdownItPlugin: MarkdownIt.PluginWithOptions<MermaidPluginOptions> = (
  md: MarkdownIt,
  { name = 'Mermaid' }: MermaidPluginOptions = {}
) => {
  const opts = {
    render: (tokens: { [x: string]: { [key: string]: string } }, idx: number) => {
      const token = tokens[idx];
      const key = `mermaid_${hash(idx)}`;
      const { content } = token;
      const code = md.utils.escapeHtml(content);

      return `<ClientOnly><${name} id='${key}' code='${code}'/></ClientOnly>`;
    },
    validate: (params) => {
      return params.trim().split(' ').includes('mermaid');
    },
  };
  const rulesName = 'mermaid-fence';
  function defaultValidate(params): boolean {
    return params.trim().split(' ', 2)[0] === rulesName;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const defaultRender = (tokens, idx, _options, _env, self) => {
    if (tokens[idx].nesting === 1) {
      tokens[idx].attrPush(['class', rulesName]);
    }
    return self.renderToken(tokens, idx, _options);
  };

  const options = Object.assign(
    {
      validate: defaultValidate,
      render: defaultRender,
      marker: undefined,
    },
    opts
  );

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const fence = (state, startLine, endLine, silent) => {
    const optionMarker = options.marker || '`';
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];
    let haveEndMarker = false;

    if (state.sCount[startLine] - state.blkIndent >= 4) {
      return false;
    }

    if (pos + 3 > max) {
      return false;
    }

    const marker = state.src.charCodeAt(pos);

    if (marker !== optionMarker.charCodeAt(0)) {
      return false;
    }

    let mem = pos;
    pos = state.skipChars(pos, marker);

    let len = pos - mem;

    if (len < 3) {
      return false;
    }

    const markup = state.src.slice(mem, pos);
    const params = state.src.slice(pos, max);

    if (params.indexOf(String.fromCharCode(marker)) >= 0) {
      return false;
    }

    if (silent) {
      return true;
    }

    let nextLine = startLine;

    // eslint-disable-next-line prettier/prettier
    for (; ;) {
      nextLine++;
      if (nextLine >= endLine) {
        break;
      }

      pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (pos < max && state.sCount[nextLine] < state.blkIndent) {
        break;
      }
      if (state.src.charCodeAt(pos) !== marker) {
        continue;
      }
      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        continue;
      }

      pos = state.skipChars(pos, marker);

      if (pos - mem < len) {
        continue;
      }

      pos = state.skipSpaces(pos);

      if (pos < max) {
        continue;
      }
      haveEndMarker = true;
      break;
    }

    len = state.sCount[startLine];

    state.line = nextLine + (haveEndMarker ? 1 : 0);

    let token;
    if (options.validate(params)) {
      token = state.push(rulesName, 'div', 0);
    } else {
      token = state.push('fence', 'code', 0);
    }
    token.info = params;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup = markup;
    token.map = [startLine, state.line];

    return true;
  };

  md.block.ruler.before('fence', rulesName, fence, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  });
  md.renderer.rules[rulesName] = options.render;
};

export default markdownItPlugin;
