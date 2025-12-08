import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { nanoid } from "@wishlist/common";
import { useCallback, useEffect, useState } from "react";

export const CLIENT_ID_STORAGE_KEY = "deviceId";

export const useDeviceId = () => {
    const [deviceId, setDeviceId] = useState<undefined | string>(getDeviceId());
    const [isLoading, setIsLoading] = useState(!getDeviceId());

    const ensureDeviceId = useCallback(() => {
        if (deviceId) {
            if (isLoading) setIsLoading(false);
            return deviceId;
        }

        const idFromLocalStorage = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
        if (idFromLocalStorage) {
            setDeviceId(idFromLocalStorage);
            if (isLoading) setIsLoading(false);
            return idFromLocalStorage;
        }

        const id = nanoid();
        localStorage.setItem(CLIENT_ID_STORAGE_KEY, id);
        setDeviceId(id);
        if (isLoading) setIsLoading(false);
        return id;
    }, [deviceId, isLoading]);

    useEffect(() => {
        if (!deviceId) return;
        cookieStore.set(CLIENT_ID_STORAGE_KEY, deviceId);
    }, [deviceId]);

    useEffect(() => {
        ensureDeviceId();
    }, [ensureDeviceId]);

    if (isLoading || !deviceId) {
        return { deviceId: undefined, isLoading, ensureDeviceId };
    }

    return { deviceId, isLoading: false, ensureDeviceId };
};

export const getDeviceId = createIsomorphicFn()
    .client(() => {
        const idFromLocalStorage = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
        if (idFromLocalStorage) {
            return idFromLocalStorage;
        }
        const id = nanoid();
        localStorage.setItem(CLIENT_ID_STORAGE_KEY, id);
        cookieStore.set(CLIENT_ID_STORAGE_KEY, id);
        return id;
    })
    .server(() => getCookie(CLIENT_ID_STORAGE_KEY));
