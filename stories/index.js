import React from 'react'
import {storiesOf} from '@storybook/react'
import {Button} from '@storybook/react/demo'

import Micro from './../src/Micro';

const HTML_A = `
  <html>
    <head></head>
    <body>
      <h1 id="title">Content of a microservice rendered inside a Micro instance</h1>
    </body>
  </html>
`;

const IFRAME_STYLE_A = `  
  background-color:#f7f7f7;
  border:1px solid #eee;
  padding:20px;
  width: 33%;
`;

const BLOB_A = new Blob([HTML_A], {type: 'text/html'});

const PROMISE_A = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (true) {
      resolve({data: BLOB_A});
    } else {
      reject("NOK");
    }
  }, 200)
});

storiesOf('Micro', module).add('simple with promise and basic styling of iframe', () => (
  <div>
    <h1>Micro with with promise and basic styling of iframe</h1>
    <Micro type="iframe" contentPromise={PROMISE_A} iframeStyle={IFRAME_STYLE_A}/>
  </div>
)).add('simple with promise and styling of content inside the iframe', () => (
  <div>
    <h1>Micro with with promise and styling of content inside the iframe</h1>
    <Micro
      type="iframe"
      contentPromise={PROMISE_A}
      iframeStyle={IFRAME_STYLE_A}
      elementStyles={[{
        id: 'title',
        style: 'color:red;font-family:sans-serif;font-weight:200;'
      }
    ]}/>
  </div>
))
