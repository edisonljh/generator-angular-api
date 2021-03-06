'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

let files = [
  'tslint.json',
  'tsconfig.json',
  'README.md',
  'protractor.conf.js',
  'package.json',
  'karma.conf.js',
  '.gitignore',
  'gulpfile.js',
  '.editorconfig',
  '.angular-cli.json',
  'e2e',
  'server',
  'client/index.html',
  'client/styles.css',
  'client/dist/index.html',
  'client/app/app.module.ts',
  'client/assets/.gitkeep'
]

let prompts = []
let icons = ['None', 'Fontawesome', 'Feather']
let styles = ['None', 'Angular Material', 'Bootstrap', 'Bulma']
for (let f of styles) {
  for (let i of icons) {
    prompts.push({
      style: f,
      icon: i
    })
  }
}

for (let p of prompts) {
  describe('generator-angular-api:app Front-end: ' + p.style + ', Icon: ' + p.icon, () => {
    beforeAll(() => {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          name: 'name',
          description: 'description',
          style: p.style,
          icon: p.icon
        });
    });

    it('create files', () => {
      assert.file(files);
    });

    it('check configs', () => {
      assert.file(['.gitignore']);
      assert.noFileContent('.angular-cli.json', /"name": "<%= name %>"/);
      if (p.style === 'Angular Material') {
        assert.fileContent('client/main.ts', /import 'hammerjs';/);
        assert.fileContent('client/styles.css', /@import '~@angular\/material\/prebuilt-themes\/deeppurple-amber\.css';/);
      } else if (p.style === 'Bootstrap') {
        assert.noFileContent('client/main.ts', /import 'hammerjs';/);
        assert.fileContent('.angular-cli.json', /"\.\.\/node_modules\/bootstrap\/dist\/css\/bootstrap\.min\.css"/);
        assert.fileContent('.angular-cli.json', /"\.\.\/node_modules\/jquery\/dist\/jquery\.min\.js"/);
        assert.fileContent('.angular-cli.json', /"\.\.\/node_modules\/bootstrap\/dist\/js\/bootstrap\.bundle\.min\.js"/);
      } else if (p.style === 'Bulma') {
        assert.noFileContent('client/main.ts', /import 'hammerjs';/);
        assert.file(['client/assets/made-with-bulma.png']);
        assert.fileContent('.angular-cli.json', /"\.\.\/node_modules\/bulma\/css\/bulma\.css"/);
      } else {
        assert.noFileContent('client/main.ts', /import 'hammerjs';/);
        assert.fileContent('.angular-cli.json', /"styles\.css"/);
      }
    });

    it('check icons', () => {
      if (p.icon === 'Fontawesome') {
        assert.noFileContent('client/index.html', /feather\.replace()/);
        assert.fileContent('.angular-cli.json', /"\.\.\/node_modules\/font-awesome\/css\/font-awesome\.min\.css"/);
      } else if (p.icon === 'Feather') {
        assert.fileContent('client/index.html', /feather\.replace()/);
        assert.fileContent('.angular-cli.json', /"\.\.\/node_modules\/feather-icons\/dist\/feather\.min\.js"/);
      } else {
        assert.noFileContent('client/index.html', /feather\.replace()/);
        assert.noFileContent('.angular-cli.json', /"\.\.\/node_modules\/feather-icons\/dist\/feather\.min\.js"/);
        assert.noFileContent('.angular-cli.json', /"\.\.\/node_modules\/font-awesome\/css\/font-awesome\.min\.css"/);
        assert.fileContent('.angular-cli.json', /"styles\.css"/);
      }
    });

  });
}
