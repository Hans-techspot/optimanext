import { useState, useEffect, useRef } from 'react';
import { atom } from 'nanostores';
import type { Message } from 'ai';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { workbenchStore } from '@/lib/stores/workbench';
import { getMessages, getNextId, getUrlId, openDatabase, setMessages } from './db';


export interface ChatHistoryItem {
  id: string;
  urlId?: string;
  description?: string;
  messages: Message[];
  timestamp: string;
}

const persistenceEnabled = !process.env.NEXT_PUBLIC_DISABLE_PERSISTENCE;

export const chatId = atom<string | undefined>(undefined);
export const description = atom<string | undefined>(undefined);

export function useChatHistory(mixedId?: string) {
  const router = useRouter();
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  console.log("initialMessages", initialMessages);
  const [ready, setReady] = useState<boolean>(false);
  const [urlId, setUrlId] = useState<string | undefined>();
  const [db, setDb] = useState<IDBDatabase | undefined>(undefined);
  const dbPromiseRef = useRef<Promise<IDBDatabase | undefined> | undefined>(undefined);

  const getDB = async () => {
    if (!persistenceEnabled) {
      return undefined;
    }

    if (!dbPromiseRef.current) {
      dbPromiseRef.current = openDatabase();
    }

    return dbPromiseRef.current;
  };

  useEffect(() => {
    const initializeDb = async () => {
      const database = await getDB();
      setDb(database);

      if (!database) {
        setReady(true);

        if (persistenceEnabled) {
          toast.error(`Chat persistence is unavailable`);
        }

        return;
      }

      if (mixedId) {
        getMessages(database, mixedId)
          .then((storedMessages) => {
            if (storedMessages && storedMessages.messages.length > 0) {
              setInitialMessages(storedMessages.messages);
              setUrlId(storedMessages.urlId);
              description.set(storedMessages.description);
              chatId.set(storedMessages.id);
            } else {
              router.replace(`/`);
            }
            setReady(true);
          })
          .catch((error) => {
            toast.error(error.message);
          });
      } else {
        setReady(true);
      }
    };

    initializeDb();
  }, [mixedId, router]);

  return {
    ready: !mixedId || ready,
    initialMessages,
    storeMessageHistory: async (messages: Message[]) => {
      if (!db || messages.length === 0) {
        return;
      }

      const { firstArtifact } = workbenchStore;

      if (!urlId && firstArtifact?.id) {
        const urlId = await getUrlId(db, firstArtifact.id);

        navigateChat(urlId);
        setUrlId(urlId);
      }

      if (!description.get() && firstArtifact?.title) {
        description.set(firstArtifact?.title);
      }

      if (initialMessages.length === 0 && !chatId.get()) {
        const nextId = await getNextId(db);

        chatId.set(nextId);

        if (!urlId) {
          navigateChat(nextId);
        }
      }

      await setMessages(db, chatId.get() as string, messages, urlId, description.get());
    },
  };
}

function navigateChat(nextId: string) {
  /**
   * FIXME: Using the intended navigate function causes a rerender for <Chat /> that breaks the app.
   *
   * `navigate(`/chat/${nextId}`, { replace: true });`
   */
  const url = new URL(window.location.href);
  url.pathname = `/chat/${nextId}`;

  window.history.replaceState({}, '', url);
}