'use strict';

// Imports for polymer/pwa
import { LitElement, html } from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { connect } from 'pwa-helpers/connect-mixin';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from 'pwa-helpers/router';
import { updateMetadata } from 'pwa-helpers/metadata';

// Imports for this element
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import { menuIcon } from 'Shared/my-icons';
import 'SharedComponents/snack-bar/snack-bar';

import { printMe } from 'CoreComponents/print/print';

// CSS imports for this element
import { SharedStyles } from 'Shared/shared-styles';
import * as style from 'App/my-app.css';

// This element is connected to the Redux store.
import { store } from 'Core/store.js';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState,
  updateLayout
} from 'CoreActions/app.js';

class MyApp extends connect(store)(LitElement) {
  _render({appTitle, _page, _drawerOpened, _snackbarOpened, _offline}) {
    const helloWorld = html`
    ${SharedStyles}
    <style>${style.toString()}</style>
    <div class="hello">
      Hello ${appTitle}!<br>
      <button onclick="${printMe.bind(this)}">Click me and check the console!</button>
    </div>
    `;
    const template = html`
      <style>
        :host {
          --app-drawer-width: 256px;
          display: block;

          --app-primary-color: #4285f4;
          --app-secondary-color: black;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-light-text-color);
          --app-header-selected-color: var(--app-light-text-color);

          --app-drawer-background-color: var(--app-primary-color);
          --app-drawer-text-color: var(--app-dark-text-color);
          --app-drawer-selected-color: #78909C;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: var(--app-header-text-color);
          background-color: var(--app-primary-color);
        }

        .toolbar-top {
          background-color: var(--app-header-background-color);
        }

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
        }

        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .drawer {
          color: var(--app-drawer-text-color);
          background: var(--app-drawer-background-color);
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          min-height: 100vh;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          padding: 24px;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
        }

        /* Wide layout: when the viewport width is bigger than 640px, layout
        changes to a wide layout. */
        @media (min-width: 640px) {
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none;
          }

          .main-content {
            padding-top: 107px;
          }
        }
      </style>
      <app-drawer-layout fullbleed>
        <!-- Drawer content -->
        <app-drawer slot="drawer" class="drawer" opened="${_drawerOpened}" on-opened-changed="${e => store.dispatch(updateDrawerState(e.target.opened))}">
          <app-toolbar>Menu</app-toolbar>
          <nav class="drawer-list">
            <a selected?="${_page === 'view1'}" href="/view1">View One</a>
            <a selected?="${_page === 'view2'}" href="/view2">View Two</a>
          </nav>
        </app-drawer>

        <!-- Header content -->
        <app-header-layout has-scrolling-region>
          <app-header slot="header" condenses reveals effects="waterfall">
            <app-toolbar>
              <button class="menu-btn" title="Menu" on-click="${_ => store.dispatch(updateDrawerState(true))}">${menuIcon}</button>
              <div>${appTitle}</div>
            </app-toolbar>

            <!-- This gets hidden on a small screen-->
            <nav class="toolbar-list">
              <a selected?="${_page === 'view1'}" href="/view1">View One</a>
              <a selected?="${_page === 'view2'}" href="/view2">View Two</a>
            </nav>
          </app-header>

          <!-- Main content -->
          <main role="main" class="main-content">
            <my-view1 class="page" active?="${_page === 'view1'}"></my-view1>
            <my-view2 class="page" active?="${_page === 'view2'}"></my-view2>
            <my-view404 class="page" active?="${_page === 'view404'}"></my-view404>
          </main>

          <footer>
            <p>Made with &hearts; by the Polymer team.</p>
          </footer>

          <snack-bar active?="${_snackbarOpened}">
              You are now ${_offline ? 'offline' : 'online'}.</snack-bar>
        </app-header-layout>
      </app-drawer-layout>
    `;
    return template;
  }

  static get properties() {
    return {
      appTitle: String,
      _page: String,
      _drawerOpened: Boolean,
      _snackbarOpened: Boolean,
      _offline: Boolean
    }
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  _firstRendered() {
    installRouter((location) => {store.dispatch(navigate(window.decodeURIComponent(location.pathname)))});
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 640px)`,
        (matches) => store.dispatch(updateLayout(matches)));
  }

  _didRender(properties, changeList) {
    if ('_page' in changeList) {
      const pageTitle = properties.appTitle + ' - ' + changeList._page;
      updateMetadata({
          title: pageTitle,
          description: pageTitle
          // This object also takes an image property, that points to an img src.
      });
    }
  }

  _stateChanged(state) {
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._snackbarOpened = state.app.snackbarOpened;
    this._drawerOpened = state.app.drawerOpened;
  }
}

window.customElements.define('my-app', MyApp);
