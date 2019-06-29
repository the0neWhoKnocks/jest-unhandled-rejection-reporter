const {
  appendFileSync,
  existsSync,
  readFileSync,
  unlinkSync,
} = require('fs');
const { resolve } = require('path');
const color = require('cli-color');

const LOG_FILE = resolve(__dirname, './unhandled.log');
const MISSING_ERROR = '[No Error Message Emitted]';
let errorCountInFile = 0;

// The only API reference I found https://medium.com/@colinwren/writing-a-jest-test-reporter-cb7c123ec211
class UnhandledRejectionReporter {
  constructor(globalConfig, options) {
    this.globalConfig = globalConfig;
    this.options = options;
  }
  
  logExists() {
    try { if (existsSync(LOG_FILE)) return true; }
    // No log created, everything is good.
    catch(e) { return false; }
  }
  
  getLogs() {
    if (this.logExists()) {
      const logs = readFileSync(LOG_FILE, 'utf8');
      return {
        lines: logs.split('\n').filter(Boolean),
        raw: logs,
      };
    }
    
    return {};
  }
  
  deleteLog(){
    if (this.logExists()) unlinkSync(LOG_FILE);
  }
  
  onRunStart() {
    this.deleteLog();
  }
  
  onTestResult({ path: testFile }) {
    const logs = this.getLogs();
    
    // Unfortunately this runs only after each full test file has run so I
    // can't get anymore granular that which test file is causing an issue. 
    if (logs.lines) {
      appendFileSync(LOG_FILE, `\n[File] ${testFile}`);
    }
  }

  onRunComplete() {
    const logs = this.getLogs();

    if (logs.raw) {
      this.deleteLog();
      process.stderr.write(
        '\n'
        + color.red(`[ERROR] Unhandled Rejection(s) Detected`)
        +`${color.redBright(logs.raw)}\n\n`
      );
      
      const { watch, watchAll } = this.globalConfig;
      // Only exit if not watching
      if(!watch && !watchAll) process.exit(1);
    }
  }
}

UnhandledRejectionReporter.rejectionHandler = (err) => {
  let msg = MISSING_ERROR;
  
  if(err){
    msg = '[Error Message] '
    msg += (typeof err === 'string')
      ? err
      : `${err.message}\n${err.stack}`;
  }
  
  errorCountInFile += 1;
  const nl = (errorCountInFile === 1) ? '\n\n' : '\n';
  appendFileSync(LOG_FILE, `${nl}(${errorCountInFile}) ${msg}`);
}

module.exports = UnhandledRejectionReporter;
