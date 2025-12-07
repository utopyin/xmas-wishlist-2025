import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { schema } from "@wishlist/db";
import { listIdeasQueryOptions } from "@/queries/list-ideas";

export const Route = createFileRoute("/")({
    component: HomeComponent,
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(listIdeasQueryOptions),
});

function HomeComponent() {
    const { data, isLoading } = useQuery(listIdeasQueryOptions);

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div>No data</div>;

    return (
        <div className="container mx-auto max-w-3xl px-4 py-2">
            <h1 className="font-bold text-2xl">
                La wishlist de Noël 2025 de Matteo
            </h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((idea) => (
                    <IdeaCard idea={idea} key={idea.id} />
                ))}
            </div>
        </div>
    );
}

const IdeaCard = ({ idea }: { idea: schema.Idea }) => (
    <div className="flex flex-col gap-2 bg-secondary">{idea.title}</div>
);
