import { WebContainer, WebContainerInternal } from '@webcontainer/api';
import { WORK_DIR_NAME } from '@/utils/constants';
import { workbenchStore } from '../stores/workbench';
import { cleanStackTrace } from '@/utils/stacktrace';

interface WebContainerContext {
  loaded: boolean;
}

let webcontainerContext: WebContainerContext = {
  loaded: false,
};

let webcontainer: Promise<WebContainer> = new Promise(() => {
  // noop for ssr
});

if (typeof window !== 'undefined') {
  webcontainer = Promise.resolve()
    .then(() => {
      return WebContainer.boot({
        workdirName: WORK_DIR_NAME,
        forwardPreviewErrors: true, // Enable error forwarding from iframes
      });
    })
    .then((webcontainer) => {
      webcontainerContext.loaded = true;

      webcontainer.on('preview-message', (message) => {
        console.log('WebContainer preview message:', message);

        // Handle both uncaught exceptions and unhandled promise rejections
        if (message.type === 'PREVIEW_UNCAUGHT_EXCEPTION' || message.type === 'PREVIEW_UNHANDLED_REJECTION') {
          const isPromise = message.type === 'PREVIEW_UNHANDLED_REJECTION';
          workbenchStore.actionAlert.set({
            type: 'preview',
            title: isPromise ? 'Unhandled Promise Rejection' : 'Uncaught Exception',
            description: message.message,
            content: `Error occurred at ${message.pathname}${message.search}${message.hash}\nPort: ${message.port}\n\nStack trace:\n${cleanStackTrace(message.stack || '')}`,
            source: 'preview',
          });
        }
      });

      return webcontainer;
    });
}

export { webcontainer, webcontainerContext };