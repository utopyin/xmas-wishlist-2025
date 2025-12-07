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
        links: [{ rel: "stylesheet", href: appCss }],
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
                <div className="h-svh font-sans">
                    <Outlet />
                </div>
                <Toaster richColors />
                <TanStackRouterDevtools position="bottom-left" />
                <Scripts />
            </body>
        </html>
    );
}
