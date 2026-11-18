/*
 * Routinen.
 * Eine neue Routine = ein neues Objekt in diesem Array.
 * `picto` verweist auf einen Schlüssel in pictograms.js.
 * Zeiten in Sekunden: prep = Vorlauf vor der ersten Übung,
 * hold = Haltezeit pro Übung, transition = Wechselzeit zwischen den Übungen
 * und beim Seitenwechsel. Übungen mit `sides: true` werden pro Seite
 * sideHold Sekunden gehalten (Glocke + Seitenwechsel dazwischen).
 */
window.ROUTINES = [
  {
    id: 'morning',
    name: 'Morning Stretch',
    prep: 5,
    hold: 40,
    sideHold: 30,
    transition: 3,
    exercises: [
      { picto: 'toeTouch',                name: 'Zehen berühren',    cue: 'Stehend nach vorne beugen, Hände zu den Zehen.' },
      { picto: 'quad',       sides: true, name: 'Oberschenkel',      cue: 'Stehend Knie anwinkeln, Fuß hinten greifen.' },
      { picto: 'calf',       sides: true, name: 'Wade',              cue: 'Fußballen an die Wand, Ferse am Boden.' },
      { picto: 'adductor',   sides: true, name: 'Innenschenkel',     cue: 'Ein Knie am Boden, anderes Bein seitlich gestreckt.' },
      { picto: 'hipFlexor',  sides: true, name: 'Becken',            cue: 'Ausfallschritt kniend, Hüfte nach vorne schieben.' },
      { picto: 'cobra',                   name: 'Bauch',             cue: 'Bauchlage, mit den Händen vom Boden wegdrücken.' },
      { picto: 'rotation',   sides: true, name: 'Rotation',          cue: 'Rückenlage, Bein überkreuzen, Kopf zur Gegenseite.' },
      { picto: 'lat',                     name: 'Lat',               cue: 'Kniend, Ellenbogen auf der Box, Brust nach unten.' },
      { picto: 'chest',                   name: 'Brust',             cue: 'Handtuch hinter dem Rücken, Arme auseinanderziehen.' },
      { picto: 'shoulder',   sides: true, name: 'Schulter',          cue: 'Arm vor der Brust mit dem Unterarm heranziehen.' },
      { picto: 'neckSide',   sides: true, name: 'Äußerer Nacken',    cue: 'Kopf zur Seite ziehen, anderer Arm hinter dem Rücken.' },
      { picto: 'neckBack',                name: 'Hinterer Nacken',   cue: 'Hände am Hinterkopf, Kopf nach unten drücken.' }
    ]
  }
];
