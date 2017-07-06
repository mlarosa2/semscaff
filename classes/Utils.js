const process = require('process');

class Utilities {
    /**
     * @name toCamelCase
     * @param {string} vizName name of the visualization
     * @return {string}
     * @desc converts a string in kebab case to camel case
     */
    static toCamelCase(vizName) {
        vizName = vizName.toLowerCase().split("-");
        return vizName.map((word, idx) => {
            if (idx === 0) return word;
            word = word.split("");
            word[0] = word[0].toUpperCase();
            return word.join("");
        }).join("");
    }

    /**
     * @name createWidgetName
     * @param {string} vizName name of the visualization
     * @return {string}
     * @desc creates a widget name from kebab case to SEMOSS format
     */
    static createWidgetName(vizName) {
        const words = vizName.split("-").map( (word) => {
            word = word.split("");
            word[0] = word[0].toUpperCase();
            
            return word.join("");
        });

        return words.join(" ");
    }

    /**
     * @name getDir
     * @return {string}
     * @desc returns directory name
     */
    static getDir() {
        if (process.cwd().split('/').length === 1) {
            return process.cwd().split('\\')[process.cwd().split('\\').length - 1];
        } else {
            return process.cwd().split('/')[process.cwd().split('/').length - 1];
        }
    }

    /**
     * @name pascalToKebab
     * @desc takes a pascal case string and returns a lower kebab case string
     * @param {string} str
     * @return {string}
     */
    static pascalToKebab(str) {
        str = str.split("");
        return str.map((letter, idx) => {
            if (idx === 0) {
                return letter.toLowerCase();
            } else if (letter === letter.toUpperCase()) {
                return `-${letter.toLowerCase()}`;
            } else {
                return letter;
            }
        }).join("");
    }
}

module.exports = Utilities;