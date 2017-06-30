const rl            = require('readline-sync');
const VizBuilder    = require('./VizBuilder.js');
const WidgetBuilder = require('./DefaultWidgetBuilder.js');

class Main {
    constructor(clArg) {
        this.clArg = clArg;
    }

    /**
     * @name initialize
     * @desc parses arguments and intializes the appropriate class
     */
    initialize() {
        const answer;
        const acceptableVizArgs = ['viz', 'visual', 'visualization', 'visualize', 'vis'];
        const acceptableDWArgs  = ['default', 'widget', 'dw', 'default-widget'];
        if (!!this.clArg) {
            if (acceptableVizArgs.include(this.clArg)) {
                initViz();
            } else if (acceptableDWArgs.include(this.clArg)) {
                initWidget();
            } else {
                answer = rl.question(`Sorry, ${this.clArg} is not an understood command. Enter visualization to create a visualization, default to create a default-widget, or quit to exit the program.`);
                this.vizWidgetOrQuit(answer);
            }
        } else {
            answer = rl.question('Enter visualization to create a visualization, default to create a default-widget, or quit to exit the program.');
            this.vizWidgetOrQuit(answer);
        }
    }

    /**
     * @name vizWidgetOrQuit
     * @param {string} answer result from question
     * @desc starts a command line loop to find out if the program should create a visualization,
     *       a widget, or quit
     */
    vizWidgetOrQuit(answer) {
        if (answer === 'visualization') {
            initViz();
        } else if (answer === 'default') {
            initWidget();
        } else if (answer === 'quit') {
            this.initialize();
        }
    }

    /**
     * @name initViz
     * @desc instantiates and initializes a new VizBuilder
     */
    initViz() {
        const viz = new VizBuilder();
        viz.initialize();
    }

    /**
     * @name initWidget
     * @desc instantiates and initializes a new WidgetBuilder
     */
    initWidget() {
        const widget = new WidgetBuilder();
        widget.initialize();
    }
}