# Trainingsworkflow für die ML-Algorithmen


**Auswahl in Karte**
- User wählt online Polygone auf einer Karte aus
- User gibt online Klasse an, zu der dieses Polygon gehört
- User gibt BoundingBox für Trainingsdaten an

**Auswahl per GeoJSON**
- User lädt GeoJSON im Format wie in ["Beispiele"](#beispiele) hoch.

**Verarbeitung**
- Daten werden an R-Backend weitergereicht
- R-Backend wählt anhand der BoundingBox ein passendes Satellitenbild aus
- R-Backend verknüpft die Information. welcher Pixel zu welcher Klasse gehört mit dem Satellitenbild
- R-Backend wendet die in diesem Trainings-Bild gelernten Strukturen auf das AOI an und führt die Klassifikation durch

# Beispiele

**Polygon**

```json
{
    "type": "Feature",
    "properties": 
    {
        "class": "Wald",
    },
    "geometry": 
    {
        "coordinates": 
        [
            [
            [
                7.631496907963083,
                51.99507684477683
            ],
            [
                7.632948526030873,
                51.99406385589654
            ],
            [
                7.633190462375666,
                51.995330088416296
            ],
            [
                7.6325372342454045,
                51.99546415799844
            ],
            [
                7.631496907963083,
                51.99507684477683
            ]
            ]
        ],
    "type": "Polygon"
    }
}
```

**Trainingsgebiet**:

```json
{
  "type": "FeatureCollection",
  "bbox": 
    [
          [
            [
              7.630504968950532,
              51.99573229595768
            ],
            [
              7.630504968950532,
              51.991188630264446
            ],
            [
              7.636916282083121,
              51.991188630264446
            ],
            [
              7.636916282083121,
              51.99573229595768
            ],
            [
              7.630504968950532,
              51.99573229595768
            ]
          ]
   ],
  "features": [
    {
      "type": "Feature",
      "properties": {
        "class": "Wald"
      },
      "geometry": {
        "coordinates": [
          [
            [
              7.631496907963083,
              51.99507684477683
            ],
            [
              7.632948526030873,
              51.99406385589654
            ],
            [
              7.633190462375666,
              51.995330088416296
            ],
            [
              7.6325372342454045,
              51.99546415799844
            ],
            [
              7.631496907963083,
              51.99507684477683
            ]
          ]
        ],
        "type": "Polygon"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "class": "Acker"
      },
      "geometry": {
        "coordinates": [
          [
            [
              7.631593682500636,
              51.99203780937788
            ],
            [
              7.632077555190222,
              51.9912780182982
            ],
            [
              7.635682406725749,
              51.99196332062655
            ],
            [
              7.634835629519472,
              51.99270820256572
            ],
            [
              7.631593682500636,
              51.99203780937788
            ]
          ]
        ],
        "type": "Polygon"
      }
    },
    
  ]
}
```