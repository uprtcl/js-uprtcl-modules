import 'reflect-metadata';
import { Logger, MicroModule } from '@uprtcl/micro-orchestrator';
import { css, html, LitElement, property, query } from 'lit-element';

const CommonUIBindings = {};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

const styles = css `
  .button-text {
    font-family: 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    text-decoration: none;
    text-transform: uppercase;
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    font-stretch: 100%;
    letter-spacing: 1.25px;
    user-select: none;
  }
  .button-filled {
    background-color: var(--background-color, #2196f3);
    color: #ffffff;
  }
  .button-filled svg {
    fill: white;
  }
  .button-filled:hover {
    background-color: var(--background-color-hover, #50b0ff);
  }
  .button-filled-secondary {
    background-color: var(--background-color, #c9d4db);
    color: #ffffff;
  }
  .button-filled-secondary-no-hover {
    background-color: var(--background-color, #c9d4db);
    color: #ffffff;
  }
  .button-filled-secondary-no-hover svg {
    fill: white;
  }
  .button-filled-secondary svg {
    fill: white;
  }
  .button-filled-secondary:hover {
    background-color: #89b7da;
  }
  .button-disabled {
    background-color: #bbd6ec;
    color: #ffffff;
  }
  .button-disabled svg {
    fill: white;
  }
  .button-skinny {
    background-color: transparent;
    color: #2196f3;
  }
  .button-skinny svg {
    fill: #2196f3;
  }
  .button-skinny:hover {
    color: #50b0ff;
    background-color: #eef7ff;
  }
  .cursor {
    cursor: pointer;
  }
  .bg-transition {
    transition: background-color 0.5s ease;
  }
`;

const icons = {
    bold: html `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H8c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h5.78c2.07 0 3.96-1.69 3.97-3.77.01-1.53-.85-2.84-2.15-3.44zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
      />
    </svg>
  `,
    em: html `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M10 5.5c0 .83.67 1.5 1.5 1.5h.71l-3.42 8H7.5c-.83 0-1.5.67-1.5 1.5S6.67 18 7.5 18h5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-.71l3.42-8h1.29c.83 0 1.5-.67 1.5-1.5S17.33 4 16.5 4h-5c-.83 0-1.5.67-1.5 1.5z"
      />
    </svg>
  `,
    link: html `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M3.96 11.38C4.24 9.91 5.62 8.9 7.12 8.9h2.93c.52 0 .95-.43.95-.95S10.57 7 10.05 7H7.22c-2.61 0-4.94 1.91-5.19 4.51C1.74 14.49 4.08 17 7 17h3.05c.52 0 .95-.43.95-.95s-.43-.95-.95-.95H7c-1.91 0-3.42-1.74-3.04-3.72zM9 13h6c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1s.45 1 1 1zm7.78-6h-2.83c-.52 0-.95.43-.95.95s.43.95.95.95h2.93c1.5 0 2.88 1.01 3.16 2.48.38 1.98-1.13 3.72-3.04 3.72h-3.05c-.52 0-.95.43-.95.95s.43.95.95.95H17c2.92 0 5.26-2.51 4.98-5.49-.25-2.6-2.59-4.51-5.2-4.51z"
      />
    </svg>
  `,
    check: html `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"
      />
    </svg>
  `,
    cross: html `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path
        d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
      />
    </svg>
  `,
    hourglass_empty: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"
      />
    </svg>
  `,
    arrow_left: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M14 7l-5 5 5 5V7z" />
      <path d="M24 0v24H0V0h24z" fill="none" />
    </svg>
  `,
    arrow_right: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M10 17l5-5-5-5v10z" />
      <path d="M0 24V0h24v24H0z" fill="none" />
    </svg>
  `,
    arrow_drop_down: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M7 10l5 5 5-5z" />
    </svg>
  `,
    arrow_back: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  `,
    arrow_forward: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </svg>
  `,
    arrow_upward: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="24px"
      height="24px"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
    </svg>
  `,
    arrow_downward: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="24px"
      height="24px"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
    </svg>
  `,
    info: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
      />
    </svg>
  `,
    add: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  `,
    add_box: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
      />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  `,
    subdirectory: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="24px"
      height="24px"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z" />
    </svg>
  `,
    delete: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="24px"
      height="24px"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  `,
    settings: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <g>
        <path d="M0,0h24v24H0V0z" fill="none" />
        <path
          d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
        />
      </g>
    </svg>
  `,
    edit: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  `,
    image: html `
    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M16.5,16.25C16.5,14.75 13.5,14 12,14C10.5,14 7.5,14.75 7.5,16.25V17H16.5M12,12.25A2.25,2.25 0 0,0 14.25,10A2.25,2.25 0 0,0 12,7.75A2.25,2.25 0 0,0 9.75,10A2.25,2.25 0 0,0 12,12.25Z"
      />
    </svg>
  `,
    youtube: html `
    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"
      />
    </svg>
  `,
    code: html `
    <svg xmlns="http://www.w3.org/2000/svg" width="18px" viewBox="0 0 24 24" height="18px">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
      />
    </svg>
  `,
    account_box: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"
      />
    </svg>
  `,
    call_split: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"
      />
    </svg>
  `,
    call_merge: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M17 20.41L18.41 19 15 15.59 13.59 17 17 20.41zM7.5 8H11v5.59L5.59 19 7 20.41l6-6V8h3.5L12 3.5 7.5 8z"
      />
    </svg>
  `,
    add_circle_outline: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      />
    </svg>
  `,
    help_outline: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
      />
    </svg>
  `,
    more_vert: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      />
    </svg>
  `,
    arrow_back_ios: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="-2 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
    </svg>
  `,
    clear: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      />
    </svg>
  `,
    cached: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"
      />
    </svg>
  `,
    done: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </svg>
  `,
    menu: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  `,
    menu_open: html `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="24" height="24">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5L21 15.59z"
      />
    </svg>
  `,
    menu_open_180: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      transform="rotate(180)"
      fill="black"
      width="24"
      height="24"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5L21 15.59z"
      />
    </svg>
  `,
    unarchive: html `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <g><rect fill="none" height="24" width="24" x="0" /></g>
      <g>
        <g>
          <g>
            <path
              d="M20.55,5.22l-1.39-1.68C18.88,3.21,18.47,3,18,3H6C5.53,3,5.12,3.21,4.85,3.55L3.46,5.22C3.17,5.57,3,6.01,3,6.5V19 c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6.01,20.83,5.57,20.55,5.22z M12,9.5l5.5,5.5H14v2h-4v-2H6.5L12,9.5z M5.12,5 l0.82-1h12l0.93,1H5.12z"
            />
          </g>
        </g>
      </g>
    </svg>
  `,
    play_for_work: html `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M11 5v5.59H7.5l4.5 4.5 4.5-4.5H13V5h-2zm-5 9c0 3.31 2.69 6 6 6s6-2.69 6-6h-2c0 2.21-1.79 4-4 4s-4-1.79-4-4H6z"
      />
    </svg>
  `,
    loading: html `
    <svg
      version="1.1"
      id="L9"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enable-background="new 0 0 0 0"
      xml:space="preserve"
    >
      <path
        d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="1s"
          from="0 50 50"
          to="360 50 50"
          repeatCount="indefinite"
        ></animateTransform>
      </path>
    </svg>
  `
};

class UprtclButton extends LitElement {
    constructor() {
        super(...arguments);
        this.transition = false;
        this.disabled = false;
        this.skinny = false;
        this.raised = false;
    }
    /** Seems I cant prevent the click event from being emitted outside of this element  */
    render() {
        let classes = ['button-layout', 'button-text'];
        if (this.disabled) {
            classes.push('button-disabled');
        }
        else {
            classes.push('cursor');
            if (this.skinny) {
                classes.push('button-skinny');
            }
            else {
                classes.push('button-filled');
            }
            if (this.raised) {
                classes.push('button-raised');
            }
            if (this.transition) {
                classes.push('bg-transition');
            }
        }
        return html `
      <div class=${classes.join(' ')}>
        ${this.icon
            ? html `
              <div class="icon-container">${icons[this.icon]}</div>
            `
            : ''}

        <slot></slot>
      </div>
    `;
    }
    static get styles() {
        return [
            styles,
            css `
        :host {
          width: initial;
          display: block;
        }
        .button-layout {
          border-radius: 4px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          line-height: 36px;
          height: 36px;
          padding: 0px 16px;
        }
        .icon-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-right: 10px;
        }
      `
        ];
    }
}
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclButton.prototype, "icon", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclButton.prototype, "transition", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclButton.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclButton.prototype, "skinny", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclButton.prototype, "raised", void 0);

class UprtclLoading extends LitElement {
    render() {
        return html `
      <div class="container">${icons.loading}<br /><slot></slot></div>
    `;
    }
    static get styles() {
        return [
            css `
        .container {
          height: var(--height, 40px);
          text-align: center;
        }
        svg {
          height: 100%;
          fill: var(--fill, #50b0ff);
        }
      `
        ];
    }
}

class UprtclList extends LitElement {
    render() {
        return html `<slot></slot>`;
    }
    static get styles() {
        return [styles, css ``];
    }
}

class UprtclListItem extends LitElement {
    constructor() {
        super(...arguments);
        this.selected = false;
        this.hasMeta = false;
    }
    render() {
        let classes = ['container'];
        if (this.selected)
            classes.push('selected');
        return html `
      <div class=${classes.join(' ')}>
        <div class="vertically-centered">
          ${this.icon
            ? html `
                <div class="icon-container">${icons[this.icon]}</div>
              `
            : ''}
          <div class="main-item"><slot></slot></div>
          ${this.hasMeta
            ? html `
                <div class="meta-item"><slot name="meta"></slot></div>
              `
            : ''}
        </div>
      </div>
    `;
    }
    static get styles() {
        return [
            css `
        :host {
          display: block;
        }
        .container:hover {
          background: #f1f1f1;
        }
        .selected {
          border-color: var(--selected-border-color, #2196f3);
          border-left-style: solid;
          border-right-style: solid;
          border-width: 3px;
        }
        .container {
          display: flex;
          height: 48px;
          flex-direction: column;
          justify-content: center;
          cursor: pointer;
          transition: background-color 200ms linear;
          padding: var(--padding, 0px 12px);
        }
        .vertically-centered {
          display: flex;
          flex-direction: row;
        }
        .main-item {
          flex: 1 1 0;
          display: flex;
          flex-direction: row;
          margin-left: 6px;
          vertical-align: middle;
          line-height: 24px;
        }
        .meta-item {
          flex: 0 0 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .icon-container {
          height: 24px;
        }
        .icon-container svg {
          fill: #717377;
        }
      `
        ];
    }
}
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclListItem.prototype, "selected", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclListItem.prototype, "hasMeta", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclListItem.prototype, "icon", void 0);

class UprtclCard extends LitElement {
    render() {
        return html `<slot></slot>`;
    }
    static get styles() {
        return [
            css `
        :host {
          background-color: white;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
      `,
        ];
    }
}

class UprtclButtonLoading extends LitElement {
    constructor() {
        super(...arguments);
        this.loading = false;
        this.outlined = false;
        this.skinny = false;
        this.transition = false;
        this.disabled = false;
        this.icon = '';
    }
    render() {
        const loadingClasses = this.skinny ? ['loading-skinny'] : ['loading-filled'];
        loadingClasses.push('loading');
        return html `
      <uprtcl-button
        ?outlined=${this.outlined}
        ?transition=${this.transition}
        ?skinny=${this.skinny}
        ?disabled=${this.disabled}
        icon=${this.loading ? '' : this.icon}
      >
        ${this.loading
            ? html `
              <uprtcl-loading class=${loadingClasses.join(' ')}></uprtcl-loading>
            `
            : html `
              <slot></slot>
            `}
      </uprtcl-button>
    `;
    }
    static get styles() {
        return css `
      :host {
        display: block;
        width: fit-content;
      }
      .loading {
        --height: 36px;
      }
      .loading-filled {
        --fill: white;
      }
      .loading-skinny {
        --fill: #50b0ff;
      }
    `;
    }
}
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclButtonLoading.prototype, "loading", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclButtonLoading.prototype, "outlined", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclButtonLoading.prototype, "skinny", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclButtonLoading.prototype, "transition", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclButtonLoading.prototype, "disabled", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclButtonLoading.prototype, "icon", void 0);

class UprtclPopper extends LitElement {
    constructor() {
        super(...arguments);
        this.logger = new Logger('UPRTCL-POPPER');
        this.icon = 'more_vert';
        this.position = 'bottom-right';
        this.disableDropdown = false;
        this.showDropdown = false;
        this.handleDocClick = event => {
            const ix = event.composedPath().findIndex((el) => el.id === this.popperId);
            if (ix === -1) {
                this.showDropdown = false;
            }
        };
    }
    firstUpdated() {
        this.popperId = `popper-menu-${Math.floor(Math.random() * 1000000)}`;
        document.addEventListener('click', this.handleDocClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.handleDocClick);
    }
    showDropDownClicked(e) {
        if (!this.disableDropdown) {
            this.showDropdown = !this.showDropdown;
        }
    }
    updated(changedProperties) {
        /** use litelement update watcher to inform the world about the stati of the dropdown, this way
         * it works also if showDropdown is set from elsewhere
         */
        if (changedProperties.has('showDropdown')) {
            this.dispatchEvent(new CustomEvent('drop-down-changed', { detail: { shown: this.showDropdown } }));
        }
    }
    render() {
        const positions = {
            'bottom-left': 'info-box-bottom-left',
            'bottom-right': 'info-box-bottom-right',
            right: 'info-box-right'
        };
        let classes = [positions[this.position]];
        classes.push('info-box');
        return html `
      <div class="popper-container" id=${this.popperId}>
        <div class="popper-button" @click=${this.showDropDownClicked}>
          <slot name="icon">
            <uprtcl-icon-button button icon=${this.icon}></uprtcl-icon-button>
          </slot>
        </div>
        ${this.showDropdown
            ? html `
              <uprtcl-card class=${classes.join(' ')}>
                <slot></slot>
              </uprtcl-card>
            `
            : ''}
      </div>
    `;
    }
    static get styles() {
        return css `
      .popper-container {
        position: relative;
      }

      .info-box {
        color: rgba(0, 0, 0, 0.87);
        z-index: 20;
        position: absolute;
        width: var(--box-width, 'initial');
        min-width: var(--box-min-width, 200px);
        max-height: var(--max-height, initial);
        overflow: var(--overflow, 'visible');
        user-select: none;
      }
      .info-box-bottom-right {
        right: 0px;
        top: calc(100% + 5px);
      }
      .info-box-bottom-left {
        left: 0px;
        top: calc(100% + 5px);
      }
      .info-box-right {
        top: 5px;
        left: calc(100% + 5px);
      }
    `;
    }
}
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclPopper.prototype, "icon", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclPopper.prototype, "position", void 0);
__decorate([
    property({ type: Boolean, attribute: 'disable-dropdown' }),
    __metadata("design:type", Boolean)
], UprtclPopper.prototype, "disableDropdown", void 0);
__decorate([
    property({ attribute: false }),
    __metadata("design:type", Boolean)
], UprtclPopper.prototype, "showDropdown", void 0);
__decorate([
    property({ attribute: false }),
    __metadata("design:type", String)
], UprtclPopper.prototype, "popperId", void 0);

class UprtclOptionsMenu extends LitElement {
    constructor() {
        super(...arguments);
        this.config = {};
        this.icon = 'more_vert';
    }
    optionClicked(key, e) {
        e.stopPropagation();
        this.popper.showDropdown = false;
        this.dispatchEvent(new CustomEvent('option-click', {
            bubbles: true,
            composed: true,
            detail: {
                key: key
            }
        }));
    }
    render() {
        return html `
      <uprtcl-popper id="popper" icon=${this.icon}>
        <slot name="icon" slot="icon"
          ><uprtcl-icon-button icon=${this.icon} button></uprtcl-icon-button
        ></slot>
        <uprtcl-list>
          ${Object.keys(this.config).map(itemKey => {
            const item = this.config[itemKey];
            return item.disabled !== undefined && item.disabled
                ? html `
                  <uprtcl-list-item icon=${item.icon ? item.icon : ''} disabled>
                    <span>${item.text}</span>
                  </uprtcl-list-item>
                `
                : html `
                  <uprtcl-list-item
                    icon=${item.icon ? item.icon : ''}
                    @click=${e => this.optionClicked(itemKey, e)}
                  >
                    <span>${item.text}</span>
                  </uprtcl-list-item>
                `;
        })}
        </uprtcl-list>
      </uprtcl-popper>
    `;
    }
    static get styles() {
        return css ``;
    }
}
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], UprtclOptionsMenu.prototype, "config", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclOptionsMenu.prototype, "icon", void 0);
__decorate([
    query('#popper'),
    __metadata("design:type", UprtclPopper)
], UprtclOptionsMenu.prototype, "popper", void 0);

class UprtclDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.resolved = undefined;
        this.options = {};
    }
    optionClicked(e, option) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('option-selected', { detail: { option }, bubbles: true, composed: true }));
        if (this.resolved)
            this.resolved(option);
    }
    render() {
        const options = Object.getOwnPropertyNames(this.options).reverse();
        return html `
      <div class="modal">
        <div class="modal-content">
          <div class="slot-container">
            <slot></slot>
          </div>
          <div class="buttons-container">
            ${options.map(option => {
            const details = this.options[option];
            return html `
                <uprtcl-button
                  @click=${e => (details.disabled ? undefined : this.optionClicked(e, option))}
                  icon=${details.icon}
                  ?disabled=${details.disabled !== undefined ? details.disabled : false}
                  ?skinny=${details.skinny !== undefined ? details.skinny : false}
                  style=${details.background ? `--background-color: ${details.background}` : ''}
                >
                  ${this.options[option].text}
                </uprtcl-button>
              `;
        })}
          </div>
        </div>
      </div>
    `;
    }
    static get styles() {
        return css `
      .modal {
        position: fixed;
        z-index: 100;
        height: 100%;
        width: 100%;
        background-color: #b8b8b86d;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .modal-content {
        width: 90vw;
        max-width: 900px;
        margin: 0 auto;
        padding: 3vw 3vw;
        background-color: white;
        border-radius: 4px;
        box-shadow: 10px 10px 67px 0px rgba(0, 0, 0, 0.75);
      }

      .slot-container {
        margin-bottom: 3vw;
        max-height: calc(100vh - 200px);
        min-height: 50vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      .buttons-container {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        flex-direction: row;
      }
      .buttons-container uprtcl-button {
        width: 150px;
        margin-left: 12px;
      }
    `;
    }
}
__decorate([
    property({ attribute: false }),
    __metadata("design:type", Object)
], UprtclDialog.prototype, "resolved", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], UprtclDialog.prototype, "options", void 0);

class UprtclHelp extends LitElement {
    render() {
        return html `
      <uprtcl-popper id="popper" icon="help_outline">
        <div class="help-content">
          <slot></slot>
        </div>
        <uprtcl-button @click=${() => (this.popper.showDropdown = false)}>
          close
        </uprtcl-button>
      </uprtcl-popper>
    `;
    }
    static get styles() {
        return css `
      .help-content {
        padding: 32px 16px;
        color: #4e585c;
      }

      uprtcl-button {
        width: 100%;
      }

      uprtcl-popper {
        --box-with: 200px;
      }
    `;
    }
}
__decorate([
    query('#popper'),
    __metadata("design:type", UprtclPopper)
], UprtclHelp.prototype, "popper", void 0);

class UprtclFormString extends LitElement {
    constructor() {
        super(...arguments);
        this.fieldValue = '';
        this.fieldLabel = 'value';
        this.cancelIcon = 'clear';
        this.acceptIcon = 'done';
        this.loading = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.acceptClick();
            }
        });
        this.addEventListener('keyup', event => {
            if (event.key === 'Esc') {
                event.preventDefault();
                this.cancelClick();
            }
        });
    }
    firstUpdated() {
        setTimeout(() => this.newTitleEl.focus(), 50);
    }
    cancelClick() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }
    acceptClick() {
        this.dispatchEvent(new CustomEvent('accept', {
            detail: {
                value: this.newTitleEl.value
            }
        }));
    }
    render() {
        return html `
      <div class="form">
        <uprtcl-textfield skinny id="text-input" value=${this.fieldValue} label=${this.fieldLabel}>
        </uprtcl-textfield>

        <div class="icon-container">
          <uprtcl-icon-button icon=${this.cancelIcon} @click=${this.cancelClick} button>
          </uprtcl-icon-button>
        </div>

        <div class="icon-container">
          <uprtcl-icon-button
            @click=${this.acceptClick}
            icon=${this.loading ? 'loading' : this.acceptIcon}
            button
          ></uprtcl-icon-button>
        </div>
      </div>
    `;
    }
    static get styles() {
        return css `
      .form {
        display: flex;
        align-items: center;
      }
      .actions {
        margin-top: 16px;
      }
      uprtcl-textfield {
        margin-right: 8px;
      }
      .icon-container {
        margin-left: 8px;
        width: 48px;
        height: 48px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .actions uprtcl-button {
        width: 180px;
      }
    `;
    }
}
__decorate([
    property({ type: String, attribute: 'value' }),
    __metadata("design:type", String)
], UprtclFormString.prototype, "fieldValue", void 0);
__decorate([
    property({ type: String, attribute: 'label' }),
    __metadata("design:type", String)
], UprtclFormString.prototype, "fieldLabel", void 0);
__decorate([
    property({ type: String, attribute: 'cancel-icon' }),
    __metadata("design:type", String)
], UprtclFormString.prototype, "cancelIcon", void 0);
__decorate([
    property({ type: String, attribute: 'accept-icon' }),
    __metadata("design:type", String)
], UprtclFormString.prototype, "acceptIcon", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclFormString.prototype, "loading", void 0);
__decorate([
    query('#text-input'),
    __metadata("design:type", Object)
], UprtclFormString.prototype, "newTitleEl", void 0);

class UprtclListItemWithOption extends LitElement {
    constructor() {
        super(...arguments);
        this.text = '';
        this.selected = 'false';
        this.config = {};
    }
    elementClicked() {
        this.dispatchEvent(new CustomEvent('item-click', {
            bubbles: true,
            composed: true,
        }));
    }
    optionClicked(e) {
        this.dispatchEvent(new CustomEvent('option-click', {
            bubbles: true,
            composed: true,
            detail: {
                option: e.detail.key,
            },
        }));
    }
    render() {
        let classes = [];
        classes.push('item-row');
        if (this.selected === 'true')
            classes.push('item-selected');
        return html `
      <div class=${classes.join(' ')} @click=${this.elementClicked}>
        <div class="text-container">${this.text}</div>
        <uprtcl-options-menu
          @option-click=${this.optionClicked}
          .config=${this.config}
        ></uprtcl-options-menu>
      </div>
    `;
    }
    static get styles() {
        return css `
      :host {
        cursor: pointer;
      }

      uprtcl-icon {
        user-select: none;
      }

      .item-row {
        position: relative;
        width: 100%;
        display: flex;
        padding: 6px 0px;
        transition: all 0.1s ease-in;
      }

      .item-selected {
        background-color: rgb(200, 200, 200, 0.2);
      }

      .item-row:hover {
        background-color: #e8ecec;
      }

      .text-container {
        padding-left: 16px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
    `;
    }
}
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclListItemWithOption.prototype, "text", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclListItemWithOption.prototype, "selected", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], UprtclListItemWithOption.prototype, "config", void 0);

class UprtclIconButton extends LitElement {
    constructor() {
        super(...arguments);
        this.button = false;
        this.skinny = false;
        this.disabled = false;
        this.loading = false;
    }
    /** Seems I cant prevent the click event from being emitted outside of this element  */
    render() {
        const classes = ['icon-button-layout'];
        if (this.disabled) {
            classes.push('button-disabled');
        }
        else {
            if (this.button) {
                if (this.skinny) {
                    classes.push('button-skinny');
                }
                else {
                    classes.push('button-filled-secondary');
                }
                classes.push('cursor');
            }
            else {
                if (this.skinny) {
                    classes.push('button-skinny');
                }
                else {
                    classes.push('button-filled-secondary-no-hover');
                }
            }
        }
        return html `
      <div class=${classes.join(' ')}>
        ${this.loading ? icons.loading : icons[this.icon]}
      </div>
    `;
    }
    static get styles() {
        return [
            styles,
            css `
        :host {
          display: inline-block;
        }
        .icon-button-layout {
          width: 36px;
          height: 36px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `
        ];
    }
}
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclIconButton.prototype, "icon", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclIconButton.prototype, "button", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclIconButton.prototype, "skinny", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclIconButton.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclIconButton.prototype, "loading", void 0);

class UprtclTextField extends LitElement {
    constructor() {
        super(...arguments);
        this.label = 'label';
        this.value = '';
        this.focused = false;
    }
    focus() {
        if (!this.inputEl)
            return;
        this.inputEl.focus();
    }
    render() {
        return html `<div class="container">
      ${this.focused ? html `<div class="label">${this.label}</div>` : ''}
      <div class="input-container">
        <input
          id="input-element"
          value=${this.value}
          @focus=${() => (this.focused = true)}
          @blur=${() => (this.focused = false)}
          @input=${(e) => (this.value = e.target.value)}
          placeholder=${this.focused ? '' : this.label}
        />
      </div>
    </div>`;
    }
    static get styles() {
        return [
            css `
        :host {
          width: fit-content;
        }
        .container {
          position: relative;
        }
        .label {
          width: 100%;
          position: absolute;
          left: 10px;
          top: -8px;
          background-color: white;
          width: fit-content;
          padding: 0px 5px;
          font-size: 15px;
          color: #2196f3;
        }
        input {
          padding-top: 8px;
          padding-bottom: 8px;
          padding-left: 16px;
          padding-right: 16px;
          height: 30px;
          font-family: Roboto, sans-serif;
          font-size: 16px;
          font-stretch: 100%;
          outline-style: none;
          border-style: none;
          border-radius: 4px;
        }
        .input-container {
          caret-color: #2196f3;
          border-color: #2196f3 !important;
          border-radius: 4px;
          border-style: solid;
          border-width: 2px;
          width: fit-content;
        }
      `,
        ];
    }
}
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclTextField.prototype, "label", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclTextField.prototype, "value", void 0);
__decorate([
    property({ attribute: false }),
    __metadata("design:type", Boolean)
], UprtclTextField.prototype, "focused", void 0);
__decorate([
    query('#input-element'),
    __metadata("design:type", HTMLInputElement)
], UprtclTextField.prototype, "inputEl", void 0);

class UprtclSelect extends LitElement {
    render() {
        return html `<select
      ><slot></slot
    ></select>`;
    }
    static get styles() {
        return [css ``];
    }
}

class UprtclToggle extends LitElement {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.active = false;
    }
    handleToggleClick() {
        if (!this.disabled) {
            this.dispatchEvent(new CustomEvent('toggle-click'));
        }
    }
    render() {
        return html `
    <div class="toggle-container ${this.disabled ? 'disabled' : ''}">
      ${this.icon !== undefined
            ? html `<div class="icon-container">${icons[this.icon]}</div>`
            : ''}
      <slot></slot>
      <div
        @click=${this.handleToggleClick}
        class="toggle toggled-${this.active ? 'on' : 'off'} ${this.disabled ? 'toggle-disabled' : ''}"
      ></div>
    </div>
    `;
    }
    static get styles() {
        return [
            styles,
            css `
        .toggle-container {
          display: flex;
          flex-direction: column;
        }
        .toggle {
          display: flex;
          position: relative;
          height: 40px;
          width: 100px;
          background-color: lightgray;
          cursor: pointer;
        }
        .toggle:after {
          content: '';
          position: absolute;
          top: 5px;
          height: 30px;
          width: 45px;
        }
        .toggled-off:after {
          left: 5px;
          background-color: gray;
        }
        .toggled-on:after {
          right: 5px;
          background-color: #2196f3; 
        }
        .disabled {
          opacity: 0.5;
        }
        .toggle-disabled {
          cursor: initial;
        }
        .icon-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-right: 10px;
        }
      `,
        ];
    }
}
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclToggle.prototype, "icon", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclToggle.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], UprtclToggle.prototype, "active", void 0);

class UprtclIndicator extends LitElement {
    constructor() {
        super(...arguments);
        this.label = '';
        this.value = '';
    }
    render() {
        return html `
      <div class="container">
        ${this.label
            ? html `
              <div class="label">${this.label}</div>
            `
            : ''}
        <div class="input-container">
          <slot></slot>
        </div>
      </div>
    `;
    }
    static get styles() {
        return [
            css `
        :host {
          width: fit-content;
          display: flex;
          flex-direction: column;
        }
        .container {
          position: relative;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .label {
          width: 100%;
          position: absolute;
          left: 10px;
          top: -8px;
          background-color: white;
          width: fit-content;
          padding: 0px 5px;
          font-size: 15px;
          color: #2196f3;
        }
        .input-container {
          border-color: #2196f3;
          border-radius: 4px;
          border-style: solid;
          border-width: 2px;
          width: calc(100% - 30px);
          min-height: 30px;
          min-width: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 6px 12px;
          flex-grow: 1;
          text-align: center;
        }
      `
        ];
    }
}
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclIndicator.prototype, "label", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], UprtclIndicator.prototype, "value", void 0);

class CommonUIModule extends MicroModule {
    constructor() {
        super(...arguments);
        this.logger = new Logger('COMMON-UI-MODULE');
    }
    async onLoad() {
        customElements.define('uprtcl-button', UprtclButton);
        customElements.define('uprtcl-button-loading', UprtclButtonLoading);
        customElements.define('uprtcl-icon-button', UprtclIconButton);
        customElements.define('uprtcl-loading', UprtclLoading);
        customElements.define('uprtcl-list', UprtclList);
        customElements.define('uprtcl-list-item', UprtclListItem);
        customElements.define('uprtcl-list-item-option', UprtclListItemWithOption);
        customElements.define('uprtcl-card', UprtclCard);
        customElements.define('uprtcl-popper', UprtclPopper);
        customElements.define('uprtcl-options-menu', UprtclOptionsMenu);
        customElements.define('uprtcl-dialog', UprtclDialog);
        customElements.define('uprtcl-help', UprtclHelp);
        customElements.define('uprtcl-textfield', UprtclTextField);
        customElements.define('uprtcl-form-string', UprtclFormString);
        customElements.define('uprtcl-select', UprtclSelect);
        customElements.define('uprtcl-toggle', UprtclToggle);
        customElements.define('uprtcl-indicator', UprtclIndicator);
    }
    get submodules() {
        return [];
    }
}
CommonUIModule.id = 'common-ui-module';
CommonUIModule.bindings = CommonUIBindings;

export { CommonUIBindings, CommonUIModule, UprtclButton, UprtclButtonLoading, UprtclCard, UprtclDialog, UprtclFormString, UprtclHelp, UprtclIconButton, UprtclList, UprtclListItem, UprtclListItemWithOption, UprtclLoading, UprtclOptionsMenu, UprtclPopper, UprtclSelect, UprtclTextField, icons, styles };
//# sourceMappingURL=uprtcl-common-ui.es5.js.map
