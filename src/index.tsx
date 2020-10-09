import React from 'react'
import ReactDOM from 'react-dom'
import {UseWalletProvider} from 'use-wallet'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './pages/app'

ReactDOM.render(
  <React.StrictMode>
    <UseWalletProvider chainId={3}>
      <App />
    </UseWalletProvider>
  </React.StrictMode>,
  document.getElementById('root')
)