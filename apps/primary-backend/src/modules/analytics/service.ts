import { prisma } from "db";

export abstract class AnalyticsService {

    static async getSummary(userId: number) {
        const conversations = await prisma.conversation.findMany({
            where: { userId },
            select: {
                inputTokenCount: true,
                outputTokenCount: true,
                modelProviderMapping: {
                    select: {
                        inputTokenCost: true,
                        outputTokenCost: true,
                    }
                }
            }
        });

        const totalRequests = conversations.length;
        const totalInputTokens = conversations.reduce((sum, c) => sum + c.inputTokenCount, 0);
        const totalOutputTokens = conversations.reduce((sum, c) => sum + c.outputTokenCount, 0);
        const totalCreditsConsumed = conversations.reduce((sum, c) => {
            const cost = (c.inputTokenCount * c.modelProviderMapping.inputTokenCost + c.outputTokenCount * c.modelProviderMapping.outputTokenCost) / 10;
            return sum + cost;
        }, 0);

        return {
            totalRequests,
            totalInputTokens,
            totalOutputTokens,
            totalCreditsConsumed: Math.round(totalCreditsConsumed),
        };
    }

    static async getModelBreakdown(userId: number) {
        const conversations = await prisma.conversation.findMany({
            where: { userId },
            select: {
                inputTokenCount: true,
                outputTokenCount: true,
                modelProviderMapping: {
                    select: {
                        inputTokenCost: true,
                        outputTokenCost: true,
                        model: {
                            select: {
                                name: true,
                                slug: true,
                            }
                        },
                        provider: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        });

        // Group by model slug
        const grouped: Record<string, {
            modelName: string;
            modelSlug: string;
            providerName: string;
            requestCount: number;
            totalInputTokens: number;
            totalOutputTokens: number;
            totalCreditsConsumed: number;
        }> = {};

        for (const c of conversations) {
            const slug = c.modelProviderMapping.model.slug;
            if (!grouped[slug]) {
                grouped[slug] = {
                    modelName: c.modelProviderMapping.model.name,
                    modelSlug: slug,
                    providerName: c.modelProviderMapping.provider.name,
                    requestCount: 0,
                    totalInputTokens: 0,
                    totalOutputTokens: 0,
                    totalCreditsConsumed: 0,
                };
            }
            grouped[slug].requestCount++;
            grouped[slug].totalInputTokens += c.inputTokenCount;
            grouped[slug].totalOutputTokens += c.outputTokenCount;
            grouped[slug].totalCreditsConsumed += Math.round(
                (c.inputTokenCount * c.modelProviderMapping.inputTokenCost + c.outputTokenCount * c.modelProviderMapping.outputTokenCost) / 10
            );
        }

        return Object.values(grouped).sort((a, b) => b.requestCount - a.requestCount);
    }
}
