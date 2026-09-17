import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, appConfig);
export default bootstrap;
