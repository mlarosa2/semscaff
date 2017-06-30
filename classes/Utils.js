const process = require('process');

class Utilities {
    /**
     * @name toCamelCase
     * @param {string} vizName name of the visualization
     * @return {string}
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
     */
    static createWidgetName(vizName) {
        const words = vizName.split("-").map( (word) => {
            word = word.split("");
            word[0] = word[0].toUpperCase();
            
            return word.join("");
        });

        return words.join(" ");
    }

    static getDir() {
        if (process.cwd().split('/').length === 1) {
            return process.cwd().split('\\')[process.cwd().split('\\').length - 1];
        } else {
            return process.cwd().split('/')[process.cwd().split('/').length - 1];
        }
    }
}