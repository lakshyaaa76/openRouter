import { t } from "elysia";

export namespace AnalyticsModel {

    export const summaryResponseSchema = t.Object({
        totalRequests: t.Number(),
        totalInputTokens: t.Number(),
        totalOutputTokens: t.Number(),
        totalCreditsConsumed: t.Number(),
    });

    export type summaryResponseSchema = typeof summaryResponseSchema.static;

    export const modelBreakdownItemSchema = t.Object({
        modelName: t.String(),
        modelSlug: t.String(),
        providerName: t.String(),
        requestCount: t.Number(),
        totalInputTokens: t.Number(),
        totalOutputTokens: t.Number(),
        totalCreditsConsumed: t.Number(),
    });

    export const modelBreakdownResponseSchema = t.Object({
        breakdown: t.Array(modelBreakdownItemSchema)
    });

    export type modelBreakdownResponseSchema = typeof modelBreakdownResponseSchema.static;
}
