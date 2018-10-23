import { Component, Template } from '@scoutgg/widgets'
import { Route } from 'widgets-router'
import { wire } from 'hyperhtml'

@Route('/')
@Component('sgg')
@Template(function (html) {
  html `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Ubuntu', sans-serif;
      min-height: 100vh;
      --filter: none;
      --h1-seconds-color: #cd5022;
      background: #fcfcfc; /* Old browsers */
      background: -moz-linear-gradient(top, #fcfcfc 0%, #eeeeee 100%); /* FF3.6-15 */
      background: -webkit-linear-gradient(top, #fcfcfc 0%,#eeeeee 100%); /* Chrome10-25,Safari5.1-6 */
      background: linear-gradient(to bottom, #fcfcfc 0%,#eeeeee 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fcfcfc', endColorstr='#eeeeee',GradientType=0 ); /* IE6-9 */
    }
    .firefox-emblem {
      background-image: url(public/birds.jpeg);
      background-position: bottom right;
      background-size: cover;
      animation-duration: 5s;
      animation-iteration-count: infinite;
      -webkit-mask-box-image: url(public/firefox.svg);
      height: 400px;
      width: 400px;
      max-width: 100%;
    }
    .firefox-emblem.shadowdom {
      background-image: url(public/upsidedown.gif);
    }
    h1 {
      font-size: 3em;
      font-weight: 300;
      color: #cd5022;
    }
    p {
      font-weight: 100;
      color: rgba(0,0,0,0.5);
    }
    demo-pyro {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
    }
    .upsidedown {
      color: #0c49ad;
      border-bottom: 2px solid #0c49ad;
    }
  </style>
  <sgg-count-down ondone=${() => this.setDone() } time="1540321200688"></sgg-count-down>
  <div class=${this.firefoxClass}></div>
  <h1>Firefox grows up</h1>
  <p>Firefox 63 - The <span class="upsidedown" onmouseover=${()=> this.toggleShadow()} onmouseout=${()=> this.toggleShadow()}>Shadow DOM</span> (bug 1471947) and Custom Elements (bug 1471948) APIs have been enabled by default; See Web components for more details.</p>

  ${ this.done ? wire()`<demo-pyro></demo-pyro>` : ''}
  `
})
export default class Firefox extends HTMLElement {
  connectedCallback() {
    this.audio = new Audio('public/strange.mp3')
    this.audio.loop = true
  }
  setDone() {
    this.done = true
    setTimeout(()=> this.render())
  }
  toggleShadow() {
    this.shadow = !this.shadow
    if(this.shadow) {
      this.audio.play()
    } else {
      this.audio.pause()
    }
    this.render()
  }
  get firefoxClass() {
    if(this.shadow) return 'firefox-emblem shadowdom'
    return 'firefox-emblem'
  }
}
