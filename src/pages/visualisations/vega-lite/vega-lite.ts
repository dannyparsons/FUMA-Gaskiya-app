import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { TranslateService  } from '@ngx-translate/core';
import { global } from '../../../global-variables/variable';
//vega imported via script in index, so just declaring global var vg
declare var vg;

@IonicPage()
@Component({
  selector: 'page-vega-lite',
  templateUrl: 'vega-lite.html'
})
export class VegaLitePage {

  constructor(public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController) {
    this.translate.setDefaultLang(global.langue)
    let visSpec = navParams.data.visSpec;
    console.log('vis spec',visSpec)
    var embedSpec = {
      mode: "vega-lite",
      spec: visSpec
    };

    vg.embed("#vegaVis", embedSpec, function (error, result) {
    
       });
    }

  ionViewDidEnter() { this.translate.use(global.langue)}

  close() {
    this.viewCtrl.dismiss()
  }

}

// var demoSpec = {
//   "width": 400,
//   "height": 200,
//   "padding": { "top": 10, "left": 30, "bottom": 30, "right": 10 },
//   "data": [
//     {
//       "name": "table",
//       "values": [
//         { "x": 1, "y": 28 },
//         { "x": 2, "y": 55 },
//         { "x": 3, "y": 43 },
//         { "x": 4, "y": 91 },
//         { "x": 5, "y": 81 },
//         { "x": 6, "y": 53 },
//         { "x": 7, "y": 19 },
//         { "x": 8, "y": 87 },
//         { "x": 9, "y": 52 },
//         { "x": 10, "y": 48 },
//         { "x": 11, "y": 24 },
//         { "x": 12, "y": 49 },
//         { "x": 13, "y": 87 },
//         { "x": 14, "y": 66 },
//         { "x": 15, "y": 17 },
//         { "x": 16, "y": 27 },
//         { "x": 17, "y": 68 },
//         { "x": 18, "y": 16 },
//         { "x": 19, "y": 49 },
//         { "x": 20, "y": 15 }
//       ]
//     }
//   ],
//   "scales": [
//     {
//       "name": "x",
//       "type": "ordinal",
//       "range": "width",
//       "domain": { "data": "table", "field": "x" }
//     },
//     {
//       "name": "y",
//       "type": "linear",
//       "range": "height",
//       "domain": { "data": "table", "field": "y" },
//       "nice": true
//     }
//   ],
//   "axes": [{ "type": "x", "scale": "x" }, { "type": "y", "scale": "y" }],
//   "marks": [
//     {
//       "type": "rect",
//       "from": { "data": "table" },
//       "properties": {
//         "enter": {
//           "x": { "scale": "x", "field": "x" },
//           "width": { "scale": "x", "band": true, "offset": -1 },
//           "y": { "scale": "y", "field": "y" },
//           "y2": { "scale": "y", "value": 0 }
//         },
//         "update": { "fill": { "value": "steelblue" } },
//         "hover": { "fill": { "value": "red" } }
//       }
//     }
//   ]
// };

