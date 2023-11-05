# Random Forest (rF)
- Der Namensteil "Forest" stammt daher, das der Algorithmus viele Entschediungsbäume für die Klassifikation baut.
- eine klassischer Machine Learning (ML) Algorithmus, welche besonders gut auf Remote Sensing Daten zu LULC performt.
- nutzt mehrere **"Classifier"** und verbindet diese zu vielen Entscheidungsbäumen
    - ein **"Classifier"** ist eine Instanz, die eine Entscheidung über eine Klassifikation abgibt.
- Ein Entscheidungsbaum endet dabei immer damit, dass eine Entscheidung für eine Klasse abgegeben wird. Am Ende wird das Mittel aus allen Klassifikationen genommen
> nimmt man nominale Klassen, so wird sich am Ende für die Klasse entschieden, die am häufigsten durch einen Baum gewählt wurde.

**?? Wie funktioniert ein "Entscheidungsbaum" im Random Forest**

# Nutzbarkeit in R
- in R existiert einerseits das package `randomForest` als auch das Package `caret`. `randomForest` umfasst dabei alle Funktionen um einen rF-ML-Algorithmus aufzusetzen.

- `caret`umfasst grundlegende Funktionalität für ML Algorithmen
    - Training/Test Splits erstellen
    - Parameter des Modells einstellen
    - Hyperparameter Tuning
    - Modell Optimierung und Auswahl

## nützliche Links
- https://stackoverflow.com/questions/57939453/building-a-randomforest-with-caret
- https://www.machinelearningplus.com/machine-learning/caret-package/
