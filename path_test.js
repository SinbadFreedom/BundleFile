/**
 * Created by sinbad on 2017/7/9.
 */
'use strict';

const fs = require("fs");
const path = require("path");
const diff_match_patch = require("./diff_match_patch_uncompressed.js");

const dmp = new diff_match_patch();

const OLD_FILE_NAME = "./PythonDocApp/android/full/1.0.0/index.android.bundle";
const PATH_FILE_NAME = "./PythonDocApp/android/path/index.android.bundle_1.0.0";
const PATH_TEST_FOLDER = "./PythonDocApp/android/test";
const PATH_TEST_BUNDLE_FILE = PATH_TEST_FOLDER + "/index.android.bundle";


let oldText = fs.readFileSync(OLD_FILE_NAME, 'utf-8');
let patchText = fs.readFileSync(PATH_FILE_NAME, 'utf-8');

/** merge*/
let patches = dmp.patch_fromText(patchText);
let results = dmp.patch_apply(patches, oldText);
let mergeText = results[0];

mkdirsSync(PATH_TEST_FOLDER);

console.log("mergeText ", mergeText);
fs.writeFileSync(PATH_TEST_BUNDLE_FILE, mergeText);

results = results[1];

for (let x = 0; x < results.length; x++) {
    if (results[x]) {
        console.log("Ok");
    } else {
        console.log("Fail");
    }
}


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