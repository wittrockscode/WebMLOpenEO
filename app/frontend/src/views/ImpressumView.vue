<template lang="pug">
.impressum.pt-7.pl-5.text-ml-text.text-sm.bg-ml-dark
  h1.font-bold Impressum
  br
  p Verantwortlich für den Inhalt:
  p Michael Brüggemann
  p m.brue@uni-muenster.de
  a(href="https://github.com/MichaelBrueggemann").text-ml-blue https://github.com/MichaelBrueggemann
  br
  br
  p Tim Ciroth
  p timciroth@uni-muenster.de
  a(href="https://github.com/TimCi").text-ml-blue https://github.com/TimCi
  br
  br
  p Martin Kriger
  p m.kriger@uni-muenster.de
  a(href="https://github.com/martinkrg26").text-ml-blue https://github.com/martinkrg26
  br
  br
  p Leonard Wittrock
  p lwittroc@uni-muenster.de
  a(href="https://github.com/wittrockscode").text-ml-blue https://github.com/wittrockscode
  br
  br
  p Entstehung:
  p Diese Website wurde im Februar 2024 fertiggestellt
  p Dies geschah im Rahmen des Moduls "Geosoftware II"
  p Verantwortlich für den Kurs ist Prof. Dr. Edzer Pebesma
  p Begleitet wird der Kurs von Dr. Christian Knoth
  br
  p Die Einrichtung des Kurses:
  p Westfälische Wilhelms-Universität Münster
  p Fachbereich 14 Geowissenschaften
  p Institut für Geoinformatik
  p Heisenbergstr. 2
  p 48149 Münster
  br
  p Theoretisch würden hier Links zu Datenschutzerklärung und Nutzungsbedingungen auftauchen,
  p sowie die zuständige Aufsichtsbehörde, Haftungshinweise und die Umsatz-Steuer-ID-Nummer
  p Da diese Website jedoch nicht wirklich veröffentlicht wird, werden diese Formalien bewusst weggelassen.
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
