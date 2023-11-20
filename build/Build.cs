using System.IO;
using Nuke.Common;
using Nuke.Common.IO;
using Nuke.Common.Tooling;

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
        .Executes(() =>
        {
            NPM("run prepare", workingDirectory: RootDirectory);
            Directory.CreateSymbolicLink(RootDirectory / "public" / "content", RootDirectory / "content");
        });

    Target Build => _ => _
        .Executes(() =>
        {
            NPM("run build", workingDirectory: RootDirectory);
            (RootDirectory / "dist" / "content" / "node_modules").DeleteDirectory();
            (RootDirectory / "dist" / "content" / ".git").DeleteDirectory();
        });
}
