import { Diff } from 'diff-match-patch-ts';
export declare class DiffUtils {
    static charDiff(str1: string, str2: string): Diff[];
    static toChars(diffs: Diff[]): Diff[];
    static alignDiffs(diffs: Diff[][]): {
        original: Diff[];
        news: Diff[][];
    };
    static applyDiff(str: string, diffs: Diff[]): string;
}
