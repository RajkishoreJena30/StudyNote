// Scaffolds a new TCP microservice with the repo's feature-folder structure.
// Usage: npm run new:service <service-name>
//   e.g. npm run new:service notification-service
//
// It runs the Nest CLI to generate the app, deletes the root-level
// controller/service the app schematic creates, then generates the feature
// module/controller/service inside a <feature>/ subfolder (matching the other
// services). You still apply the manual edits from docs/ADD-NEW-SERVICE.md.

import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';

const svc = process.argv[2];

if (!svc || !/^[a-z][a-z0-9-]*$/.test(svc)) {
  console.error(
    'Usage: npm run new:service <service-name>\n' +
      'Example: npm run new:service notification-service\n' +
      'Name must be kebab-case (letters, digits, dashes).',
  );
  process.exit(1);
}

// Feature folder name: drop a trailing "-service" (report-service -> report).
const feature = svc.replace(/-service$/, '');

const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

// 1. Scaffold the app (also registers it in nest-cli.json).
run(`npx nest g app ${svc}`);

// 2. Remove the root-level controller/service boilerplate.
for (const f of [
  `apps/${svc}/src/${svc}.controller.ts`,
  `apps/${svc}/src/${svc}.controller.spec.ts`,
  `apps/${svc}/src/${svc}.service.ts`,
]) {
  rmSync(f, { force: true });
}

// 3. Generate the feature module/controller/service in a subfolder.
run(`npx nest g module ${feature} --project ${svc}`);
run(`npx nest g controller ${feature} --project ${svc} --no-spec`);
run(`npx nest g service ${feature} --project ${svc} --no-spec`);

console.log(
  `\nDone. Now apply the manual edits from docs/ADD-NEW-SERVICE.md ` +
    `(TCP main.ts, root module, feature files, Steps 2-8).`,
);
