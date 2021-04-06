export function isFunction(fn) {
    const string = toString.call(fn);
    return (
        string === "[object Function]" ||
        (typeof fn === "function" && string !== "[object RegExp]") ||
        (typeof window !== "undefined" &&
            // IE8 and below
            (fn === window.setTimeout ||
                fn === window.alert ||
                fn === window.confirm ||
                fn === window.prompt))
    );
}
export function isFilter(dataArray, func) {
    if (!dataArray || dataArray.length === 0) {
        return null;
    }
    let result = [];
    for (let i = 0; i < dataArray.length; i++) {
        if (func && isFunction(func) && func(dataArray[i], i)) {
            result.push(dataArray[i]);
        }
    }
    return result.length === 1 ? result[0] : result;
}
const jsonC = {}.constructor,

    isJSON = function(json) {
        return Boolean(json && json.constructor === jsonC);
    };

export function mergeJSON(json1, json2) {
    let result = null;
    if (isJSON(json2)) {
        result = {};
        if (isJSON(json1)) {
            for (let key in json1) {
                if (!Object.prototype.hasOwnProperty.call(json1, key)) {
                    continue;
                }
                result[key] = json1[key];
            }
        }
        for (let key in json2) {
            if (!Object.prototype.hasOwnProperty.call(json2, key)) {
                continue;
            }
            if (typeof result[key] === "object" && typeof json2 === "object") {
                result[key] = mergeJSON(result[key], json2[key]);
            } else {
                result[key] = json2[key];
            }
        }
    } else if (Array.isArray(json1) && Array.isArray(json2)) {
        result = json1;
        for (let i = 0; i < json2.length; i++) {
            if (result.indexOf(json2[i]) === -1) {
                result[result.length] = json2[i];
            }
        }
    } else {
        result = json2;
    }
    return result;
}
