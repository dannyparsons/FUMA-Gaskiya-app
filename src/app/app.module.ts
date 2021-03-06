import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
//native components
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
// translation module
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
// app tabs
import { StartPage } from '../pages/start/start';
import { TabsPage } from '../pages/tabs/tabs';
import { AdminPage } from '../pages/tabs/admin/admin';
import { CollectPage } from '../pages/tabs/collect/collect';
import { HomePage } from '../pages/tabs/home/home';
import { ProfilePage } from '../pages/tabs/profile/profile';
import { ResearchPage } from '../pages/tabs/research/research';
// app pages
import { ResearchViewPage } from '../pages/research-view/research-view';
import { FormViewPage } from '../pages/form-view/form-view';
import { ProfileViewPage } from '../pages/profile-view/profile-view';
import { VegaLitePage } from '../pages/visualisations/vega-lite/vega-lite';
import { LeafletPage } from '../pages/visualisations/leaflet/leaflet';
import { PhotosPage } from '../pages/photos/photos';
//components
import { FormViewComponent } from '../components/form-view/form-view';
//providers
import { PouchdbProvider } from '../providers/pouchdb-provider';
import { KoboProvider } from '../providers/kobo-provider';

// needed to load translation from assets folder
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp,

    StartPage,
    TabsPage,
    AdminPage,
    CollectPage,
    HomePage,
    ProfilePage,
    ResearchPage,

    ResearchViewPage,
    FormViewPage,
    ProfileViewPage,
    VegaLitePage,
    LeafletPage,
    PhotosPage,
    FormViewComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    StartPage,
    TabsPage,
    AdminPage,
    CollectPage,
    HomePage,
    ProfilePage,
    ResearchPage,

    ResearchViewPage,
    ProfileViewPage,
    FormViewPage,
    VegaLitePage,
    LeafletPage,
    PhotosPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, PouchdbProvider, KoboProvider, Camera, StatusBar, SplashScreen]
})
export class AppModule { }
