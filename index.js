const core = require('@actions/core');
const fs   = require('fs');

try {
  const escape = (v) => v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const lines = core.getMultilineInput('env', { required: true });
  const vars = lines.map(line => line.trim().split('=').map(s => s.trim()));

  const required = core.getInput('require').split(/[,\n]+/).map(s => s.trim());
  for (const requiredVar of required) {
    const found = vars.find(([k]) => k === requiredVar);
    if (!found || found[1].trim() === '') {
      core.setFailed(`Required variable ${requiredVar} is missing`);
      process.exit(1);
    }
  }

  fs.writeFileSync('.env', vars.map(([k, v]) => `${k}='${escape(v)}'`).join('\n'));
} catch (err) {
  core.setFailed(err.message);
}
