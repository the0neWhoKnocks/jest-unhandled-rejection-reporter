const assert = require('assert');
const { promisify } = require('util');
const { exec } = require('child_process');
const execPromise = promisify(exec);

async function testTheThings() {
  console.log('[TESTS] Started\n');
  
  // NOTE - This will always fail, that's the point
  try {
    await execPromise('cd tests && jest -i --config ./jest.config.js', { shell: true });
  }
  catch({ stderr }){
    // Everything after "Ran all test suites." should be the error messaging.
    let endFound = false;
    const errors = stderr.split('\n').reduce((result, currVal) => {
      const reduced = (endFound) ? `${result}\n${currVal}` : '';
      if(currVal.includes('Ran all test suites.')) endFound = true;
      return reduced;
    }).trim();
    const errMsgGroups = errors
      // strip out Ansi color codes
      .replace(/\u001b\[.*?m/g, '')
      // break the errors up into easily testable groups
      .split(/\n\n/g);
    
    // console.log(errors);
    // console.log(errMsgGroups);
    
    // There should be errors present
    assert(errors);
    // The first line should be the errors header
    assert(errMsgGroups[0] === '[ERROR] Unhandled Rejection(s) Detected');
    // Iterate over the errors and assert order based on first error message.
    // Doing this ensures no buggy behavior like CI choosing to start the test
    // run with a different file than on local.
    for(let i=1; i<errMsgGroups.length; i++){
      const lines = errMsgGroups[i].split('\n');
      
      if(lines[0].includes('Unused rejected promise')){
        assert(lines[0] === '(1) [Error Message] Unused rejected promise');
        assert(lines[1].match(/\[File\] \/.*\/tests\/src\/unused-variable\.test\.js/));
      }
      else {
        assert(lines[0] === '(1) [No Error Message Emitted]');
        assert(lines[1] === '(2) [Error Message] failed promise');
        assert(lines[2].match(/\[File\] \/.*\/tests\/src\/uncaught-promise\.test\.js/));
      }
    }
  }
  
  console.log('\n[TESTS] Ended');
}

testTheThings();