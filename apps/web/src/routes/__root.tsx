import openSansWoff2 from "@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2?url";
import type { QueryClient } from "@tanstack/react-query";
import {
    createRootRouteWithContext,
    HeadContent,
    Outlet,
    Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../index.css?url";
import "@fontsource-variable/nunito";
import "@fontsource-variable/geist-mono";

export type RouterAppContext = {
    queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            { title: "Wishlist de Matteo 🎁🎄 Noël 2025" },
        ],
        links: [
            { rel: "stylesheet", href: appCss },
            {
                rel: "preload",
                href: openSansWoff2 as string,
                as: "font",
                type: "font/woff2",
                crossOrigin: "anonymous",
            },
        ],
    }),

    component: RootDocument,
});

function RootDocument() {
    return (
        <html lang="fr">
            <head>
                <HeadContent />
            </head>
            <body>
                <div className="grid h-svh grid-rows-[auto_1fr] font-sans">
                    <Outlet />
                </div>
                <Toaster richColors />
                <TanStackRouterDevtools position="bottom-left" />
                <Scripts />
            </body>
        </html>
    );
}
