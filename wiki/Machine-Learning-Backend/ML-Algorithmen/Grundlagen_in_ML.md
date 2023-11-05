# Grundlagen

- Klassifikationsprobleme können durch die "Features" eines Datensatzes gelöst werden.

- **Features** sind hierbei die einzelnen Daten, die ein Ereignis auszeichnen (Bsp Wälder: ein Wald könnte durch Baummenge, Baumdichte, NDVI und die höhe der erkannten Objekte identifiziert werden) 
    - es ist daher relevant herauszufinden, welche _Features_ im Datensatz enthalten sind.

- ein Algorithmus kann mehrere **"Models"** haben. Ein **Model** ist dabei eine Parameterkombination für den Algorithmus. 

# Parameter Tuning
- um die richtigen Parameter für den Algorithmus zu finden, gibt es unterschiedliche Suchstrategien
- ein Parameter ist immer im Kontext der Daten auf denen der Algorithmus trainiert wird "optimal"
- Manche Bibliotheken biete auch direkt vorbereite Tuning-Methoden, es lohnt sich also, nach diesen zu schauen.

**?? Wann ist eine Suchstrategie besser als die andere?**

**?? Wie finde ich heraus, welche Parameter "getuned" werden müssen**

# Genauigkeitsmetriken
- mit einer Genauigkeitsmetrik wird bestimmt, wie gut ein _Model_ "performt" hat.
Solche Metriken sind zum Beispiel:
     - Accuracy
     - AUC-Score
     - Kappa-Score

**?? Was bedeuten diese Metriken**