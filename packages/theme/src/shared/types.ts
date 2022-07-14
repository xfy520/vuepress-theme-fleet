import type { PluginConfig } from '@vuepress/core';
import type { DefaultThemeOptions } from '@vuepress/theme-default';

export interface FleetThemeOptions extends DefaultThemeOptions {
  plugins?: PluginConfig;
}
