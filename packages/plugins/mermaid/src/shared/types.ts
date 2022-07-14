export interface MermaidPluginOptions {
  name?: string;
  mermaidOptions?: Partial<MermaidOptions>;
  style?: {
    [key: string]: string | number;
  };
}

export interface MermaidPrposTypes {
  id: string;
  code: string;
  style: object;
}

export interface MermaidOptions {
  securityLevel?: MermaidSecurityLevel | undefined;

  theme?: MermaidTheme | undefined;

  themeVariables?: unknown;

  themeCSS?: string | undefined;

  maxTextSize?: number | undefined;

  darkMode?: boolean | undefined;

  fontFamily?: string | undefined;

  logLevel?: MermaidLogLevel | undefined;

  startOnLoad?: boolean | undefined;

  arrowMarkerAbsolute?: boolean | undefined;

  secure?: Array<keyof MermaidOptions> | undefined;

  deterministicIds?: boolean | undefined;

  deterministicIDSeed?: string | undefined;

  flowchart?: MermaidFlowChartConfig | undefined;

  sequence?: MermaidSequenceDiagramConfig | undefined;

  gantt?: MermaidGanttConfig | undefined;

  journey?: unknown;

  class?: unknown;

  git?: unknown;

  state?: unknown;

  pie?: unknown;

  requirement?: unknown;
}

export enum MermaidSecurityLevel {
  Strict = 'strict',

  Loose = 'loose',

  Antiscript = 'antiscript',

  Sandbox = 'sandbox',
}

export enum MermaidTheme {
  Base = 'base',

  Forest = 'forest',

  Dark = 'dark',

  Default = 'default',

  Neutral = 'neutral',
}

export enum MermaidLogLevel {
  Debug = 1,
  Info,
  Warn,
  Error,
  Fatal,
}

interface MermaidFlowChartConfig {
  diagramPadding?: number | undefined;

  htmlLabels?: boolean | undefined;

  nodeSpacing?: number | undefined;

  rankSpacing?: number | undefined;

  curve?: string | undefined;

  padding?: number | undefined;

  useMaxWidth?: boolean | undefined;
}

interface MermaidSequenceDiagramConfig {
  diagramMarginX?: number | undefined;

  diagramMarginY?: number | undefined;

  actorMargin?: number | undefined;

  width?: number | undefined;

  height?: number | undefined;

  boxMargin?: number | undefined;

  boxTextMargin?: number | undefined;

  noteMargin?: number | undefined;

  messageMargin?: number | undefined;

  mirrorActors?: boolean | undefined;

  bottomMarginAdj?: number | undefined;

  useMaxWidth?: boolean | undefined;

  rightAngles?: boolean | undefined;
}

interface MermaidGanttConfig {
  titleTopMargin?: number | undefined;

  barHeight?: number | undefined;

  barGap?: number | undefined;

  topPadding?: number | undefined;

  leftPadding?: number | undefined;

  gridLineStartPadding?: number | undefined;

  fontSize?: number | undefined;

  fontFamily?: string | undefined;

  numberSectionStyles?: number | undefined;

  axisFormat?: string | undefined;
}
