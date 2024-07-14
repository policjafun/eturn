export type RequestLog = {
    path: string;
    method: string;

    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;

    ip?: string;
    userAgent?: string;
    referrer?: string;
    language?: string;
    country?: string;
}