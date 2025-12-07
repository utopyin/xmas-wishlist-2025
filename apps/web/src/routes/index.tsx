import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
import { listIdeasQueryOptions } from "@/queries/list-ideas";

export const Route = createFileRoute("/")({
    component: HomeComponent,
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(listIdeasQueryOptions),
});

const ANIMATION_DURATION = 1.5;
const ANIMATION_EASE: Easing = "easeOut";

function HomeComponent() {
    const { data, isLoading } = useQuery(listIdeasQueryOptions);
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
        const offset = 200 - percent * 200;
        return `translateY(${scroll.scrollY.get() - offset}px)`;
    });

    const isScrolled = useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.scrollY / document.body.scrollHeight > 0.2;
    }, []);

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

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div>No data</div>;

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
                className="flex h-[80svh] min-h-min shrink-0 flex-col justify-center"
                initial={{ filter: "blur(10px)", opacity: 0 }}
                style={{
                    filter: useMotionTemplate`blur(${blur}px)`,
                    transform,
                }}
            >
                <Letter className="shrink-0 translate-y-[5svh]" />
            </motion.div>
            <ProgressiveBlur
                className="fixed h-50"
                intensity={progressiveBlurAmount}
                position="bottom"
            />
            <Wishlist />
        </div>
    );
}

const Wishlist = () => (
    <div className="z-10 flex h-[70svh] w-full max-w-[min(48rem,calc(100svw-2rem))] flex-col items-center rounded-t-2xl rounded-b-none bg-card">
        <h1>Wishlist</h1>
    </div>
);
