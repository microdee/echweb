using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Nuke.Cola;
using Nuke.Common.IO;
using Nuke.Common.Utilities;
using Serilog;
using Standart.Hash.xxHash;

public record class SiteMeta(string? Name, string? Title, string? Description, string? Image);

public partial class CardlinkHandler
{
    const RegexOptions ReOps = 
        RegexOptions.IgnoreCase
        | RegexOptions.IgnorePatternWhitespace
    ;

    private static HttpClient HttpClientConfig(HttpClient client)
    {
        client.Timeout = TimeSpan.FromMinutes(3);
        client.DefaultRequestHeaders.ConnectionClose = true;
        return client;
    }
    
    [GeneratedRegex("""<cardlink\s+href="(?<URL>.+?)".*?></""", ReOps)]
    private static partial Regex CardlinkRegex();

    [GeneratedRegex("""content="(?<CONTENT>.*?)" """, ReOps)]
    private static partial Regex PropertyContentRegex();

    [GeneratedRegex("""<title.*?>(?<CONTENT>.+?)</title>""", ReOps)]
    private static partial Regex TitleTagRegex();

    private static string? GetMetaProperty(string html, string name)
    {
        var metaTags = Regex.Matches(html, "<meta.+?>");
        for (int i = 0; i < metaTags.Count; i++)
        {
            var match = metaTags[i];
            var isProperty = Regex.IsMatch(match.Value,
                $"""
                (property|name|data-hid)="{name}"
                """
            );
            if (isProperty)
            {
                return match.Value.Parse(PropertyContentRegex())("CONTENT"); 
            }
        }
        return null;
    }

    private static string? GetMetaProperty(string html, IEnumerable<string> names)
        => names
            .Select(n => GetMetaProperty(html, n))
            .FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));

    private static SiteMeta GetSiteMeta(string url)
    {
        var html = "";
        Log.Information("    Getting meta from {0}", url);
        try
        {
            html = HttpTasks.HttpDownloadString(url, HttpClientConfig);
        }
        catch(Exception e)
        {
            Log.Error(e, "    Failed to fetch {0}", url);
            return new(null, "WEBSITE UNAVAILABLE", url, null);
        }

        var name = GetMetaProperty(html, ["og:site_name", "twitter:site"]);
        var title = GetMetaProperty(html,["og:title", "twitter:title"]);
        var desc = GetMetaProperty(html,["og:description", "twitter:description"]);
        var img = GetMetaProperty(html,["og:image", "twitter:image:src"]);

        title ??= html.Parse(TitleTagRegex())("CONTENT");

        return new(name?.Replace("\t", " "), title?.Replace("\t", " "), desc, img);
    }

    private static AbsolutePath? HandleImage(AbsolutePath md, string url, string img)
    {
        Log.Information("    Downloading image {0}", img);
        var ext = ".unknown";
        var urlHash = xxHash64.ComputeHash(url).ToString();
        try
        {
            var imgUri = new Uri(img);
            ext = AbsolutePath.Create(imgUri.AbsolutePath).Extension.Else(".unknown");
        }
        catch (Exception e)
        {
            Log.Error(e, "        Invalid URL {0}", img);
            return null;
        }
        var imgPath = md.Parent / (md.Name + "-links") / (urlHash + ext);
        Log.Information("        to {0}", imgPath);
        try
        {
            HttpTasks.HttpDownloadFile(img, imgPath, clientConfigurator: HttpClientConfig);
        }
        catch (Exception e)
        {
            Log.Error(e, "    Failed to download {0}", img);
            return null;
        }
        return imgPath;
    }

    public static string TransformCardLinkLine(string line, AbsolutePath md)
    {
        var url = line.Parse(CardlinkRegex(), forceNullOnWhitespce: true)("URL");
        if (string.IsNullOrWhiteSpace(url)) return line;

        var (name, title, desc, img) = GetSiteMeta(url);
        var useUrlAsDesc = desc == null && title == null;
        desc = useUrlAsDesc ? url : desc;
        AbsolutePath? imgPath = null;

        if (img != null)
        {
            imgPath = HandleImage(md, url, img);
        }
        
        var lines = new []
        {
                                   $"""<a href="{url}">""",
            imgPath == null ? "" : $"""<img class="expand" src="{md.Name}-links/{imgPath.Name}"></img>""",
                                    """<div class="cardContent">""",
               name == null ? "" : $"""<p class="site">{name}</p>""",
              title == null ?       """<h2>&nbsp;</h2>""" : $"""<h2>{title}</h2>""",
               desc == null ? "" : $"""<p>{desc}</p>""",
                                    """</div>""",
                                    """</a>"""
        }.Where(l => !string.IsNullOrWhiteSpace(l));

        return line.Replace("></", $">\n{lines.JoinNewLine()}\n</");
    }
}