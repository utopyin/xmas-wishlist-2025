import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { GiftSmall, Link4Small } from "@utopyin/nucleo";
import {
    animate,
    type Easing,
    motion,
    useMotionTemplate,
    useMotionValue,
    useScroll,
    useTransform,
} from "motion/react";
import { useEffect, useMemo } from "react";
import { Letter } from "@/components/letter";
import { ProgressiveBlur } from "@/components/progressive-blur";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type Idea, listIdeasQueryOptions } from "@/queries/list-ideas";

export const Route = createFileRoute("/")({
    component: HomeComponent,
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(listIdeasQueryOptions),
});

const ANIMATION_DURATION = 1.5;
const ANIMATION_EASE: Easing = "easeOut";

function HomeComponent() {
    const scroll = useScroll();

    const enteringAnimation = useMotionValue(0);

    const scrollBlur = useTransform(scroll.scrollYProgress, [0, 0.4], [0, 10]);
    const blur = useTransform(() => {
        const percent = enteringAnimation.get() / 100;
        const enteringBlur = 10 - percent * 10;
        return Math.min(scrollBlur.get() + enteringBlur, 10);
    });

    const transform = useTransform(() => {
        const percent = enteringAnimation.get() / 100;
        return `translateY(${-200 + percent * 200}px)`;
    });

    const isScrolled = useIsScrolled();

    useEffect(() => {
        if (isScrolled) {
            // don't animate if already scrolled
            return enteringAnimation.set(100);
        }
        animate(enteringAnimation, 100, {
            duration: ANIMATION_DURATION,
            ease: ANIMATION_EASE,
        });
    }, [enteringAnimation, isScrolled]);

    const progressiveBlurAmount = useTransform(
        scroll.scrollYProgress,
        [0, 0.7, 0.8],
        [50, 50, 0]
    );

    return (
        <div className="flex flex-col items-center">
            <motion.div
                animate={{
                    opacity: 1,
                    transition: {
                        opacity: {
                            // biome-ignore lint/nursery/noLeakedRender: wrongly catched by biome?
                            duration: isScrolled ? 0 : ANIMATION_DURATION,
                        },
                        duration: ANIMATION_DURATION,
                        ease: ANIMATION_EASE,
                    },
                }}
                className="-translate-y-1/2 fixed top-1/2 flex h-[80svh] max-w-[calc(100svw-2rem)] flex-col justify-center"
                initial={{ filter: "blur(10px)", opacity: 0 }}
                style={{
                    filter: useMotionTemplate`blur(${blur}px)`,
                    transform,
                }}
            >
                <Letter className="-translate-y-[5svh] w-full" />
            </motion.div>
            <ProgressiveBlur
                className="fixed h-50"
                intensity={progressiveBlurAmount}
                position="bottom"
            />
            <div className="h-[80svh] w-full max-w-[min(48rem,calc(100svw-2rem))]" />
            <Wishlist />
        </div>
    );
}

const Wishlist = () => {
    const { data, isLoading } = useQuery(listIdeasQueryOptions);

    const isScrolled = useIsScrolled();

    return (
        <motion.div
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            className="z-10 flex h-[85svh] w-full max-w-[min(48rem,calc(100svw-2rem))] flex-col items-center gap-3 rounded-t-2xl rounded-b-none bg-card px-3 pt-3 pb-0"
            initial={{
                opacity: 0,
                y: 50,
                scale: 1.1,
                filter: "blur(10px)",
            }}
            transition={{
                duration: isScrolled ? 0 : 1,
                delay: isScrolled ? 0 : 1.7,
                ease: "easeInOut",
            }}
        >
            <div className="flex h-15 w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <img
                        alt="Matteo jeune, au téléphone"
                        className="size-6 rounded-full"
                        height={24}
                        src="/matteo.jpg"
                        width={24}
                    />
                    <p>@Matteo</p>
                </div>
                <p className="text-right text-muted-foreground leading-tight">
                    Wishlist
                    <br />
                    2025
                </p>
            </div>
            {isLoading ? <WidthlistSkeleton /> : null}
            {data ? (
                <div className="relative h-full min-h-0 w-full">
                    <div className="absolute inset-x-0 top-0 z-100 h-3 bg-linear-to-b from-card to-transparent" />
                    <div className="no-scrollbar flex h-full w-full flex-col gap-2 overflow-scroll rounded-t-lg pt-3 pb-20">
                        {data.map((idea) => (
                            <IdeaCard idea={idea} key={idea.id} />
                        ))}
                    </div>
                </div>
            ) : (
                <p className="py-4 text-center text-muted-foreground">
                    Aucunes idées n'ont été ajoutées. <br />
                    Merci de revenir plus tard !
                </p>
            )}
        </motion.div>
    );
};

const WidthlistSkeleton = () =>
    Array.from({ length: 10 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: won't reorder
        <div className="flex h-15 w-full items-center" key={index}>
            <Skeleton className="h-15 w-full" />
        </div>
    ));

const IdeaCard = ({ idea }: { idea: Idea }) => (
    <div className="flex min-h-40 w-full rounded-2xl bg-background p-1">
        <div className="aspect-square h-full rounded-xl bg-white">
            {idea.imageUrl ? (
                <img
                    alt={idea.title}
                    className="size-full rounded-xl object-contain"
                    height={120}
                    src={idea.imageUrl}
                    width={120}
                />
            ) : null}
        </div>
        <div className="flex flex-col">
            <div className="flex flex-col gap-1 px-2 py-1.5">
                <p className="font-medium">{idea.title}</p>
                <p className="text-muted-foreground text-sm">
                    {idea.description}
                </p>
            </div>
            <div className="mt-auto flex w-full items-center justify-between p-2">
                <p className="font-mono text-muted-foreground">
                    {idea.price ? `${idea.price / 100} €` : "Inconnu"}
                </p>
                <div className="flex gap-3">
                    {idea.link ? (
                        <a
                            className="flex items-center gap-1 font-medium text-sm"
                            href={idea.link}
                            target="_blank"
                        >
                            Ouvrir <Link4Small />
                        </a>
                    ) : null}
                    <Button icon={GiftSmall} text="Offrir" />
                </div>
            </div>
        </div>
    </div>
);

const useIsScrolled = () =>
    useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.scrollY / document.body.scrollHeight > 0.1;
    }, []);
