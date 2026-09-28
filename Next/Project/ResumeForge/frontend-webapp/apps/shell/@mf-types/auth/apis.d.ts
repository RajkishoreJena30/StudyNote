
    export type RemoteKeys = 'auth/AuthApp';
    type PackageType<T> = T extends 'auth/AuthApp' ? typeof import('auth/AuthApp') :any;