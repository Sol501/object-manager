import { NgModule, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { authInterceptor } from './core/auth/auth.interceptor';
import { initializeAuth } from './core/auth/auth.initializer';
import { AuthEffects } from './core/auth/state/auth.effects';
import { authFeatureKey, authReducer } from './core/auth/state/auth.reducer';
import { mockApiInterceptor } from './core/mock-api/mock-api.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ [authFeatureKey]: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor, mockApiInterceptor])),
    provideAppInitializer(initializeAuth),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
