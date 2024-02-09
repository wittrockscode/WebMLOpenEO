<template lang="pug">
main.bg-ml-dark.w-screen.h-screen
  #demo-overlay(v-if="demoOverlay")
  AppHeader
  RouterView(:demo="demo")
  v-tour(
    name="demoProcess"
    :steps="steps"
    :callbacks="demoCallbacks"
    :options="demoOptions"
  )
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { RouterView } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
import { useDemo } from "@/composables/use-demo";

export default defineComponent({
  components: {
    AppHeader,
    RouterView,
  },
  setup() {
    const demo = useDemo();
    const demoOverlay = ref(false);

    const demoCallbacks = {
      onStart: () => {
        demoOverlay.value = true;
      },
      onFinish: () => {
        demo.finish();
      },
      onStop: () => {
        demo.reset();
        demoOverlay.value = false;
      },
      onPreviousStep: (step: number) => {
        handlePreviousStep(step);
      },
    };

    const demoOptions = {
      labels: {
        buttonSkip: 'Skip tour',
        buttonPrevious: 'Previous',
        buttonNext: 'Next',
        buttonStop: 'Start a demo classification',
        highlight: true,
      },
    };

    const handlePreviousStep = (step: number) => {
      switch (step) {
        case 2:
          demo.closeAoiModal();
          break;
        case 5:
          document.getElementById("aoi-button")!.click();
          break;
        case 6:
          demo.closeTdModal();
          break;
        case 11:
          document.getElementById("td-button")!.click();
          break;
      };
    };

    const steps = [
      {
        target: '#model-name',
        header: {
          title: 'Welcome!',
        },
        content: 'This is the algorithm used to train the model.',
        before: () => new Promise((resolve) => {
          demo.start();
          resolve(true);
        }),
      },
      {
        target: "#aoi-button",
        header: {
          title: "Area of Interest",
        },
        content: "This button is used to select the area of interest for your classification.",
        before: () => new Promise((resolve) => {
          demo.selectDoi();
          resolve(true);
        }),
      },
      {
        target: "#toi-select",
        header: {
          title: "Date of Interest",
        },
        content: "You can select a range of dates to be used in the classification process here.",
        before: () => new Promise((resolve) => {
          document.getElementById("aoi-button")!.click();
          resolve(true);
        }),
      },
      {
        target: "#draw-button",
        header: {
          title: "Area of Interest",
        },
        content: "You can either draw a polygon ...",
        before: () => new Promise((resolve) => {
          resolve(true);
        }),
        params: {
          placement: "top",
        },
      },
      {
        target: "#aoi-upload_div",
        header: {
          title: "Area of Interest",
        },
        content: "... or upload a GeoJSON/GPKG file.",
        params: {
          placement: "top",
        },
        before: () => new Promise((resolve) => {
          resolve(true);
        }),
      },
      {
        target: "#td-button",
        header: {
          title: "Training Data",
        },
        content: "This button is used to create or upload the training data for your classification.",
        before: () => new Promise((resolve) => {
          demo.selectAoi();
          resolve(true);
        }),
      },
      {
        target: "#tot-select",
        header: {
          title: "Training Data",
        },
        content: "First, select a date for the trainig data.",
        before: () => new Promise((resolve) => {
          document.getElementById("td-button")!.click();
          resolve(true);
        }),
      },
      {
        target: "#aot-button",
        header: {
          title: "Training Data",
        },
        content: "Select the area in which you want to create training data.",
        before: () => new Promise((resolve) => {
          document.getElementById("td-button")!.click();
          resolve(true);
        }),
      },
      {
        target: "#sentinel-img-td-button",
        header: {
          title: "Training Data",
        },
        content: "You can optionally fetch a satellite image for the date intervall picked above. You can use it, to determine wether the satellite image has your desired qualtiy. The image you will see will be used for training/classification.",
        before: () => new Promise((resolve) => {
          document.getElementById("td-button")!.click();
          resolve(true);
        }),
      },
      {
        target: "#draw-button-td",
        header: {
          title: "Training Data",
        },
        content: "Now create Training Data via the map ...",
        params: {
          placement: "top",
        },
        before: () => new Promise((resolve) => {
          demo.selectTot();
          resolve(true);
        }),
      },
      {
        target: "#td-upload_div",
        header: {
          title: "Training Data",
        },
        content: "... or upload a GeoJSON/GPKG file.",
        params: {
          placement: "top",
        },
        before: () => new Promise((resolve) => {
          resolve(true);
        }),
      },
      {
        target: "#hp-button",
        header: {
          title: "Hyperparameters",
        },
        content: "You can set the hyperparameters for your classification here.",
        params: {
          placement: "top",
        },
        before: () => new Promise((resolve) => {
          demo.selectTd();
          resolve(true);
        }),
      },
      {
        target: "#rs-button",
        header: {
          title: "Resolution",
        },
        content: "Choose between 10x10, 30x30 or 60x60 meters per pixel.",
        params: {
          placement: "top",
        },
        before: () => new Promise((resolve) => {
          demo.selectHyperparams();
          resolve(true);
        }),
      },
      {
        target: "#calc-button",
        header: {
          title: "Calculate",
        },
        content: "Finally, start the process!",
        params: {
          placement: "top",
        },
        before: () => new Promise((resolve) => {
          demo.selectResolution();
          resolve(true);
        }),
      },
      {
        target: "body",
        header: {
          title: "",
        },
        content: "",
        before: () => new Promise((resolve) => {
          demo.finish();
          resolve(true);
        }),
      },
    ];
    return { steps, demo, demoCallbacks, demoOverlay, demoOptions };
  },
});
</script>

<style>
#demo-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 101;
  background-color: rgba(63, 63, 63, 0.548);
}
</style>