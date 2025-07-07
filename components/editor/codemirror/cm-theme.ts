import { Compartment, type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { coolGlow } from 'thememirror';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import type { Theme } from '@/types/theme.js';
import type { EditorSettings } from './CodeMirrorEditor.js';

export const darkTheme = EditorView.theme({}, { dark: true });
export const themeSelection = new Compartment();

export function getTheme(theme: Theme, settings: EditorSettings = {}): Extension {
  return [
    getEditorTheme(settings),
    theme === 'dark' ? themeSelection.of([getDarkTheme()]) : themeSelection.of([getLightTheme()]),
  ];
}

export function reconfigureTheme(theme: Theme) {
  return themeSelection.reconfigure(theme === 'dark' ? getDarkTheme() : getLightTheme());
}

function getEditorTheme(settings: EditorSettings) {
  return EditorView.theme({
    '&': {
      fontSize: settings.fontSize ?? '12px',
    },
    '&.cm-editor': {
      height: '100%',
      backgroundColor: "#27212e", // editor.background
      color: "#ffffff", // editor.foreground
    },
    '.cm-cursor': {
      borderLeft: '2px solid #b4dce7', // terminal.ansiCyan
    },
    '.cm-scroller': {
      lineHeight: '1.5',
      '&:focus-visible': {
        outline: 'none',
      },
    },
    '.cm-line': {
      padding: '0 0 0 4px',
    },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
      backgroundColor: "#eb64b927 !important", // editor.selectionBackground
      opacity: '1',
    },
    '&:not(.cm-focused) > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
      backgroundColor: "#eb64b927", // editor.selectionBackground
      opacity: '0.7',
    },
    '&.cm-focused > .cm-scroller .cm-matchingBracket': {
      backgroundColor: "#eb64b927", // editor.wordHighlightBackground
    },
    '.cm-activeLine': {
      background: "#eb64b927", // editor.selectionBackground
    },
    '.cm-gutters': {
      background: "#242029", // editorGroupHeader.tabsBackground
      borderRight: 0,
      color: "#ddd", // sideBar.foreground
    },
    '.cm-gutter': {
      '&.cm-lineNumbers': {
        fontFamily: 'Roboto Mono, monospace',
        fontSize: settings.gutterFontSize ?? settings.fontSize ?? '12px',
        minWidth: '40px',
      },
      '& .cm-activeLineGutter': {
        background: 'transparent',
        color: "#74dfc4", // terminal.ansiGreen
      },
      '&.cm-foldGutter .cm-gutterElement > .fold-icon': {
        cursor: 'pointer',
        color: "#92889d", // gitDecoration.ignoredResourceForeground
        transform: 'translateY(2px)',
        '&:hover': {
          color: "#74dfc4", // terminal.ansiGreen
        },
      },
    },
    '.cm-foldGutter .cm-gutterElement': {
      padding: '0 4px',
    },
    '.cm-tooltip-autocomplete > ul > li': {
      minHeight: '18px',
    },
    '.cm-panel.cm-search label': {
      marginLeft: '2px',
      fontSize: '12px',
    },
    '.cm-panel.cm-search .cm-button': {
      fontSize: '12px',
    },
    '.cm-panel.cm-search .cm-textfield': {
      fontSize: '12px',
    },
    '.cm-panel.cm-search input[type=checkbox]': {
      position: 'relative',
      transform: 'translateY(2px)',
      marginRight: '4px',
    },
    '.cm-panels': {
      borderColor: "#964c7b", // input.border
    },
    '.cm-panels-bottom': {
      borderTop: `1px solid #964c7b`, // input.border
      backgroundColor: 'transparent',
    },
    '.cm-panel.cm-search': {
      background: "#3a3242", // input.background
      color: "#ffffff", // editor.foreground
      padding: '8px',
    },
    '.cm-search .cm-button': {
        background: "#EB64B9", // button.background
        borderColor: "#964c7b", // input.border
        color: "#ffffff", // editor.foreground
        borderRadius: '4px',
        '&:hover': {
          color: "#ffffff", // editor.foreground
        },
        '&:focus-visible': {
          outline: 'none',
          borderColor: "#EB64B9", // focusBorder
        },
        '&:hover:not(:focus-visible)': {
          background: "#EB64B9", // focusBorder
          borderColor: "#EB64B9", // focusBorder
        },
        '&:hover:focus-visible': {
            background: "#EB64B9", // focusBorder
            borderColor: "#EB64B9", // focusBorder
        },
    },
    '.cm-panel.cm-search [name=close]': {
      top: '6px',
      right: '6px',
      padding: '0 6px',
      fontSize: '1rem',
      backgroundColor: 'transparent',
      color: "#ddd", // sideBar.foreground
      '&:hover': {
        'border-radius': '6px',
        color: "#EB64B9", // terminal.ansiRed
        backgroundColor: "#3a3242", // input.background
      },
    },
    '.cm-search input': {
      background: "#3a3242", // input.background
      borderColor: "#964c7b", // input.border
      color: "#ffffff", // editor.foreground
      outline: 'none',
      borderRadius: '4px',
      '&:focus-visible': {
        borderColor: "#EB64B9", // focusBorder
      },
    },
    '.cm-tooltip': {
      background: "#3e3549", // notifications.background
      border: '1px solid transparent',
      borderColor: "#964c7b", // input.border
      color: "#ffffff", // editor.foreground
    },
    '.cm-tooltip.cm-tooltip-autocomplete ul li[aria-selected]': {
      background: "#eb64b98f", // list.activeSelectionBackground
      color: "#eee", // list.activeSelectionForeground
    },
    '.cm-searchMatch': {
      backgroundColor: "#40b4c48c", // editor.findMatchBackground
    },
    '.cm-tooltip.cm-readonly-tooltip': {
      padding: '4px',
      whiteSpace: 'nowrap',
      backgroundColor: "#3e3549", // notifications.background
      borderColor: "#EB64B9", // focusBorder
      '& .cm-tooltip-arrow:before': {
        borderTopColor: "#EB64B9", // focusBorder
      },
      '& .cm-tooltip-arrow:after': {
        borderTopColor: 'transparent',
      },
    },
  });
}

function getLightTheme() {
  return coolGlow;
}

function getDarkTheme() {
  return vscodeDark;
}