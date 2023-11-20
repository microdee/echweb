import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { glob, globSync } from "glob";
import mustache from "mustache";
import constants from "echweb-content/js/Constants.js";

mustache.escape = t => t;

console.log("Preparing templated files");

let globOptions = {
    absolute: false,
    nodir: true,
    ignore: "**/node_modules/**"
}

let files = globSync('./templates/**/*', globOptions)
    .forEach(f => {
        let rpath = ('./' + path.relative("./templates", f))
            .replaceAll('\\', '/');
        let template = fs.readFileSync(f).toString();
        console.log(rpath);
        let output = mustache.render(template, constants);
        fse.outputFileSync(rpath, output);
    });

let template = fs.readFileSync('./social.sbnhtml').toString();

console.log("Preparing social-media previews");

globSync('./content/**/*.md', globOptions)
    .forEach(f => {
        let cpath = ('/c/' + path.relative("./content", f))
            .replaceAll('.md', '')
            .replaceAll('\\', '/');
        let tpath = './public' + cpath + '.html';
        let content = fs.readFileSync(f).toString();
        let metaRegex = /\<\!\-\-\s(?<meta>.*?)\s\-\-\>/gs;
        let metaResult = metaRegex.exec(content);
        if(metaResult !== null)
        {
            console.log(cpath);
            let model = {
                ...constants,
                ...JSON.parse(metaResult.groups.meta)
            };
            if(!('img' in model))
            {
                model.img = "social_thumb.jpg";
            }
            if(!('title' in model))
            {
                model.title = `${constants.globalTitle} / ${cpath}`;
            }
            model.path = cpath;
            let output = mustache.render(template, model);
            fse.outputFileSync(tpath, output);
        }
    });

