import { bootstrap } from '@scoutgg/widgets'
import { hyper as renderer } from '@scoutgg/widgets/cjs/renderers/hyper'
import { PageRouter, router, routes } from 'widgets-router'
import hyper from 'hyperhtml'

// Import the components you want to use
import './components/count-down/count-down'
import './components/firefox/firefox'
import './components/pyro/pyro'

// Bootstrap Widgets (Start it)
bootstrap([
  renderer(hyper)
])
