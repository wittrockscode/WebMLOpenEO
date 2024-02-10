<template lang="pug">
.impressum.pt-7.pl-5.text-ml-text.text-sm.bg-ml-dark
  h1.font-bold Legal Notice
  br
  p Responsible for the content:
  br
  p Michael Brüggemann
  p m.brue@uni-muenster.de
  a(href="https://github.com/MichaelBrueggemann").text-ml-blue https://github.com/MichaelBrueggemann
  br
  br
  p Martin Kriger
  p m.kriger@uni-muenster.de
  a(href="https://github.com/martinkrg26").text-ml-blue https://github.com/martinkrg26
  br
  br
  p Tim Ciroth
  p timciroth@uni-muenster.de
  a(href="https://github.com/TimCi").text-ml-blue https://github.com/TimCi
  br
  br
  p Leonard Wittrock
  p lwittroc@uni-muenster.de
  a(href="https://github.com/wittrockscode").text-ml-blue https://github.com/wittrockscode
  br
  br
  p About this website:
  p This website was completed in February 2024
  p This was done as part of the module "Geosoftware II"
  p Prof. Dr. Edzer Pebesma is responsible for the course
  p The course is supervised by Dr. Christian Knoth
  br
  p The organization of the course:
  p Universität Münster
  p Faculty 14 Geosciences
  p Institute for Geoinformatics
  p Heisenbergstr. 2
  p 48149 Münster
  br
  p Theoretically, links to the privacy policy and terms of use would appear here,
  p as well as the responsible supervisory authority, liability information and the sales tax ID number
  p However, as this website is not actually published, these formalities are deliberately omitted.
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {

    return { };
  },
});
</script>

<style scoped>
.impressum {
  height: max-content;
  width: 100%;
}
</style>