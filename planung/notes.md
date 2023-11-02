# Notes

## General

- always send training data with each request
- model gets trained on data -> prediction gets calculated

## Frontend

### **JS one page application with vue + ts + tailwind**

has:
- map displays data based on application state
- input form for relevant data including file upload for extent and training data
- download button
- example button

demo-prozess:
- fill form with example data
- send example request
- ?

## Backend

### **node + express.js backend (ts)**

has to be able to:
- request sentinel-2 data (datacubes)
- forward training data to the machine learning process
- accept prediction result and forward it to the frontend
- request model from model server and forward it to the frontend
- store example data
- (session management)

### model-server

- train a model on the training data provided
- predict results using a trained model
- forward results + model to the node server

## Names & Orga

Machine
Learning
Map
Toolkit


# Spec book

## Functional requirements

### Data ingest

- bereitstellen eines buttons, der den file-explorer öffnet um dateien hochzuladen
- es werden GeoJSON und GeoPackage unterstüzt
- der backend server basiert auf einem openEO backend "openEOcubes". Auf diesem liegt eine Sentinel-2 collection vor
- durch die gemeinsame Speicherung auf einer AWS Instanz (us-west-2 region Oregon) ist der direkte Zugriff auf die Sentinel-2 collection möglich
- das Abfragen von Daten für den Beispielprozess ist nicht notwendig, da wir den gesamten Ablauf des Prozesses vordefinieren (der Nutzer bestimmt nicht die im Prozess verwendeten Daten), d.h. dass wir die notwendigen Daten und die Klassifizierung bereits für unser Node.js backend zur Verfügung stellen.

### Processes

- TBD
- der Nutzer kann in der Web App in einer OpenLayers Karte mithilfe eines Zeichenwerkzeuges einen kartenausschnitt einzeichnen oder eine GeoJSON Datei, welche den gewünschten Bereich als beliebiges Polygon definiert, hochladen (implementiert bonus feat 3)
- Rejected -> vllt später wenn aufwand bekannt
- TBD -> recherchieren ob schwierig
- beim Auswählen des Zielbereiches kann man ein beliebiges Polygon auswählen
- der Nutzer kann am Ende des Prozesses eine Karte mit den Klassenwahrscheinlichkeiten herunterladen bzw. auf der Karte in der Web App anzeigen lassen
- Rejected -> vllt später wenn aufwand bekannt
- unsere Verbesserung ist ein neu auf dem Backend definierter openEO-Prozess der das Berechnen einer LULC Klassifikation mit dem Algorithmus "XXX" ermöglicht. Zusätzlich dazu werden alle Teilprozesse einer ML klassifikation als openEO-konforme Prozesse implementiert.

### Visualisation

- unsere Web App stellt eine Karte zur Verfügung, welche Abhängig des aktuell ausgewählten Schrittes entweder die Area of Interest oder die Training areas anzeigt
- Rejected -> wenn noch zeit ist, change request
- nach dem Ende des Prozesses zeigt die Karte das Ergebnis in Form einer Klassifizierungs-Layer (ein- und ausblendbar) an
    - diese Verwendet eine barrierefreie Farblegende
    - diese wird anhand der vom Backend zurückgegebenen Daten berechnet
- der Nutzer kann am Ende des Prozesses eine Karte mit den Klassenwahrscheinlichkeiten herunterladen bzw. auf der Karte in der Web App anzeigen lassen

### Data Download

- unsere Web App stellt eine Button bereit, der das Downloaden der Rasterdaten im .TIFF format ermöglicht
- recherchieren wie man ein ML model speichert/runterlädt
- die karte mit Klassenwahrscheinlichkeiten wird zum download über einen Button angeboten
    - cloud-free composite: Rejected -> wenn noch zeit ist, change request

### Deployment

- das Projekt beinhaltet 3 docker-services, die Folgendes bereitstellen:
    - http-server mit Vue.js
    - Node.js server
    - R server mit openEOcubes
- das Projekt kann mithilfe von docker compose gestartet werden
- der container wird auf einer AWS S3 Instanz gehostet