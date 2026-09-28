export interface Credentials {
    email: string;
    password: string;
}
export type CredentialErrors = Partial<Record<keyof Credentials, string>>;
export declare function validateCredentials({ email, password }: Credentials): CredentialErrors;
