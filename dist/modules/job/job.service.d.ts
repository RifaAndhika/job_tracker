import { JobQueryType, CreateJobInput } from "./job.schema";
export declare const createJobService: (userId: string, data: CreateJobInput) => Promise<{
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    companyName: string;
    position: string;
    status: import(".prisma/client").$Enums.ApplicationStatus;
    appliedDate: Date;
    source: string | null;
    notes: string | null;
}>;
export declare const getJobService: (userId: string, query: JobQueryType) => Promise<{
    data: {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyName: string;
        position: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedDate: Date;
        source: string | null;
        notes: string | null;
    }[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const getJobByIdService: (jobId: string, userId: string) => Promise<{
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    companyName: string;
    position: string;
    status: import(".prisma/client").$Enums.ApplicationStatus;
    appliedDate: Date;
    source: string | null;
    notes: string | null;
} | null>;
export declare const updateJobService: (userId: string, jobId: string, data: any) => Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare const deleteJobService: (userId: string, jobId: string) => Promise<import(".prisma/client").Prisma.BatchPayload>;
//# sourceMappingURL=job.service.d.ts.map