using System.IO;
using System.Linq;
using Nuke.Common;
using Nuke.Common.IO;
using Nuke.Common.Tooling;
using Nuke.Common.Utilities;

class BuildMain : NukeBuild
{
    public static int Main () => Execute<BuildMain>();

    [PathVariable("npm")]
    Tool NPM;

    Target InstallShared => _ => _
        .Executes(() => NPM("install", workingDirectory: RootDirectory / "shared"));

    Target InstallContent => _ => _
        .DependsOn(InstallShared)
        .Executes(() => NPM("install", workingDirectory: RootDirectory / "content"));

    Target Install => _ => _
        .DependsOn(InstallContent)
        .Executes(() => NPM("install", workingDirectory: RootDirectory));

    Target Prepare => _ => _
        .After(Install)
        .Executes(() =>
        {
            NPM("run mdPrepare", workingDirectory: RootDirectory);
        });

    Target Build => _ => _
        .After(Install, Prepare)
        .Executes(() =>
        {
            NPM("run build", workingDirectory: RootDirectory);
            FileSystemTasks.CopyDirectoryRecursively(
                RootDirectory / "content",
                RootDirectory / "dist" / "content",
                DirectoryExistsPolicy.Merge,
                FileExistsPolicy.Overwrite,
                d => d.Name.EqualsAnyOrdinalIgnoreCase(
                    "node_modules",
                    "js",
                    ".git",
                    ".github",
                    "dist"
                ),
                f => f.Name.EqualsOrdinalIgnoreCase("package.json")
            );
            FileSystemTasks.CopyDirectoryRecursively(
                RootDirectory / "content" / "dist",
                RootDirectory / "dist",
                DirectoryExistsPolicy.Merge,
                FileExistsPolicy.Overwrite
            );
        });
}
