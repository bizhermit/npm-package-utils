declare const generateDeclaretionFile: (cwd: string, options?: {
    ignoreFileNames: Array<string>;
    quiet?: boolean;
}) => void;
export default generateDeclaretionFile;
