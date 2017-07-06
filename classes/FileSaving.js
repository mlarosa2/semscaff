const fs = require('fs');
const Utilities = require('./Utils.js');

class FileSaving {
    constructor(config) {
        this.config = config
        this.vizName = config.name;
        this.asChart = `${this.vizName.toLowerCase().split('-')[0]}Chart`;
        this.directive;
    }

    buildDirective() {
        this.directive = 
            `(function () {
            'use strict';
            /**
             * @name ${Utilities.pascalToKebab(this.vizName)}
             * @desc directive for creating and visualizing a ${this.vizName} Chart
             */

            angular.module("app.${Utilities.pascalToKebab(this.vizName)}.directive", [])
                .directive("${this.vizName}", ${this.vizName});
            
            ${this.vizName}.$inject = ['VIZ_COLORS', 'dataService', 'messageService', 'pkqlService'];

            function ${this.vizName}(VIZ_COLORS, dataService, messageService, pkqlService) {
                ${this.vizName}Link.$inject = ['scope', 'ele', 'attrs', 'ctrl'];
                ${this.vizName}Ctrl.$inject = ['$scope'];
                return {
                    restrict: 'E',
                    require: [],
                    priority: 300,
                    link: ${this.vizName}Link,
                    controller: ${this.vizName}Ctrl
                };

                function ${this.vizName}Link(scope, ele, attrs, ctrl) {
                    scope.chartDiv = d3.select(ele[0].firstElementChild);
                   
                    /****************Main Event Listeners*************************/
                    var resizeListener = messageService.register('resize-viz', resizeViz);
                    var updateListener = messageService.register('update-visualization', initialize);

                    initialize();

                    function initialize {
                        var currentWidget = dataService.getWidgetData();
                        var localChartData = JSON.parse(JSON.stringify(currentWidget.data.chartData));
                        localChartData.uiOptions = dataService.getState(localChartData.layout);

                        //return and alert the user if no data exists
                        if (!localChartData.viewData) {
                            console.log("No data returned from the backend");
                            return;
                        }

                        dataService.visualLoaded();
                    }


                    function resizeViz() {

                    }

                    function applyAllEdits() {
                        scope.chartCtrl.editMode.applyAllEdits();
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

            function  ${this.vizName}Ctrl($scope) {}
        })();`;
    }

    save() {
       fs.writeFile('config.json', JSON.stringify(this.config, null, '\t'), (err) => {
            if (err) {
                throw err;
            }
            console.log('Widget configuration has been created.');
        }); 

        fs.writeFile(`${Utilities.pascalToKebab(this.vizName)}.directive.js`, this.directive, (err) => {
            if (err) {
                throw err;
            }
            console.log(`${Utilities.pascalToKebab(this.vizName)}.directive.js has been created.`);
        });
    }
}

module.exports = FileSaving;