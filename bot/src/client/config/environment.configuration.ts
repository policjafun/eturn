export default class EnvironmentConfiguration {
    public static isDevelopment: boolean =
        process.env.BUN_ENV === 'development';
}
