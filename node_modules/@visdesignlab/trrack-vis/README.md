# trrack-vis Library

This library is intended to be used with trrack, a provenance tracking library, which can be found [here](https://github.com/visdesignlab/trrack). Trrack-vis can be used to visualize the non-linear provenance graph, as well as change nodes within the graph. Trrack-vis is designed to be highly customizable, allowing for the size and position of the graph to be customized, custom icons to be used in the graph, custom ways to visualize annotations, and the grouping of nodes.

Here are multiple [examples](https://github.com/visdesignlab/trrack-examples) using trrack and trrack-vis.

For documentation, see http://vdl.sci.utah.edu/trrack-examples/api/trrack-vis


## Installation

- NPM

```bash
npm install --save-dev @visdesignlab/trrack-vis
```

- Yarn

```bash
yarn add @visdesignlab/trrack-vis
```

## Development

### Clone the repository

```bash
git clone https://github.com/visdesignlab/trrack-vis.git
```

### Use npm commands

- `npm t`: Run test suite
- `npm start`: Run `npm run build` in watch mode
- `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
- `npm run test:prod`: Run linting and generate coverage
- `npm run build`: Generate bundles and typings, create docs
- `npm run lint`: Lints code
- `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

## Resources

Project created using [Typescript library starter](https://github.com/alexjoverm/typescript-library-starter) by [alexjoverm](https://github.com/alexjoverm/)

## Other provenance related projects

[More Examples](https://github.com/visdesignlab/trrack-examples) using provenance with typescript and d3. All of these examples utilize the trrack-vis library

[Intent System](https://github.com/visdesignlab/intent-system) is a tool for predicting user intent patterns when brushing in scatterplots. The intent system utilizes the provenance library to control all interaction, as well as the ProvVis library to visualize the resulting provenance graph.
