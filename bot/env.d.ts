import { IEnv } from "./src/schemas/env";

declare global {
    namespace NodeJS {
        interface ProcessEnv extends IEnv {}
    }
}