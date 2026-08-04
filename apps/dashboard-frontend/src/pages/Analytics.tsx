import { useQuery } from "@tanstack/react-query";
import { useElysiaClient } from "@/providers/Eden";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Loader2,
    BarChart2,
    Cpu,
    Zap,
    MessageSquare,
    Coins,
} from "lucide-react";

export function Analytics() {
    const elysiaClient = useElysiaClient();

    const summaryQuery = useQuery({
        queryKey: ["analytics-summary"],
        queryFn: async () => {
            const response = await elysiaClient.analytics.summary.get();
            if (response.error) throw new Error("Failed to fetch analytics summary");
            return response.data;
        },
    });

    const breakdownQuery = useQuery({
        queryKey: ["analytics-model-breakdown"],
        queryFn: async () => {
            const response = await elysiaClient.analytics["model-breakdown"].get();
            if (response.error) throw new Error("Failed to fetch model breakdown");
            return response.data;
        },
    });

    const summary = summaryQuery.data;
    const breakdown = breakdownQuery.data?.breakdown ?? [];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Monitor your usage, model throughput, and token consumption.
                    </p>
                </div>

                {/* Summary stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Requests</span>
                                <MessageSquare className="size-4 text-muted-foreground/60" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold tracking-tight">
                                {summaryQuery.isLoading ? (
                                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                                ) : (
                                    (summary?.totalRequests ?? 0).toLocaleString()
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                all-time API calls
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border/50">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Credits Consumed</span>
                                <Coins className="size-4 text-muted-foreground/60" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold tracking-tight">
                                {summaryQuery.isLoading ? (
                                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                                ) : (
                                    (summary?.totalCreditsConsumed ?? 0).toLocaleString()
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                total credits spent
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Token volume card */}
                <Card className="bg-card/30 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Token Volume</CardTitle>
                        <CardDescription>
                            Breakdown of input (prompt) vs. output (completion) tokens across all requests.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {summaryQuery.isLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                                <Loader2 className="size-4 animate-spin" />
                                Loading token data...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/50 px-4 py-4">
                                    <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                        <Cpu className="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Input Tokens</p>
                                        <p className="text-2xl font-bold tracking-tight tabular-nums">
                                            {(summary?.totalInputTokens ?? 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/50 px-4 py-4">
                                    <div className="size-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                        <Zap className="size-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Output Tokens</p>
                                        <p className="text-2xl font-bold tracking-tight tabular-nums">
                                            {(summary?.totalOutputTokens ?? 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Model breakdown table */}
                <div>
                    <h2 className="text-sm font-semibold mb-4 text-foreground">
                        Model Breakdown
                        {!breakdownQuery.isLoading && (
                            <span className="text-muted-foreground font-normal ml-2">
                                ({breakdown.length} model{breakdown.length !== 1 ? "s" : ""})
                            </span>
                        )}
                    </h2>

                    {breakdownQuery.isLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm py-8">
                            <Loader2 className="size-4 animate-spin" />
                            Loading model data...
                        </div>
                    ) : breakdown.length === 0 ? (
                        <Card className="bg-card/20 border-border/40 border-dashed">
                            <CardContent className="pt-6">
                                <div className="text-center py-8">
                                    <BarChart2 className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">No usage data yet</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">
                                        Send your first API request to see analytics appear here.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Model</th>
                                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Provider</th>
                                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Requests</th>
                                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Input Tokens</th>
                                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Output Tokens</th>
                                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Credits Used</th>
                                    </tr>
                                </thead>
                                <tbody className="text-foreground">
                                    {breakdown.map((row) => (
                                        <tr key={row.modelSlug} className="border-b border-border/30 last:border-0">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-foreground">{row.modelName}</p>
                                                <p className="text-xs text-muted-foreground font-mono mt-0.5">{row.modelSlug}</p>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{row.providerName}</td>
                                            <td className="px-4 py-3 text-right tabular-nums text-foreground">{row.requestCount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right tabular-nums text-foreground">{row.totalInputTokens.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right tabular-nums text-foreground">{row.totalOutputTokens.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right tabular-nums text-foreground">{row.totalCreditsConsumed.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
