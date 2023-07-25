// options/types.ts

type Profile = {
    name: string;
    id: string;
    //avatarUrl: string;
};

type OverviewStats = {
    coverLetters: number;
    resumes: string; // "In the works" suggests it's not always a number.
    timeSavedMinutes: number;
};

type MonthlyRates = {
    month: string;
    value: number; // Assuming it's a percentage.
}[];

type GlobalStats = {
    globalCVsGenerated: number;
};

export type DashboardProps = {
    profile: Profile;
    secretKey: string;
    overviewStats: OverviewStats;
    monthlyRates: MonthlyRates;
    globalStats: GlobalStats;
};
