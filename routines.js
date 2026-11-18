/*
 * Routinen.
 * Eine neue Routine = ein neues Objekt in diesem Array.
 * `picto` verweist auf einen Schlüssel in pictograms.js.
 * Zeiten in Sekunden: prep = Vorlauf vor der ersten Übung,
 * hold = Haltezeit pro Übung, transition = Wechselzeit zwischen den Übungen.
 */
window.ROUTINES = [
  {
    id: 'morning',
    name: 'Morning Stretch',
    prep: 5,
    hold: 40,
    transition: 3,
    exercises: [
      { picto: 'toeTouch',  name: 'Zehen berühren',     cue: 'Stehend nach vorne beugen, Hände zu den Zehen.' },
      { picto: 'quad',      name: 'Oberschenkel',       cue: 'Stehend Knie anwinkeln, Fuß hinten greifen.' },
      { picto: 'calf',      name: 'Wade',               cue: 'Fußballen an die Wand, Ferse am Boden.' },
      { picto: 'adductor',  name: 'Innenschenkel',      cue: 'Ein Knie am Boden, anderes Bein seitlich gestreckt.' },
      { picto: 'hipFlexor', name: 'Becken',             cue: 'Ausfallschritt kniend, Hüfte nach vorne schieben.' },
      { picto: 'cobra',     name: 'Bauch',              cue: 'Bauchlage, mit den Händen vom Boden wegdrücken.' },
      { picto: 'rotation',  name: 'Rotation',           cue: 'Rückenlage, Bein überkreuzen, Kopf zur Gegenseite.' },
      { picto: 'lat',       name: 'Lat',                cue: 'Kniend, Ellenbogen auf der Box, Brust nach unten.' },
      { picto: 'chest',     name: 'Brust',              cue: 'Handtuch hinter dem Rücken, Arme auseinanderziehen.' },
      { picto: 'shoulder',  name: 'Schulter',           cue: 'Arm vor der Brust mit dem Unterarm heranziehen.' },
      { picto: 'neckSide',  name: 'Äußerer Nacken',     cue: 'Kopf zur Seite ziehen, anderer Arm hinter dem Rücken.' },
      { picto: 'neckBack',  name: 'Hinterer Nacken',    cue: 'Hände am Hinterkopf, Kopf nach unten drücken.' }
    ]
  }
];
