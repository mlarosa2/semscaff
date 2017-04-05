#!/usr/bin/env node

const rl      = require('readline-sync');
const fs      = require('fs');
const process = require('process');
rl.setDefaultOptions({ prompt: 'SEMOSS-Viz-Scaffold> '});
let vizName = "";
let dir = "" ;
let isJV;
let icon = "";
const dependencies = ["../bower_components/d3_v4/d3.min.js"];
let additionalTools;
let answer;
let removeDupes;
const configObj = {};
const tags = ["Visualization"];
const modes = ["default-mode"];
const fields = [];
const color = {};
const state = {};
const buildState = () => {
    while (true) {
        loopAnswer = rl.question('Add new state data: (press s to stop, press enter to add a new key/value pair) ');
        if (loopAnswer.trim().toLowerCase() === 's') {
            break;
        }

        let key = rl.question('Name of key: ');
        let val = rl.question('Value for key: ');

        state[key] = val;
    }
};

const buildFieldsAndColor = () => {
    while (true) {
        answer = rl.question('Add a field: (press s to stop adding fields, press enter to add a field) ');

        if (answer.trim().toLowerCase() === 's') {
            break;
        }
        let answer2;
        const fieldObj = {};

        answer2 = rl.question('Model: ');
        fieldObj.model = answer2.toLowerCase();

        answer2 = rl.question('Name: ');
        answer2 = answer2.toLowerCase();
        answer2 = answer2.split("");
        answer2[0] = answer2[0].toUpperCase();
        answer2 = answer2.join("");
        fieldObj.name = answer2;

        //start acceptable types
        fieldObj.acceptableTypes = [];
        answer2 = rl.question('Does this field accept string values? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y') {
            fieldObj.acceptableTypes.push("STRING");
        }

        answer2 = rl.question('Does this field accept numeric values? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
            fieldObj.acceptableTypes.push("NUMBER");
        }

        answer2 = rl.question('Does this field accept date values? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
            fieldObj.acceptableTypes.push("DATE");
        }
        
        answer2 = rl.question('Is this field optional? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
            fieldObj.optional = true;
        } else {
            fieldObj.optional = false;
        }

        answer2 = rl.question('Is this a multi-field? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
            fieldObj.multifield = true;
        } else {
            fieldObj.multifield = false;
        }

        fields.push(fieldObj);
        answer2 = rl.question('Does this field affect color? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
            color[fieldObj.model] = {
                multifield: fieldObj.multifield
            };
            let answer3 = rl.question('Does color depend on instances? (y/n) ', {limit: ['y','n']});
            if (answer3.toLowerCase() === 'y' || answer3.toLowerCase() === 'yes') {
                color[fieldObj.model].instances = true;
            } else {
                color[fieldObj.model].instances = false;
            }
        }
    }
};

const createWidgetName = (vizName) => {
    const words = vizName.split("-").map( (word) => {
        word = word.split("");
        word[0] = word[0].toUpperCase();
        
        return word.join("");
    });

    return words.join(" ");
};

const toCamelCase = (vizName) => {
    vizName = vizName.toLowerCase().split("-");
    return vizName.map((word, idx) => {
        if (idx === 0) return word;
        word = word.split("");
        word[0] = word[0].toUpperCase();
        return word.join("");
    }).join("");
}

const getDependencies = () => {
    while (true) {
        answer = rl.question('Path from bower_components: (press s to stop adding dependencies) ');
        if (answer.toLowerCase() === 's') {
            break
        }
        dependencies.push(`../bower_components/${answer}`);
    }
};

const buildConfigObj = () => {
    configObj.name = createWidgetName(vizName);
    configObj.icon = `widgets/${vizName}/${icon}.svg`;
    if (isJV) {
        tags.push('JVChart');
    }
    configObj.widgetList = {
        tags: tags
    };
    configObj.showOn = 'none';
    configObj.content = {
        template: {}
    };
    if (isJV) {
        configObj.content.template.name = `jv-viz ${vizName}`;
    } else {
        configObj.content.template.name = vizName;
    }
    configObj.content.template.files = [
        {
            serie: true,
            files: dependencies
        }
    ];
    if (isJV) {
        configObj.content.template.files.push({
            files: ["resources/js/jvCharts/jvcharts.min.js"]
        });
        configObj.content.template.files.push({
            files: [
                "standard/chart/chart.css",
                "resources/js/jvCharts/src/jv.css"
            ]
        });
    } else {
        configObj.content.template.files.push({
            files: [
                "standard/chart/chart.css"
            ]
        })
    }
    const semossFiles = [`standard/chart/chart.directive.js`];
    if (isJV) {
        semossFiles.push(`standard/jv-viz/jv-viz.directive.js`);
    }
    semossFiles.push(`widgets/${dir}/${vizName}.directive.js`);
    if (additionalTools) {
        semossFiles.push(`widgets/${dir}/${vizName}-tools.directive.js`);
    }
    configObj.content.template.files.push({
        files: semossFiles
    });

    configObj.display = {
        position: "inline"
    };

    configObj.visualization = {};
    configObj.visualization.visibleModes = modes;
    if (additionalTools) {
        configObj.visualization.tools = `${vizName}-tools`;
    }
    configObj.visualization.removeDuplicates = removeDupes;
    configObj.visualization.fields = fields;
    configObj.visualization.color = color;

    configObj.state = state;
}

if (process.cwd().split('/').length === 1) {
    dir = process.cwd().split('\\')[process.cwd().split('\\').length - 1];
} else {
    dir = process.cwd().split('/')[process.cwd().split('/').length - 1];
}

vizName = dir.toLowerCase();

icon = rl.question('Icon Name: ');
icon = icon.split('.svg')[0];


answer = rl.question('Is this a JV Chart? (y/n) ', {limit: ['y','n']});
if (answer.toLowerCase() === 'y') {
    isJV = true;
} else {
    isJV = false;
}

answer = rl.question('Does this visualization require libraries other than D3? (y/n) ', {limit: ['y','n']});
if (answer.toLowerCase() === 'y') {
    getDependencies();
}

answer = rl.question('Enable Edit Mode? (y/n) ', {limit: ['y','n']})
if (answer.toLowerCase() === 'y') {
    modes.push('edit-mode');
}

answer = rl.question('Enable Comment Mode? (y/n) ', {limit: ['y','n']});
if (answer.toLowerCase() === 'y') {
    modes.push('comment-mode');
}

answer = rl.question('Enable Brush Mode? (y/n) ', {limit: ['y','n']})
if (answer.toLowerCase() === 'y') {
    modes.push('brush-mode');
}


answer = rl.question('Does this visualization require additional tools? (y/n) ', {limit: ['y','n']})
if (answer.toLowerCase() === 'y') {
    additionalTools = true;
} else {
    additionalTools = false;
}

answer = rl.question('Do you want to remove duplicated data? (y/n) ', {limit: ['y','n']})
if (answer.toLowerCase() === 'y') {
    removeDupes = true;
} else {
    removeDupes = false;
}

console.log('Add fields for the visualization');

buildFieldsAndColor();

console.log('Configure Visualization State');

buildState();

buildConfigObj();

fs.writeFile('config.json', JSON.stringify(configObj, null, '\t'), (err) => {
    if (err) {
        throw err;
    }
    console.log('Widget configuration has been created.');
});

let directive;
const camelCaseViz = toCamelCase(vizName);
const asChart = `${vizName.toLowerCase().split('-')[0]}Chart`;

if (isJV) {
    directive = 
    `(function () {
    'use strict';
    /**
     * @name ${vizName}
     * @desc directive for creating and visualizing a ${createWidgetName(vizName)} Chart
     */

    angular.module("app.${vizName}.directive", [])
        .directive("${camelCaseViz}", ${camelCaseViz});
    
    ${camelCaseViz}.$inject = ['$compile', 'VIZ_COLORS', '$filter', 'dataService'];

    function ${camelCaseViz}($compile, VIZ_COLORS, $filter, dataService) {
        ${camelCaseViz}Link.$inject = ['scope', 'ele', 'attrs', 'ctrl'];
        ${camelCaseViz}Ctrl.$inject = ['$scope'];
        return {
            restrict: 'A',
            require: ['?chart', '?cleanChart'],
            priority: 300,
            link: ${camelCaseViz}Link,
            controller: ${camelCaseViz}Ctrl
        };

        function ${camelCaseViz}Link(scope, ele, attrs, ctrl) {
            scope.chartCtrl = ctrl[0] ? ctrl[0] : ctrl[1];

            /****************Data Functions*************************/
            scope.chartCtrl.dataProcessor = dataProcessor;
            /****************Tool Functions*************************/
            scope.chartCtrl.highlightSelectedItem = highlightSelectedItem;
            scope.chartCtrl.resizeViz = resizeViz;

            //declare and initialize local variables
            var ${asChart},
                uriData,
                html = '<div id=' + scope.chartCtrl.chartName + "-append-viz" + '><div id=' + scope.chartCtrl.chartName + '></div></div>';
            
            ele.append($compile(html)(scope));

            /****************Data Functions*************************/

            /**dataProcessor gets called from chart and is where the data manipulation happens for the viz
             *
             * @param newData
             */
            function dataProcessor(newData) {
                var localChartData = JSON.parse(JSON.stringify(newData));
                scope.chartCtrl.chartDiv.attr('class', 'chart-div absolute-size');

                //return and alert the user if no data exists
                if (!localChartData.viewData) {
                    console.log("No data returned from the backend");
                    return;
                }

                //uriData is used for related insights
                uriData = localChartData.data;

                //filter dataTable
                for (var k in localChartData.dataTableAlign) {
                    localChartData.dataTableAlign[k] = $filter("shortenAndReplaceUnderscores")(localChartData.dataTableAlign[k]);
                }

                var tipConfig = {
                    type: "simple"
                };

                //create jv chart object
                ${asChart} = new jvCharts({
                    type: "${vizName.toLowerCase().split('-')[0]}",
                    name: scope.chartCtrl.chartName,
                    options: localChartData.uiOptions,
                    chartDiv: scope.chartCtrl.chartDiv,
                    tipConfig: tipConfig,
                    localCallbackRelatedInsights: relatedInsights,
                    localCallbackRemoveHighlight: removeHighlight,
                    setData: {
                        data: localChartData.viewData,
                        dataTable: localChartData.dataTableAlign,
                        dataTableKeys: localChartData.dataTableKeys,
                        colors: VIZ_COLORS.COLOR_SEMOSS
                    },
                    paint: true
                });
                //save colors to state
                if (ctrl[0]) {
                    dataService.setState(localChartData.layout, { color: ${asChart}.data.color });
                }
                update();
            }

            /****************Update Functions*************************/
            function update() {
                scope.chartCtrl.jvChart = ${asChart};
            }

            function resizeViz() {
                ${asChart}.chartDiv = scope.chartCtrl.chartDiv;
                ${asChart}.${asChart}.paint(${asChart});
                scope.chartCtrl.initializeModes();
            }

            function relatedInsights() {}

            /****************Tool Functions*************************/
            function highlightSelectedItem(selectedItems) {}

            function removeHighlight() {}

            //when directive ends, make sure to clean out excess listeners and dom elements outside of the scope
            scope.$on("$destroy", function () {

            });
        }
    } 

    function  ${camelCaseViz}Ctrl($scope) {}

})();`;
} else {
    directive = 
    `(function () {
    'use strict';
    /**
     * @name ${vizName}
     * @desc directive for creating and visualizing a ${createWidgetName(vizName)} Chart
     */

    angular.module("app.${vizName}.directive", [])
        .directive("${camelCaseViz}", ${camelCaseViz});
    
    ${camelCaseViz}.$inject = ['$filter'];

    function ${camelCaseViz}($filter) {
        ${camelCaseViz}Link.$inject = ['scope', 'ele', 'attrs', 'ctrl'];

        return {
            restrict: 'A',
            require: ['chart'],
            priority: 300,
            link: ${camelCaseViz}Link
        };

        function ${camelCaseViz}Link(scope, ele, attrs, ctrl) {
            scope.chartCtrl = ctrl[0];

            var html = '<div style="overflow:hidden" class="append-viz" id=' + scope.chartCtrl.chartName + "-append-viz" + '><div class="absolute-size" id=' + scope.chartCtrl.chartName + '></div></div>';
            ele.append(html);

            scope.chartCtrl.dataProcessor = function (data) {};
            scope.chartCtrl.highlightSelectedItem = function (selectedItem) {};
            scope.chartCtrl.resizeViz = function () {};

            function update(updateData) {}

            //clean up
            scope.$on('$destroy', function () {

            });
        }
    }
})();`;
}

fs.writeFile(`${vizName}.directive.js`, directive, (err) => {
    if (err) {
        throw err;
    }
    console.log(`${vizName}.directive.js has been created.`);
});

if (additionalTools) {
    let toolsDirective = 
    `(function () {
    'use strict';

    /**
     * @name ${vizName}
     * @desc ${createWidgetName(vizName)} additional tools
     */

    angular.module('app.${vizName}-tools.directive', [])
        .directive('${camelCaseViz}Tools', ${camelCaseViz}Tools);
    
    ${camelCaseViz}Tools.$inject = [];

    function ${camelCaseViz}Tools() {
        ${camelCaseViz}ToolsCtrl.$inject = ['$rootScope', '$scope', 'dataService'];
        ${camelCaseViz}ToolsLink.$inject = ['scope', 'ele', 'attrs', 'ctrl'];

        return {
            restrict: 'EA',
            scope: {},
            require: ['^toolPanel'],
            controllerAs: '${camelCaseViz}Tools',
            bindToController: {},
            templateUrl: 'widgets/${dir}/${vizName}-tools.directive.html',
            controller: ${camelCaseViz}ToolsCtrl,
            link: ${camelCaseViz}ToolsLink
        };

        function ${camelCaseViz}ToolsCtrl($rootScope, $scope, dataService) {
            var ${camelCaseViz}Tools = this;

            ${camelCaseViz}Tools.updateVisualization = updateVisualization;

            /**
             * @name updateVisualization
             * @desc generic function that requires the fn passed in to be a function in the directive
             */
            function updateVisualization(fn, data) {
                $scope.toolPanelCtrl.updateState(fn, data);
                $scope.toolPanelCtrl.runState();
            }
        }

        function ${camelCaseViz}ToolsLink(scope, ele, attrs, ctrl) {
            //declare/initialize scope variables
            scope.toolPanelCtrl = ctrl[0];
        }
    }
})();`;
    fs.writeFile(`${vizName}-tools.directive.js`, toolsDirective, (err) => {
        if (err) {
            throw err;
        } 
        console.log(`${vizName}-tools.directive.js has been created.`);
    });
    let toolsHTML = 
    `<div class="grid12">

</div>`;
    fs.writeFile(`${vizName}-tools.directive.html`, toolsHTML, (err) => {
        if (err) {
            throw err;
        }
        console.log(`${vizName}-tools.directive.html has been created.`);
    });
}
