import { get, set, del } from "idb-keyval";
import { PersistedClient, Persister } from "@tanstack/react-query-persist-client";

/**
 * Creates an Indexed DB persister
 * @see https://tanstack.com/query/v4/docs/react/plugins/persistQueryClient#building-a-persister
 */
export function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery"): Persister {
    return {
        persistClient: async (client: PersistedClient) => {
            await set(idbValidKey, client);
        },
        restoreClient: async () => {
            return await get<PersistedClient>(idbValidKey);
        },
        removeClient: async () => {
            await del(idbValidKey);
        },
    };
}
