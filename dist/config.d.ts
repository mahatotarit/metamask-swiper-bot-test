export declare let variables_pre: Record<string, any> | null | undefined;
declare const config: (variables: Record<string, any>) => Promise<void>;
declare const start: () => Promise<void>;
export { config, start };
