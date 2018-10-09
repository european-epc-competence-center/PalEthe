import React from 'react'
import ReactDOM from 'react-dom'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(faSpinner, faCheck)

import './css/oswald.css'
import './css/open-sans.css'
import './css/bootstrap.min.css'

import 'react-tabs/style/react-tabs.css';

import './page.css'

import Web3App from './Web3App'

ReactDOM.render(
  <Web3App />
  ,
  document.getElementById('root')
);
