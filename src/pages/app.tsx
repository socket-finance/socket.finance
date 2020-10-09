import React, { Suspense } from 'react'
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom'
import Header from '../components/header'
import Footer from '../components/footer'
import Home from './home'
import Stake from './stake'
import Pool from './pool'
import About from './about'

export default function App() {
  return (
    <Suspense fallback={null}>
      <Header/>
      <HashRouter>
        <Switch>
          <Route exact strict path="/" component={Home} />
          <Route exact strict path="/home" component={Home} />
          <Route exact strict path="/stake" component={Stake} />
          <Route exact strict path="/stake/:id" component={Pool} />
          <Route exact strict path="/about" component={About} />
        </Switch>
      </HashRouter>
      <Footer/>
    </Suspense>
  )
}
