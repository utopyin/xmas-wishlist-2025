import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md font-medium text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
                destructive:
                    "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
            },
            size: {
                default:
                    "px-1.5 py-1.5 *:data-[slot='icon']:size-4.5 *:data-[slot='text']:h-4.5 *:data-[slot='text']:px-1.5 [&>[data-slot='icon']>svg]:size-3",
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
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        iconSide?: "left" | "right";
        text?: string;
        icon?: (props: { className?: string }) => React.ReactNode;
    }) {
    const Comp = asChild ? SlotPrimitive.Slot : "button";

    const isIconLeft = Icon && iconSide === "left";
    const isIconRight = Icon && iconSide === "right";

    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            data-slot="button"
            {...props}
        >
            {isIconLeft ? (
                <div
                    className="flex items-center justify-center"
                    data-slot="icon"
                >
                    <Icon />
                </div>
            ) : null}
            {text ? <span data-slot="text">{text}</span> : null}
            {isIconRight ? (
                <div
                    className="flex items-center justify-center"
                    data-slot="icon"
                >
                    <Icon />
                </div>
            ) : null}
        </Comp>
    );
}

export { Button, buttonVariants };
