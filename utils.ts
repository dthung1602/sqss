// Copied from https://stackoverflow.com/a/55292366/7342188
export function trim(str: string, ch: string): string {
    return trimStart(trimEnd(str, ch), ch);
}

export function trimEnd(str: string, ch: string): string {
    let end = str.length;

    while (end > 0 && str[end - 1] === ch)
        --end;

    return (end < str.length) ? str.substring(0, end) : str;
}

export function trimStart(str: string, ch: string): string {
    let start = 0;

    while (start < str.length && str[start] === ch)
        ++start;

    return (start > 0) ? str.substring(start) : str;
}

export type AnyCase<T extends string> =
    string extends T ? string :
        T extends `${infer F1}${infer F2}${infer R}` ? (
                `${Uppercase<F1> | Lowercase<F1>}${Uppercase<F2> | Lowercase<F2>}${AnyCase<R>}`
                ) :
            T extends `${infer F}${infer R}` ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}` :
                ""