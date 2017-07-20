/**
 * Created by sinbad on 2017/7/8.
 */
'use strict';

const fs = require("fs");
const path = require("path");
const diff_match_patch = require("./diff_match_patch_uncompressed.js");

const dmp = new diff_match_patch();

/** Check for arguments*/
if (process.argv.length < 3) {
    /** 第三个参数表示渠道名称, [yingyongbao, google] */
    console.log("Usage: node generate_bundle_path.js CHANNEL_NAME");
    process.exit(1);
}

const channelName = process.argv[2];

const BUNDLE_FILE_VERSION = "./PythonDocApp/" + channelName +"/full";
const BUNDLE_FILE_LATEST = "./PythonDocApp/" + channelName +"/latest/index.android.bundle";
const BUNDLE_FILE_PATH_FOLDER = "./PythonDocApp/" + channelName + "/path";

const bundleTextLatest = fs.readFileSync(BUNDLE_FILE_LATEST, 'utf-8');

console.log("bundleTextLatest : ", bundleTextLatest.length);


fs.readdir(BUNDLE_FILE_VERSION, function (error, files) {
    if (error) {
        console.log("error: ", error);
        return;
    }

    files.forEach(function (filename) {
        let pathName = path.join(BUNDLE_FILE_VERSION, filename);
        console.log("pathName ", pathName);
        let bundleFileName = pathName + "/index.android.bundle";
        console.log("bundleFileName : ", bundleFileName);
        let bundleTextVersion = fs.readFileSync(bundleFileName, 'utf-8');
        let pathText = patch_launch(bundleTextVersion, bundleTextLatest);
        let bundlePath = BUNDLE_FILE_PATH_FOLDER + "/" + filename;
        mkdirsSync(bundlePath);
        let pathFileName = bundlePath + "/index.android.bundle";
        console.log("pathFileName : ", pathFileName);
        fs.writeFileSync(pathFileName, pathText);
    });
});

function patch_launch(oldText, newText) {
    /** create diff path text*/
    let diff = dmp.diff_main(oldText, newText, true);
    let patch_list = dmp.patch_make(oldText, newText, diff);
    let patch_text = dmp.patch_toText(patch_list);
    console.log("patch_text " + patch_text);
    return patch_text;
}

// function mergePath(oldText, patch_text) {
//     /** merge*/
//     let patches = dmp.patch_fromText(patch_text);
//     let results = dmp.patch_apply(patches, oldText);
//     let mergeText = results[0];
//     console.log("mergeText ", mergeText);
//     results = results[1];
//     for (let x = 0; x < results.length; x++) {
//         if (results[x]) {
//             console.log("Ok");
//         } else {
//             console.log("Fail");
//         }
//     }
// }

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            console.log("mkdir : ", dirname);
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
