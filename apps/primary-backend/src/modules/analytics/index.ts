import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import { AnalyticsService } from "./service";
import { AnalyticsModel } from "./models";

export const app = new Elysia({ prefix: "analytics" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET!,
        })
    )
    .resolve(async ({ cookie: { auth }, status, jwt }) => {
        if (!auth) {
            return status(401);
        }

        const decoded = await jwt.verify(auth.value as string);

        if (!decoded || !decoded.userId) {
            return status(401);
        }

        return {
            userId: decoded.userId as string,
        };
    })
    .get("/summary", async ({ userId }) => {
        const summary = await AnalyticsService.getSummary(Number(userId));
        return summary;
    }, {
        response: {
            200: AnalyticsModel.summaryResponseSchema,
        }
    })
    .get("/model-breakdown", async ({ userId }) => {
        const breakdown = await AnalyticsService.getModelBreakdown(Number(userId));
        return { breakdown };
    }, {
        response: {
            200: AnalyticsModel.modelBreakdownResponseSchema,
        }
    });
