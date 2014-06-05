
/*
 * Atom uses the Jasmine JavaScript testing framework.
 * More information here: http://jasmine.github.io/
 *
 * To directly run the tests in this directory from Atom, press `cmd-alt-ctrl-p`.
 *
 * For more information:
 *   - https://atom.io/docs/latest/creating-a-package#writing-tests
 *   - https://atom.io/docs/latest/creating-a-package#running-tests
 */
'use strict';
var OpenLastProject;

OpenLastProject = require('../lib/open-last-project');

describe('OpenLastProject', function() {
  return describe('A suite', function() {
    return it('should spec with an expectation', function() {
      return expect(OpenLastProject).not.toBeNull();
    });
  });
});
