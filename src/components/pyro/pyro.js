import { Component, Template } from '@scoutgg/widgets'

@Component('demo')
@Template(function (html) {
  html `
    <style>
    body {
    margin: 0;
    padding: 0;
    background: #000;
    overflow: hidden;
    }

    .pyro > .before, .pyro > .after {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    box-shadow: 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff;
    -moz-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
    -webkit-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
    -o-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
    -ms-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
    animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
    }

    .pyro > .after {
    -moz-animation-delay: 1.25s, 1.25s, 1.25s;
    -webkit-animation-delay: 1.25s, 1.25s, 1.25s;
    -o-animation-delay: 1.25s, 1.25s, 1.25s;
    -ms-animation-delay: 1.25s, 1.25s, 1.25s;
    animation-delay: 1.25s, 1.25s, 1.25s;
    -moz-animation-duration: 1.25s, 1.25s, 6.25s;
    -webkit-animation-duration: 1.25s, 1.25s, 6.25s;
    -o-animation-duration: 1.25s, 1.25s, 6.25s;
    -ms-animation-duration: 1.25s, 1.25s, 6.25s;
    animation-duration: 1.25s, 1.25s, 6.25s;
    }

    @-webkit-keyframes bang {
    to {
      box-shadow: -200px -48.66667px #eeff00, -92px -247.66667px #44ff00, -66px -127.66667px #00fff2, 214px -351.66667px #0088ff, 241px -387.66667px #bf00ff, -130px -288.66667px #001eff, -82px -282.66667px #00ff11, -19px -401.66667px #ff001a, 248px -22.66667px #ff3700, 35px 62.33333px #5500ff, -55px -363.66667px #ff00dd, 41px -44.66667px #c8ff00, -134px -0.66667px #00ff1a, 228px -360.66667px #ff0073, -198px -288.66667px #00ff44, 57px -132.66667px #4800ff, 92px -230.66667px #a200ff, 165px 42.33333px #0011ff, -119px -100.66667px #0091ff, 83px -10.66667px #ff00b7, -136px -366.66667px #ffb300, -91px -100.66667px #8800ff, -177px -244.66667px #ff0099, 234px -357.66667px #5900ff, -205px -252.66667px #0066ff, 88px -88.66667px #26ff00, 56px -392.66667px #0026ff, 98px -354.66667px #80ff00, -38px -201.66667px #00ff80, -63px 32.33333px #006aff, 55px -120.66667px #73ff00, -193px -99.66667px #ff0073, 35px -166.66667px #04ff00, -139px -35.66667px #00ffc4, -67px -357.66667px #00ff7b, 212px -350.66667px #ff1100, 200px -58.66667px #0d00ff, 76px 6.33333px #b300ff, 245px -373.66667px #ff006a, 0px -382.66667px #00ffdd, 205px -23.66667px #00ff62, -118px -170.66667px #a2ff00, 203px -261.66667px #ff0088, -167px -30.66667px #11ff00, -189px -293.66667px magenta, -93px -280.66667px #f200ff, -109px -16.66667px #00ccff, -113px -206.66667px #ff0900, 235px -365.66667px #ff4d00, 219px -249.66667px #00ffaa, 179px -21.66667px #0048ff;
    }
    }
    @-moz-keyframes bang {
    to {
      box-shadow: -200px -48.66667px #eeff00, -92px -247.66667px #44ff00, -66px -127.66667px #00fff2, 214px -351.66667px #0088ff, 241px -387.66667px #bf00ff, -130px -288.66667px #001eff, -82px -282.66667px #00ff11, -19px -401.66667px #ff001a, 248px -22.66667px #ff3700, 35px 62.33333px #5500ff, -55px -363.66667px #ff00dd, 41px -44.66667px #c8ff00, -134px -0.66667px #00ff1a, 228px -360.66667px #ff0073, -198px -288.66667px #00ff44, 57px -132.66667px #4800ff, 92px -230.66667px #a200ff, 165px 42.33333px #0011ff, -119px -100.66667px #0091ff, 83px -10.66667px #ff00b7, -136px -366.66667px #ffb300, -91px -100.66667px #8800ff, -177px -244.66667px #ff0099, 234px -357.66667px #5900ff, -205px -252.66667px #0066ff, 88px -88.66667px #26ff00, 56px -392.66667px #0026ff, 98px -354.66667px #80ff00, -38px -201.66667px #00ff80, -63px 32.33333px #006aff, 55px -120.66667px #73ff00, -193px -99.66667px #ff0073, 35px -166.66667px #04ff00, -139px -35.66667px #00ffc4, -67px -357.66667px #00ff7b, 212px -350.66667px #ff1100, 200px -58.66667px #0d00ff, 76px 6.33333px #b300ff, 245px -373.66667px #ff006a, 0px -382.66667px #00ffdd, 205px -23.66667px #00ff62, -118px -170.66667px #a2ff00, 203px -261.66667px #ff0088, -167px -30.66667px #11ff00, -189px -293.66667px magenta, -93px -280.66667px #f200ff, -109px -16.66667px #00ccff, -113px -206.66667px #ff0900, 235px -365.66667px #ff4d00, 219px -249.66667px #00ffaa, 179px -21.66667px #0048ff;
    }
    }
    @-o-keyframes bang {
    to {
      box-shadow: -200px -48.66667px #eeff00, -92px -247.66667px #44ff00, -66px -127.66667px #00fff2, 214px -351.66667px #0088ff, 241px -387.66667px #bf00ff, -130px -288.66667px #001eff, -82px -282.66667px #00ff11, -19px -401.66667px #ff001a, 248px -22.66667px #ff3700, 35px 62.33333px #5500ff, -55px -363.66667px #ff00dd, 41px -44.66667px #c8ff00, -134px -0.66667px #00ff1a, 228px -360.66667px #ff0073, -198px -288.66667px #00ff44, 57px -132.66667px #4800ff, 92px -230.66667px #a200ff, 165px 42.33333px #0011ff, -119px -100.66667px #0091ff, 83px -10.66667px #ff00b7, -136px -366.66667px #ffb300, -91px -100.66667px #8800ff, -177px -244.66667px #ff0099, 234px -357.66667px #5900ff, -205px -252.66667px #0066ff, 88px -88.66667px #26ff00, 56px -392.66667px #0026ff, 98px -354.66667px #80ff00, -38px -201.66667px #00ff80, -63px 32.33333px #006aff, 55px -120.66667px #73ff00, -193px -99.66667px #ff0073, 35px -166.66667px #04ff00, -139px -35.66667px #00ffc4, -67px -357.66667px #00ff7b, 212px -350.66667px #ff1100, 200px -58.66667px #0d00ff, 76px 6.33333px #b300ff, 245px -373.66667px #ff006a, 0px -382.66667px #00ffdd, 205px -23.66667px #00ff62, -118px -170.66667px #a2ff00, 203px -261.66667px #ff0088, -167px -30.66667px #11ff00, -189px -293.66667px magenta, -93px -280.66667px #f200ff, -109px -16.66667px #00ccff, -113px -206.66667px #ff0900, 235px -365.66667px #ff4d00, 219px -249.66667px #00ffaa, 179px -21.66667px #0048ff;
    }
    }
    @-ms-keyframes bang {
    to {
      box-shadow: -200px -48.66667px #eeff00, -92px -247.66667px #44ff00, -66px -127.66667px #00fff2, 214px -351.66667px #0088ff, 241px -387.66667px #bf00ff, -130px -288.66667px #001eff, -82px -282.66667px #00ff11, -19px -401.66667px #ff001a, 248px -22.66667px #ff3700, 35px 62.33333px #5500ff, -55px -363.66667px #ff00dd, 41px -44.66667px #c8ff00, -134px -0.66667px #00ff1a, 228px -360.66667px #ff0073, -198px -288.66667px #00ff44, 57px -132.66667px #4800ff, 92px -230.66667px #a200ff, 165px 42.33333px #0011ff, -119px -100.66667px #0091ff, 83px -10.66667px #ff00b7, -136px -366.66667px #ffb300, -91px -100.66667px #8800ff, -177px -244.66667px #ff0099, 234px -357.66667px #5900ff, -205px -252.66667px #0066ff, 88px -88.66667px #26ff00, 56px -392.66667px #0026ff, 98px -354.66667px #80ff00, -38px -201.66667px #00ff80, -63px 32.33333px #006aff, 55px -120.66667px #73ff00, -193px -99.66667px #ff0073, 35px -166.66667px #04ff00, -139px -35.66667px #00ffc4, -67px -357.66667px #00ff7b, 212px -350.66667px #ff1100, 200px -58.66667px #0d00ff, 76px 6.33333px #b300ff, 245px -373.66667px #ff006a, 0px -382.66667px #00ffdd, 205px -23.66667px #00ff62, -118px -170.66667px #a2ff00, 203px -261.66667px #ff0088, -167px -30.66667px #11ff00, -189px -293.66667px magenta, -93px -280.66667px #f200ff, -109px -16.66667px #00ccff, -113px -206.66667px #ff0900, 235px -365.66667px #ff4d00, 219px -249.66667px #00ffaa, 179px -21.66667px #0048ff;
    }
    }
    @keyframes bang {
    to {
      box-shadow: -200px -48.66667px #eeff00, -92px -247.66667px #44ff00, -66px -127.66667px #00fff2, 214px -351.66667px #0088ff, 241px -387.66667px #bf00ff, -130px -288.66667px #001eff, -82px -282.66667px #00ff11, -19px -401.66667px #ff001a, 248px -22.66667px #ff3700, 35px 62.33333px #5500ff, -55px -363.66667px #ff00dd, 41px -44.66667px #c8ff00, -134px -0.66667px #00ff1a, 228px -360.66667px #ff0073, -198px -288.66667px #00ff44, 57px -132.66667px #4800ff, 92px -230.66667px #a200ff, 165px 42.33333px #0011ff, -119px -100.66667px #0091ff, 83px -10.66667px #ff00b7, -136px -366.66667px #ffb300, -91px -100.66667px #8800ff, -177px -244.66667px #ff0099, 234px -357.66667px #5900ff, -205px -252.66667px #0066ff, 88px -88.66667px #26ff00, 56px -392.66667px #0026ff, 98px -354.66667px #80ff00, -38px -201.66667px #00ff80, -63px 32.33333px #006aff, 55px -120.66667px #73ff00, -193px -99.66667px #ff0073, 35px -166.66667px #04ff00, -139px -35.66667px #00ffc4, -67px -357.66667px #00ff7b, 212px -350.66667px #ff1100, 200px -58.66667px #0d00ff, 76px 6.33333px #b300ff, 245px -373.66667px #ff006a, 0px -382.66667px #00ffdd, 205px -23.66667px #00ff62, -118px -170.66667px #a2ff00, 203px -261.66667px #ff0088, -167px -30.66667px #11ff00, -189px -293.66667px magenta, -93px -280.66667px #f200ff, -109px -16.66667px #00ccff, -113px -206.66667px #ff0900, 235px -365.66667px #ff4d00, 219px -249.66667px #00ffaa, 179px -21.66667px #0048ff;
    }
    }
    @-webkit-keyframes gravity {
    to {
      transform: translateY(200px);
      -moz-transform: translateY(200px);
      -webkit-transform: translateY(200px);
      -o-transform: translateY(200px);
      -ms-transform: translateY(200px);
      opacity: 0;
    }
    }
    @-moz-keyframes gravity {
    to {
      transform: translateY(200px);
      -moz-transform: translateY(200px);
      -webkit-transform: translateY(200px);
      -o-transform: translateY(200px);
      -ms-transform: translateY(200px);
      opacity: 0;
    }
    }
    @-o-keyframes gravity {
    to {
      transform: translateY(200px);
      -moz-transform: translateY(200px);
      -webkit-transform: translateY(200px);
      -o-transform: translateY(200px);
      -ms-transform: translateY(200px);
      opacity: 0;
    }
    }
    @-ms-keyframes gravity {
    to {
      transform: translateY(200px);
      -moz-transform: translateY(200px);
      -webkit-transform: translateY(200px);
      -o-transform: translateY(200px);
      -ms-transform: translateY(200px);
      opacity: 0;
    }
    }
    @keyframes gravity {
    to {
      transform: translateY(200px);
      -moz-transform: translateY(200px);
      -webkit-transform: translateY(200px);
      -o-transform: translateY(200px);
      -ms-transform: translateY(200px);
      opacity: 0;
    }
    }
    @-webkit-keyframes position {
    0%, 19.9% {
      margin-top: 10%;
      margin-left: 40%;
    }
    20%, 39.9% {
      margin-top: 40%;
      margin-left: 30%;
    }
    40%, 59.9% {
      margin-top: 20%;
      margin-left: 70%;
    }
    60%, 79.9% {
      margin-top: 30%;
      margin-left: 20%;
    }
    80%, 99.9% {
      margin-top: 30%;
      margin-left: 80%;
    }
    }
    @-moz-keyframes position {
    0%, 19.9% {
      margin-top: 10%;
      margin-left: 40%;
    }
    20%, 39.9% {
      margin-top: 40%;
      margin-left: 30%;
    }
    40%, 59.9% {
      margin-top: 20%;
      margin-left: 70%;
    }
    60%, 79.9% {
      margin-top: 30%;
      margin-left: 20%;
    }
    80%, 99.9% {
      margin-top: 30%;
      margin-left: 80%;
    }
    }
    @-o-keyframes position {
    0%, 19.9% {
      margin-top: 10%;
      margin-left: 40%;
    }
    20%, 39.9% {
      margin-top: 40%;
      margin-left: 30%;
    }
    40%, 59.9% {
      margin-top: 20%;
      margin-left: 70%;
    }
    60%, 79.9% {
      margin-top: 30%;
      margin-left: 20%;
    }
    80%, 99.9% {
      margin-top: 30%;
      margin-left: 80%;
    }
    }
    @-ms-keyframes position {
    0%, 19.9% {
      margin-top: 10%;
      margin-left: 40%;
    }
    20%, 39.9% {
      margin-top: 40%;
      margin-left: 30%;
    }
    40%, 59.9% {
      margin-top: 20%;
      margin-left: 70%;
    }
    60%, 79.9% {
      margin-top: 30%;
      margin-left: 20%;
    }
    80%, 99.9% {
      margin-top: 30%;
      margin-left: 80%;
    }
    }
    @keyframes position {
    0%, 19.9% {
      margin-top: 10%;
      margin-left: 40%;
    }
    20%, 39.9% {
      margin-top: 40%;
      margin-left: 30%;
    }
    40%, 59.9% {
      margin-top: 20%;
      margin-left: 70%;
    }
    60%, 79.9% {
      margin-top: 30%;
      margin-left: 20%;
    }
    80%, 99.9% {
      margin-top: 30%;
      margin-left: 80%;
    }
    }

  </style>
  <div class="pyro">
    <div class="before"></div>
    <div class="after"></div>
  </div>
  `
})
export default class Pyro extends HTMLElement {
}
