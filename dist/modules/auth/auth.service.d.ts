export declare function registerUser(name: string, email: string, password: string): Promise<{
    email: string;
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function loginUser(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare function logoutUser(userId: string): Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map