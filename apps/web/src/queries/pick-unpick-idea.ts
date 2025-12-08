import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db, schema } from "@wishlist/db";
import * as d from "drizzle-orm";
import { toast } from "sonner";
import { z } from "zod";
import { getListIdeasQueryOptions } from "./list-ideas";

const pickIdeaServerFn = createServerFn()
    .inputValidator(z.object({ ideaId: z.string(), deviceId: z.string() }))
    .handler(async ({ data: { ideaId, deviceId } }) => {
        const result = await db
            .update(schema.ideas)
            .set({ pickedBy: deviceId })
            .where(
                d.and(
                    d.eq(schema.ideas.id, ideaId),
                    d.isNull(schema.ideas.pickedBy)
                )
            );

        if (result.rowsAffected === 0) {
            return {
                message: "L'idée cadeau a déjà été sélectionnée.",
                success: false,
            };
        }

        return { success: true };
    });

export const unpickIdeaServerFn = createServerFn()
    .inputValidator(z.object({ ideaId: z.string(), deviceId: z.string() }))
    .handler(async ({ data: { ideaId, deviceId } }) => {
        const result = await db
            .update(schema.ideas)
            .set({ pickedBy: null })
            .where(
                d.and(
                    d.eq(schema.ideas.id, ideaId),
                    d.eq(schema.ideas.pickedBy, deviceId)
                )
            );

        if (result.rowsAffected === 0) {
            return {
                message: "Vous ne pouvez pas modifier cette idée cadeau.",
                success: false,
            };
        }

        return { success: true };
    });

export const usePickIdeaMutation = (ideaId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["pick-idea", ideaId],
        mutationFn: (deviceId: string) =>
            pickIdeaServerFn({ data: { ideaId, deviceId } }),
        onError(error) {
            toast.error(error.message);
        },
        onSuccess(data) {
            if (!data.success) {
                toast.error(data.message);
            }
        },
        async onSettled(_, __, deviceId) {
            await queryClient.invalidateQueries(
                getListIdeasQueryOptions(deviceId)
            );
        },
    });
};

export const useUnpickIdeaMutation = (ideaId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["unpick-idea", ideaId],
        mutationFn: (deviceId: string) =>
            unpickIdeaServerFn({ data: { ideaId, deviceId } }),
        onError(error) {
            toast.error(error.message);
        },
        onSuccess(data) {
            if (!data.success) {
                toast.error(data.message);
            }
        },
        async onSettled(_, __, deviceId) {
            await queryClient.invalidateQueries(
                getListIdeasQueryOptions(deviceId)
            );
        },
    });
};
