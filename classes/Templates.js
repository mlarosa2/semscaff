const Utilities = require('./Utils.js');

class Templates {
    constructor() {}

    static directiveTemplate(vizName) {
        return `(function () {
            'use strict';
            /**
             * @name ${Utilities.pascalToKebab(vizName)}
             * @desc directive for creating and visualizing a ${vizName} Chart
             */

            angular.module("app.${Utilities.pascalToKebab(vizName)}.directive", [])
                .directive("${vizName}", ${vizName});
            
            ${vizName}.$inject = ['VIZ_COLORS', 'dataService', 'messageService', 'pkqlService'];

            function ${vizName}(VIZ_COLORS, dataService, messageService, pkqlService) {
                ${vizName}Link.$inject = ['scope', 'ele', 'attrs', 'ctrl'];
                ${vizName}Ctrl.$inject = ['$scope'];
                return {
                    restrict: 'E',
                    require: [],
                    priority: 300,
                    link: ${vizName}Link,
                    controller: ${vizName}Ctrl
                };

                function ${vizName}Link(scope, ele, attrs, ctrl) {
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

            function  ${vizName}Ctrl($scope) {}
        })();`;
    }
}

module.exports = Templates;