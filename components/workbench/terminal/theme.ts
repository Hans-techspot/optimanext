import type { ITheme } from '@xterm/xterm';

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: '#b4dce7', // terminal.ansiCyan
    cursorAccent: '#000',
    foreground: '#ffffff', // editor.foreground
    background: '#27212e', // editor.background
    selectionBackground: 'rgba(235, 100, 185, 0.3)', // editor.selectionBackground with opacity
    selectionForeground: '#ffffff', // editor.foreground
    selectionInactiveBackground: 'rgba(235, 100, 185, 0.1)', // editor.selectionBackground with lower opacity

    // ansi escape code colors
    black: '#000000',
    red: '#EB64B9', // terminal.ansiRed
    green: '#74dfc4', // terminal.ansiGreen
    yellow: '#ffe261', // terminal.ansiYellow
    blue: '#40b4c4', // terminal.ansiBlue
    magenta: '#b381c5', // terminal.ansiMagenta
    cyan: '#b4dce7', // terminal.ansiCyan
    white: '#ffffff',
    brightBlack: '#808080',
    brightRed: '#EB64B9', // terminal.ansiRed
    brightGreen: '#74dfc4', // terminal.ansiGreen
    brightYellow: '#ffe261', // terminal.ansiYellow
    brightBlue: '#40b4c4', // terminal.ansiBlue
    brightMagenta: '#b381c5', // terminal.ansiMagenta
    brightCyan: '#b4dce7', // terminal.ansiCyan
    brightWhite: '#ffffff',

    ...overrides,
  };
}