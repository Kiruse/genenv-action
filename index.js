const core = require('@actions/core');
const fs   = require('fs');

const split = (s) => s.split(/[,\n]+/).map(s => s.trim());

try {
  const escape = (v) => v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const varsEnv = Object.fromEntries(
    core.getMultilineInput('env')
      .map(line => line.trim().split('=').map(s => s.trim()))
  );

  const clone = split(core.getInput('clone'));
  const varsClone = Object.fromEntries(Object.entries(process.env).filter(([k]) => clone.includes(k)));

  core.getMultilineInput('env').map(line => line.trim().split('=').map(s => s.trim()))

  const vars = Object.assign(
    {},
    varsClone,
    varsEnv,
  );

  const required = split(core.getInput('require'));
  for (const requiredVar of required) {
    if (!vars[requiredVar] || vars[requiredVar].trim() === '') {
      throw new Error(`Required variable ${requiredVar} is not set`);
    }
  }

  fs.writeFileSync('.env', Object.entries(vars).map(([k, v]) => `${k}='${escape(v)}'`).join('\n'));
} catch (err) {
  core.setFailed(err.message);
}
