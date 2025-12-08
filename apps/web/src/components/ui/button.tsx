import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { useMemo } from "react";
import { LoaderCircle } from "@/components/ui/loader-circle";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex shrink-0 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: cn(
                    "bg-linear-to-b from-sky-500 to-sky-700 text-primary-foreground",
                    "hover:from-sky-700",
                    "[box-shadow:0px_0px_0px_1px_#06547D,_0px_1px_3px_rgba(0,_0,_0,_0.2),_inset_0px_1px_0px_rgba(255,_255,_255,_0.2)]",
                    "*:[filter:drop-shadow(0px_1px_2px_rgba(0,_0,_0,_0.25))]",
                    "text-shadow-sm"
                ),
                destructive: cn(
                    "bg-linear-to-b from-orange-500 to-red-700 text-primary-foreground",
                    "hover:from-red-700",
                    "[box-shadow:0px_0px_0px_1px_#450a0a,_0px_1px_3px_rgba(0,_0,_0,_0.2),_inset_0px_1px_0px_rgba(255,_255,_255,_0.2)]",
                    "*:[filter:drop-shadow(0px_1px_2px_rgba(0,_0,_0,_0.25))]",
                    "text-shadow-sm"
                ),
            },
            size: {
                default:
                    "px-1.5 py-1.5 [&_[data-slot='icon']>svg]:size-3 [&_[data-slot='icon']]:size-4.5 [&_[data-slot='text']]:h-4.5 [&_[data-slot='text']]:px-1.5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    iconSide = "right",
    text,
    icon: Icon,
    showLoading = false,
    ...props
}: React.ComponentProps<typeof motion.button> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        iconSide?: "left" | "right";
        text?: string;
        showLoading?: boolean;
        icon?: (props: { className?: string }) => React.ReactNode;
    }) {
    const Comp = asChild ? motion.create(SlotPrimitive.Slot) : motion.button;

    const isIconLeft = Icon && iconSide === "left";
    const isIconRight = Icon && iconSide === "right";

    const borderRadius = useMemo(() => {
        if (!size) return 8;
        return { default: 8, sm: 6, lg: 10 }[size];
    }, [size]);

    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            data-slot="button"
            layout
            style={{ borderRadius }}
            transition={ButtonTransition}
            {...props}
        >
            <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    className="inline-flex items-center justify-center"
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    key={text}
                    layout="position"
                    transition={ButtonTransition}
                >
                    {isIconLeft ? (
                        <div
                            className="flex items-center justify-center"
                            data-slot="icon"
                        >
                            {showLoading ? <LoaderCircle /> : <Icon />}
                        </div>
                    ) : null}
                    {text ? (
                        <span data-slot="text" key={text}>
                            {text}
                        </span>
                    ) : null}
                    {isIconRight ? (
                        <div
                            className="flex items-center justify-center"
                            data-slot="icon"
                        >
                            {showLoading ? <LoaderCircle /> : <Icon />}
                        </div>
                    ) : null}
                </motion.div>
            </AnimatePresence>
        </Comp>
    );
}

export { Button, buttonVariants };

export const ButtonTransition: Transition = {
    duration: 0.1,
    ease: "easeOut",
};
