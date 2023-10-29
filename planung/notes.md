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