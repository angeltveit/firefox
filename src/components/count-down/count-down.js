import { Component, Template, Attribute } from '@scoutgg/widgets'

@Component('sgg')
@Template(function (html) {
  html `
    <style>
      :host {
        display: flex;
      }
      h1 {
        font-family: var(--accent-font);
        font-weight: 300;
        filter: var(--filter, drop-shadow(1px 1px 1px rgba(0,0,0,0.5)));
        color: var(--h1-color, auto);
        margin-right: 1em;
      }
      h1:last-child {
        margin-right: 0;
      }
      .seconds {
        color: var(--h1-seconds-color, orange);
      }
    </style>
    <h1>${this.countdown.days || '00'}D</h1>
    <h1>${this.countdown.hours || '00'}H</h1>
    <h1>${this.countdown.minutes || '00'}M</h1>
    <h1 class="seconds">${this.countdown.seconds || '00'}S</h1>
  `
})
export default class CountDown extends HTMLElement {
  connectedCallback() {
    this.countdown = this.countify
    this.time = this.attributes.time.value
    const rerender = () => {
      this.countdown = this.countify
      this.render()
      if(this.countdown.time) {
        setTimeout(rerender, 1000)
      } else {
        const event = new CustomEvent('done')
        this.dispatchEvent(event)
      }
    }
    rerender()
  }

  padded(num) {
    if(num < 10) return '0' + num
    return num
  }

  get countify() {
    let t = this.time - Date.now()
    if(t <= 0) return {}
    return {
      time: t,
      seconds: this.padded(Math.floor((t / 1000) % 60)),
      minutes: this.padded(Math.floor((t / 1000 / 60) % 60)),
      hours: this.padded(Math.floor((t / (1000 * 60 * 60)) % 24)),
      days: this.padded(Math.floor(t / (1000 * 60 * 60 * 24))),
    }
  }
}
