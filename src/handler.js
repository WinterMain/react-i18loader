const md5 = require("blueimp-md5")
const fs = require("fs");
const deprecatedMark = "@DEPRECATED@"
const chineseS2T = require("chinese-s2t");

function transChineseS2T(value) {
    return chineseS2T.s2t(value.replace(/^\[R\]+/, ""));
}

function getObjValue(value, field) {
    if(value instanceof Object) {
        return value[field]
    }

    return value;
}

/**
 * Generate key for text
 */
function generateKey(text) {
    const trimed = text.replace(/[\s\r\n]/g, "")
    const textKey = trimed.slice(0, 8)

    return trimed.length > 8 ? `${textKey}_${md5(text).slice(0, 4)}` : textKey
}

// Remove comments in source code
// Remove comments like /*  */ and //
function removeComments(source) {
    return source.replace(/\/\*[\s\S]*?\*\//igm, "");
}

function replaceToSafeText(text) {
    return text.replace(/\*/g, "\\*").replace(/\./g, "\\.")
        .replace(/\+/g, "\\+").replace(/\^/g, "\\^")
        .replace(/\[/g, "\\[").replace(/\]/g, "\\]")
        .replace(/\?/g, "\\?").replace(/\$/g, "\\$")
        .replace(/\(/g, "\\(").replace(/\)/g, "\\)")
        .replace(/\|/g, "\\|")
}

function trimText(text) {
    return text.trim().replace(/(^\s+)|(^\s+)/g, " ")
}

// Get translation json filename
function getFileName(resourcePath) {
    const paths = resourcePath.split("/")
    const file = paths[paths.length - 1]
    return file.slice(0, file.lastIndexOf("."))
}

function getPathName(filename) {
    return `${filename}.lang.json`;
}

function generateContent(text, matchReg) {
    let stringCase = "this.$t(\"key\")";
    let jsxCase = `{${stringCase}}`;
    // String case "text"
    const strResult = generateForReg(text, /\"(.*?)\"/igm, matchReg, stringCase);
    // Case ">text{"  Case "}text<"  Case ">text<"
    const doubleResult = generateForReg(strResult.result, /(\>)(.+)(\<\/)/igm, matchReg, jsxCase, true);

    return {
        result: doubleResult.result,
        replacers: strResult.replacers.concat(doubleResult.replacers)
    };
}

// Generate translation for string inside
function generateForReg(text, selectionReg, matchReg, strTemplate, replacePure) {
    let replacers = [];
    const matchResult = text.match(selectionReg);
    let result = text;
    if (matchResult) {
        matchResult.forEach(item => {
            let pureStr = trimText(item.substring(1, replacePure ? item.length - 2 : item.length - 1));
            if (pureStr.match(matchReg) && pureStr.indexOf("this.$t") < 0) {
                let textKey = generateKey(pureStr);
                let newText = strTemplate.replace(new RegExp("key"), textKey);
                replacers.push({
                    origin: item,
                    old: pureStr,
                    new: replacePure ? `>${newText}</` : newText,
                    key: textKey,
                });
            }
        });

        replacers.forEach(item => {
            const regexp = new RegExp(replaceToSafeText(item.origin), "g");
            result = result.replace(regexp, item.new);
        });
    }

    return {
        result,
        replacers,
    }
}

function importlang(filePath, filename) {
    return `import CurLangTrans from "${filePath}${getPathName(filename)}";`
}

function generateFuncs(target, getLangStr, defaultLang) {
    return `
    ${target}.prototype.$t = function(key) {
        const curLang = ${getLangStr}
        if(!curLang && !CurLangTrans["${defaultLang}"]) return key;
        const trans = CurLangTrans[curLang]||CurLangTrans["${defaultLang}"]||{};
        return trans[key]===undefined?key:trans[key];
    };
`;
}

// Insert script to the component or page;
function insertScript(source, sourceMatchs, defaultLang, method) {
    let getLangStr;
    switch (method) {
        case "state": {
            getLangStr = "(this.state||{}).$lang";
        } break;
        case "func": {
            getLangStr = `(this.$getLang?this.$getLang():"${defaultLang}")`;
        } break;
        case "props":
        default: {
            getLangStr = "(this.props||{}).$lang";
        } break;
    }
    if(sourceMatchs && sourceMatchs.length > 0) {
        sourceMatchs.forEach(cur => {
            let curMatch = cur.match(/@i18n\([\"|'](.*?)[\"|']\)/);
            let objName = trimText(curMatch[1]);
            source += generateFuncs(objName, getLangStr, defaultLang);
            source = source.replace(curMatch[0], "");
        });
    }

    return source;
}

function sortObjectByKey(unordered) {
    const ordered = {};
    Object.keys(unordered).sort().forEach(function (key) {
        if (typeof unordered[key] === "string") {
            ordered[key] = unordered[key];
        } else {
            ordered[key] = sortObjectByKey(unordered[key]);
        }
    });
    return ordered
}


function writeDataToFile(data, langPath, noAddDeprecatedLangs) {
    const filePath = getPathName(langPath);

    try {
        const file = fs.readFileSync(filePath);
        const oldData = JSON.parse(file);
        const newData = Object.assign({}, data);

        Object.keys(oldData).forEach(lang => {
            if (!newData[lang]) {
                newData[lang] = oldData[lang]
            } else {
                Object.keys(newData[lang]).forEach(k => {
                    let dKey = k
                    if (dKey.indexOf(deprecatedMark) >= 0) {
                        dKey = dKey.replace(deprecatedMark, "")
                    }
                    if (oldData[lang][dKey] !== undefined) {
                        newData[lang][k] = oldData[lang][dKey]
                    }
                })
                Object.keys(oldData[lang]).forEach(k => {
                    if (newData[lang][k] === undefined) {
                        if (k.indexOf(deprecatedMark) < 0) {
                            if(noAddDeprecatedLangs && noAddDeprecatedLangs.indexOf(lang) < 0) {
                                const dKey = k + deprecatedMark
                                // mark an old item as deprecated
                                newData[lang][dKey] = oldData[lang][k]
                            }
                        } else {
                            // a marked deprecated
                            const dKey = k.replace(deprecatedMark, "")
                            if (newData[lang][dKey] === undefined) {
                                // not reused item, keep deprecated mark
                                newData[lang][k] = oldData[lang][k]
                            } else {
                                // reused, ignore the old deprecated mark item
                            }
                        }
                    }
                })
            }
        });

        fs.writeFileSync(filePath, JSON.stringify(sortObjectByKey(newData), null, 4), {
            flag: "w"
        });
    } catch (error) {
        fs.writeFileSync(filePath, JSON.stringify(sortObjectByKey(data), null, 4), {
            flag: "wx"
        })
    }

    return filePath;
}


module.exports = {
    removeComments,
    generateContent,
    importlang,
    insertScript,
    getFileName,
    writeDataToFile,
    getObjValue,
    transChineseS2T,
}
