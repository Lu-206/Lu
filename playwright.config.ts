import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./e2e',fullyParallel:false,workers:1,timeout:45000,
  use:{baseURL:'http://127.0.0.1:5180',headless:true,launchOptions:{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--enable-unsafe-swiftshader']}},
  projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{viewport:{width:390,height:844}}}],
  webServer:[
    {command:'npm run dev:web -- --host 127.0.0.1 --port 5180 --strictPort',url:'http://127.0.0.1:5180',reuseExistingServer:!process.env.CI},
    {command:'npm run dev:api',url:'http://127.0.0.1:3001/api/health',reuseExistingServer:!process.env.CI},
  ],
});
