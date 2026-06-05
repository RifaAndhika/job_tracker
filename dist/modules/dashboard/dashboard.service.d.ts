export declare const totalApplicationsService: (userid: string) => Promise<number>;
export declare const totalApplicationsByStatusService: (userid: string) => Promise<{
    total: number;
    APPLIED: number;
    SCREENING: number;
    INTERVIEW: number;
    OFFER: number;
    REJECTED: number;
    ACCEPTED: number;
}>;
export declare const totalApplicationsMonthlyService: (userid: string) => Promise<{
    month: Date;
    count: number;
}[]>;
export declare const getAcceptedRateService: (userId: string) => Promise<number>;
export declare const getDashboardOverviewService: (userId: string) => Promise<{
    totalApplications: number;
    statusStats: {
        total: number;
        APPLIED: number;
        SCREENING: number;
        INTERVIEW: number;
        OFFER: number;
        REJECTED: number;
        ACCEPTED: number;
    };
    monthlyStats: {
        month: Date;
        count: number;
    }[];
    acceptedRate: number;
}>;
//# sourceMappingURL=dashboard.service.d.ts.map