# openEOcubes

ist ein Repository mit einem R-Package, welches Funktionen zur Interaktionen mit dem OpenEOcubes-Backend ermöglicht
- die Prozesse sind in `processes.R` definiert

## Questions to Brian
- [x] Why are all functions of this package wrapped in a `processes`-Object?
	- Das ist eine Konvention von OpenEO (die "Mutterplattform"). `openeocubes` implementiert quasi nur Funktionen von OpenEO. Die Implementierungen können identisch zu den Funktionalitäten von OpenEO sein, können diese aber auch erweitern.
	  Das implementieren dieser Funktionen macht ein Backend dann "OpenEO-compliant"
		- [ ] Herausfinden, was OpenEO fordert
- [x] is there a concise documentation to all functionality of `openeocubes`?
	- eine richtige Dokumentationsseite existiert bisher nicht. Die einzige Möglichkeit in `openeocubes` ist es die Funktion `describe_process()` zu nutzen
	- Doku zu den allgemeneinen OpenEO Funktionalitäten findet man [hier](https://openeo.org/documentation/1.0/processes.html)
	- Brian freut sich aber über pull-Requests, die eine Dokumentation bereitstellen