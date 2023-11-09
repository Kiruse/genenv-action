const core = require('@actions/core');
const fs   = require('fs');

try {
  const escape = (v) => v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const raw = core.getMultilineInput('env', { required: true });
  const lines = raw.trim().split('\n');
  const vars = lines.map(line => line.trim().split('=').map(s => s.trim()));
  fs.writeFileSync('.env', vars.map(([k, v]) => `${k}='${escape(v)}'`).join('\n'));
} catch (err) {
  core.setFailed(err.message);
}
