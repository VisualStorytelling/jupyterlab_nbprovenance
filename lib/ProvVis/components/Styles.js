"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typestyle_1 = require("typestyle");
exports.treeColor = (current) => {
    return typestyle_1.style({
        fill: current ? 'rgb(33, 133, 208)' : 'white',
        stroke: 'rgb(33, 133, 208)'
    });
};
//# sourceMappingURL=Styles.js.map