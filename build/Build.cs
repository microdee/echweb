using System.IO;
using System.Linq;
using Nuke.Common;
using Nuke.Common.IO;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.Git;
using Nuke.Common.Utilities;
using Serilog;

class BuildMain : NukeBuild
{
    public static int Main () => Execute<BuildMain>();

    [PathVariable("npm")]
    Tool NPM;

    void InstallSharedBody() => NPM("install", logInvocation: true, workingDirectory: RootDirectory / "shared");
    Target InstallShared => _ => _
        .Executes(InstallSharedBody);

    void InstallContentBody() => NPM("install", logInvocation: true, workingDirectory: RootDirectory / "content");
    Target InstallContent => _ => _
        .DependsOn(InstallShared)
        .Executes(InstallContentBody);

    void InstallBody() => NPM("install", logInvocation: true, workingDirectory: RootDirectory);
    Target Install => _ => _
        .DependsOn(InstallContent)
        .Executes(InstallBody);

    void PrepareBody() => NPM("run mdPrepare", logInvocation: true, workingDirectory: RootDirectory);
    Target Prepare => _ => _
        .After(Install)
        .Executes(PrepareBody);

    void BuildBody()
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
    }
    Target Build => _ => _
        .After(Install, Prepare)
        .Executes(BuildBody);

    record ContentDestinationPair(string Content, string Destination);

    Target Deploy => _ => _
        .Executes(() =>
        {
            var remotes = new ContentDestinationPair[] {
                new("https://github.com/microdee/echweb-mcrode.git", "https://github.com/microdee/microdee.github.io.git"),
                // new("https://github.com/holy-olga/holy-olga.github.io-dev.git", "https://github.com/holy-olga/holy-olga.github.io.git"),
            };

            var inputContent = RootDirectory / "Content";
            var tempDist = RootDirectory / "dist_temp";
            var dist = RootDirectory / "dist";

            foreach(var (contentGit, dstGit) in remotes)
            {
                Log.Information("---- Building from content from {0} ----", contentGit);
                if (inputContent.DirectoryExists()) inputContent.DeleteDirectory();
                if (tempDist.DirectoryExists()) tempDist.DeleteDirectory();
                if (dist.DirectoryExists()) dist.DeleteDirectory();

                Log.Information("Cloning content");
                GitTasks.Git(
                    $"clone  --depth 1 --recurse-submodules {contentGit} {inputContent}",
                    workingDirectory: RootDirectory,
                    logInvocation: true
                );
                
                Log.Information("NPM install");
                InstallSharedBody();
                InstallContentBody();
                InstallBody();
                
                Log.Information("Preparing content");
                PrepareBody();
                
                Log.Information("Building site");
                BuildBody();

                Log.Information("Cloning destination");
                GitTasks.Git(
                    $"clone --recurse-submodules {dstGit} {tempDist}",
                    workingDirectory: RootDirectory,
                    logInvocation: true
                );

                Log.Information("Exchanging .git folder");
                FileSystemTasks.MoveDirectoryToDirectory(
                    tempDist / ".git",
                    dist,
                    DirectoryExistsPolicy.Fail
                );

                Log.Information("Pushing new content");
                GitTasks.Git(
                    $"add .",
                    workingDirectory: dist,
                    logInvocation: true
                );
                GitTasks.Git(
                    $"commit -m \"deploy from local\"",
                    workingDirectory: dist,
                    logInvocation: true
                );
                GitTasks.Git(
                    $"push",
                    workingDirectory: dist,
                    logInvocation: true
                );
            }
        });
}
