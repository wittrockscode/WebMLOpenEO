# OpenEO

ist eine Specification, mit einer Implementierung in R (Package "openeo")
	- [OpenEOcubes](./openEOcubes.md) ist eine besondere Implementierung dieser Spezifikation
- man muss sich nach dem connecten mit den Daten "user" und "password" anmelden
	- ansonsten funktionieren die Services des Backends nicht
# Prozesse
- stellt ein "processes"-Objekt über die Funktion `processes()` zur Verfügung
	- bietet eine speichermöglichtkeit mit `<process-object>$save_result()` 
- über `list_processes()` kann eine Liste mit allen zur Verfügung stehenden Prozessen angefragt werden
- mit `describe_process(<processes-list>$<process>)` kann man die Beschreibung eines Prozesses einsehen
	- über `process_viewer(<ProcessObject)` erhält man eine HTML Dokumentaion zu allen durch das Backend bereitgestellten Prozessen
- man kann sog. User-Defined-Processes (UDF) definieren. Das sind Verkettungen von Funktionen (meist durch das gewählte OpenEO backend bereitgestellt) zu einem neuen Process. Diesen kann man dann an das Backend übergeben (mit `compute_result()` als synchronen Prozess oder mit `create_job(<Process>)` als asynchronen Prozess).
	- ein "Job" wird dann mit `start_job(<job>)` ausgeführt

## User-defined-processes (UDP)
- in einem UDP definiert man, wie die Daten von einem Backend verarbeitet werden sollen, die tatsächliche bearbeitung findet aber erst statt, wenn der Prozess auf dem Backend ausgeführt wird
# Kollektionen
- stellt collections zur Verfügung über `list_collections()` 
	- [x] Was machen diese Collections?
		- Die Kollektions geben die Daten an, die auf dem Backend zur Verfügung stehen. Das Backend kann nur auf den von ihm bereitgestellten Collections Berechnungen durchführen


# Unsere Aufgabe
- auch ein OpenEO-Backend programmieren, mit dem man sich verbinden kann. Dazu müssen wir die Specification von OpenEO erfüllen (siehe OpenEO Website)
	- vermutlich können wir hier einfach `openeocubes` entsprechend erweitern
- Sollten wir etwas selbst implementieren müssen, müssen wir vermutlich auch mit der "UDF-API" kommunizieren
	- [ ] Was ist das?
- Unsere Funktionalität wird als neuer Prozess auf dem "openeocubes"-Backend implementiert. Dort müssen wir noch zusätzlich das ML Model implmentieren, damit es ausgeführt werden kann.
	- 