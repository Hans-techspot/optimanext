import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import { atom, type WritableAtom } from 'nanostores';
import type { ITerminal } from '@/types/terminal';
import { newBoltNextShellProcess, newShellProcess } from '@/utils/shell';
import { coloredText } from '@/utils/terminal';

export class TerminalStore {
  #webcontainer: Promise<WebContainer>;
  #terminals: Array<{ terminal: ITerminal; process: WebContainerProcess }> = [];
  #boltnextTerminal = newBoltNextShellProcess();

  showTerminal: WritableAtom<boolean> = atom(true);

  constructor(webcontainerPromise: Promise<WebContainer>) {
    this.#webcontainer = webcontainerPromise;
  }

  get boltnextTerminal() {
    return this.#boltnextTerminal;
  }

  toggleTerminal(value?: boolean) {
    this.showTerminal.set(value !== undefined ? value : !this.showTerminal.get());
  }

  async attachBoltNextTerminal(terminal: ITerminal) {
    try {
      const wc = await this.#webcontainer;
      await this.#boltnextTerminal.init(wc, terminal);
    } catch (error: any) {
      terminal.write(coloredText.red('Failed to spawn boltnext shell\n\n') + error.message);
      return;
    }
  }

  async attachTerminal(terminal: ITerminal) {
    try {
      const shellProcess = await newShellProcess(await this.#webcontainer, terminal);
      this.#terminals.push({ terminal, process: shellProcess });
    } catch (error: any) {
      terminal.write(coloredText.red('Failed to spawn shell\n\n') + error.message);
      return;
    }
  }

  onTerminalResize(cols: number, rows: number) {
    for (const { process } of this.#terminals) {
      process.resize({ cols, rows });
    }
  }
}