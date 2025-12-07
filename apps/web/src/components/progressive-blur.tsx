import { type MotionValue, motion, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type BlurEffectProps = {
    className?: string;
    intensity?: MotionValue<number> | number;
    position?: "top" | "bottom" | "left" | "right";
};

export function ProgressiveBlur({
    className = "",
    intensity = 50,
    position = "top",
}: BlurEffectProps) {
    const intensityFactor = useTransform(
        () => (typeof intensity === "number" ? intensity : intensity.get()) / 50
    );

    const layer1BlurAmount = useTransform(
        intensityFactor,
        (f) => `blur(${1 * f}px)`
    );
    const layer2BlurAmount = useTransform(
        intensityFactor,
        (f) => `blur(${3 * f}px)`
    );
    const layer3BlurAmount = useTransform(
        intensityFactor,
        (f) => `blur(${6 * f}px)`
    );

    const blurLayers = [
        {
            blur: layer1BlurAmount,
            maskStart: 0,
            maskEnd: 25,
            zIndex: 1,
        },
        {
            blur: layer2BlurAmount,
            maskStart: 25,
            maskEnd: 75,
            zIndex: 2,
        },
        {
            blur: layer3BlurAmount,
            maskStart: 75,
            maskEnd: 100,
            zIndex: 3,
        },
    ];

    const positionStyles = {
        bottom: { bottom: 0, left: 0, right: 0, top: "auto" },
        top: { top: 0, left: 0, right: 0, bottom: "auto" },
        left: { left: 0, top: 0, bottom: 0, right: "auto" },
        right: { right: 0, top: 0, bottom: 0, left: "auto" },
    };

    const gradientDirection = {
        bottom: "to bottom",
        top: "to top",
        left: "to left",
        right: "to right",
    };

    return (
        <div
            className={cn("pointer-events-auto absolute z-10", className)}
            style={positionStyles[position]}
        >
            {blurLayers.map((layer, index) => (
                <motion.div
                    // biome-ignore lint/suspicious/noArrayIndexKey: won't reorder
                    key={index}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: "none",
                        zIndex: layer.zIndex,
                        backdropFilter: layer.blur,
                        WebkitBackdropFilter: layer.blur,
                        maskImage: `linear-gradient(${gradientDirection[position]}, transparent ${layer.maskStart}%, black ${layer.maskEnd}%)`,
                        WebkitMaskImage: `linear-gradient(${gradientDirection[position]}, transparent ${layer.maskStart}%, black ${layer.maskEnd}%)`,
                    }}
                />
            ))}
        </div>
    );
}
