const reset = '\x1b[0m';

export enum ErrorType {
  COMMAND_NOT_FOUND = 'command_not_found',
  PERMISSION_DENIED = 'permission_denied',
  FILE_NOT_FOUND = 'file_not_found',
  SYNTAX_ERROR = 'syntax_error',
  RUNTIME_ERROR = 'runtime_error',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'unknown_error'
}

interface TerminalError {
  type: ErrorType;
  message: string;
  command?: string;
  timestamp: number;
  context?: string;
}

export const escapeCodes = {
  reset,
  clear: '\x1b[g',
  red: '\x1b[1;31m',
  yellow: '\x1b[1;33m',
  blue: '\x1b[1;34m'
};

export const coloredText = {
  red: (text: string) => `${escapeCodes.red}${text}${reset}`,
  yellow: (text: string) => `${escapeCodes.yellow}${text}${reset}`,
  blue: (text: string) => `${escapeCodes.blue}${text}${reset}`
};

export function detectErrorType(output: string): TerminalError {
  const errorPatterns: [RegExp, ErrorType][] = [
    [/command not found/i, ErrorType.COMMAND_NOT_FOUND],
    [/permission denied/i, ErrorType.PERMISSION_DENIED],
    [/no such file or directory/i, ErrorType.FILE_NOT_FOUND],
    [/syntax error/i, ErrorType.SYNTAX_ERROR],
    [/EADDRINUSE|ENOTFOUND|ECONNREFUSED/i, ErrorType.NETWORK_ERROR],
    [/error:|exception:|failed/i, ErrorType.RUNTIME_ERROR]
  ];

  const errorType = errorPatterns.find(([pattern]) => pattern.test(output))?.[1]
    || ErrorType.UNKNOWN_ERROR;

  return {
    type: errorType,
    message: output,
    timestamp: Date.now()
  };
}

export function extractCommandContext(output: string): string | undefined {
  const commandPattern = /command: (.+)/i;
  const match = output.match(commandPattern);
  return match?.[1];
}
