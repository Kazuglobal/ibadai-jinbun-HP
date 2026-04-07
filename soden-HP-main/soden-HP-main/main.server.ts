import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';

import { AppComponent } from './src/app.component';
import { config } from './src/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
