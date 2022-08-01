declare const generateDeclaretionFile: (cwd: string, options?: {
    ignoreFileNames: Array<string>;
    quiet?: boolean;
    outDir?: string;
    outName?: string;
}) => void;
export default generateDeclaretionFile;
