import type { AoiModalPayload, TdModalPayload } from "@/types/AppTypes";

export const demo_aoi: AoiModalPayload = {
  aoi: {
    type: "Feature",
    properties: {},
    geometry: {
      coordinates: [
        [
          [
            7.608967714505809,
            51.96571771325557
          ],
          [
            7.608459555298623,
            51.964741587326245
          ],
          [
            7.606083163712981,
            51.96379306723787
          ],
          [
            7.6079812878097925,
            51.962890573179095
          ],
          [
            7.608623959747803,
            51.961518379028405
          ],
          [
            7.610537029704318,
            51.96236564480722
          ],
          [
            7.612584612390577,
            51.96219987667567
          ],
          [
            7.612868583711901,
            51.964879719645154
          ],
          [
            7.610686488293737,
            51.965017851538704
          ],
          [
            7.608967714505809,
            51.96571771325557
          ]
        ]
      ],
      type: "Polygon"
    }
  },
  toi: [new Date("2023-06-15"), new Date("2024-06-25")],
  withFile: false,
  fileName: "",
};

export const demo_td: TdModalPayload = {
  tot: [new Date("2023-06-15"), new Date("2024-06-25")],
  td: {
    type: "FeatureCollection",
    features: [
      {
       type: "Feature",
        properties: {
          class: "test1"
        },
        geometry: {
          coordinates: [
            [
              [
                7.606128118139992,
                51.963735774987384
              ],
              [
                7.607971996192447,
                51.96279627790568
              ],
              [
                7.608752098446075,
                51.96139792020145
              ],
              [
                7.610702354078143,
                51.962271898878356
              ],
              [
                7.613787303897624,
                51.96225004961934
              ],
              [
                7.61297174245172,
                51.96506851613634
              ],
              [
                7.610986027624676,
                51.965002972416386
              ],
              [
                7.6090357719925805,
                51.965833185789194
              ],
              [
                7.608291128932592,
                51.96450046737763
              ],
              [
                7.606128118139992,
                51.963735774987384
              ]
            ]
          ],
          type: "Polygon"
        }
      },
      {
        type: "Feature",
        properties: {
          class: "test1"
        },
        geometry: {
          coordinates: [
            [
              [
                7.613929140683382,
                51.957377399173026
              ],
              [
                7.606518169067243,
                51.953378370753654
              ],
              [
                7.606199036327041,
                51.951433359180044
              ],
              [
                7.609248526952911,
                51.95254792669476
              ],
              [
                7.616553120776757,
                51.95576034864638
              ],
              [
                7.613929140683382,
                51.957377399173026
              ]
            ]
          ],
          type: "Polygon"
        }
      },
      {
        type: "Feature",
        properties: {
          class: "test2"
        },
        geometry: {
          coordinates: [
            [
              [
                7.595632196718185,
                51.961791213043995
              ],
              [
                7.592405410125366,
                51.959802865518526
              ],
              [
                7.598965360890531,
                51.960960924802094
              ],
              [
                7.595632196718185,
                51.961791213043995
              ]
            ]
          ],
          type: "Polygon"
        }
      }
    ]
  },
  withFile: false,
  fileName: "",
};