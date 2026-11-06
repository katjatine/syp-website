// The map beside "One river, three countries" on About (lib/scheldt-map.js, scheldtCountries; Tine, file 63, option A):
// a soft colour band per country, and how the river is called there. Used by the block "map-and-text"
// (src/_includes/page-blocks/map-and-text.njk). Not in the browser editor: the places are coordinates.
// French and Dutch beside the English with _fr and _nl (Tine, file 88; lib/localize.js), missing ones stay English.
module.exports = {
  // What a screen reader hears instead of the drawing: the river's names and places, from source to sea
  label: "Map of the Scheldt from source to sea. In France it is called the Escaut: it rises at Gouy and flows past Valenciennes. In Belgium it is still the Escaut at Tournai, then the Schelde past Ghent and Antwerp. In the Netherlands it is the Westerschelde, past Vlissingen to the North Sea.",
  label_fr: "Carte de l'Escaut, de la source à la mer. En France, il prend sa source à Gouy et passe par Valenciennes. En Belgique, c'est encore l'Escaut à Tournai, puis la Schelde à Gand et à Anvers. Aux Pays-Bas, c'est la Westerschelde, qui passe par Flessingue jusqu'à la mer du Nord.",
  label_nl: "Kaart van de Schelde van de bron tot de zee. In Frankrijk heet ze de Escaut: ze ontspringt in Gouy en stroomt langs Valenciennes. In België is ze in Doornik nog de Escaut, daarna de Schelde langs Gent en Antwerpen. In Nederland is het de Westerschelde, langs Vlissingen naar de Noordzee.",
  sea: "North Sea",
  sea_fr: "Mer du Nord",
  sea_nl: "Noordzee",
  // top to bottom: from the sea to the source
  countries: [
    { name: "The Netherlands", name_fr: "Pays-Bas", name_nl: "Nederland", river: "the Westerschelde, to the sea", river_fr: "la Westerschelde, jusqu'à la mer", river_nl: "de Westerschelde, naar zee", tone: "pink" },
    { name: "Belgium", name_fr: "Belgique", name_nl: "België", river: "the Escaut, then the Schelde", river_fr: "l'Escaut, puis la Schelde", river_nl: "de Escaut, dan de Schelde", tone: "lime" },
    { name: "France", name_fr: "France", name_nl: "Frankrijk", river: "the Escaut, from its source", river_fr: "l'Escaut, depuis sa source", river_nl: "de Escaut, vanaf de bron", tone: "orange" },
  ],
  // where the river crosses into the next country, top first (as on the Scheldt page)
  borders: [[51.36, 4.25], [50.51, 3.45]],
  places: [
    { name: "Gouy (source)", name_nl: "Gouy (bron)", places: [[49.991, 3.264]] },
    { name: "Valenciennes", places: [[50.358, 3.523]] },
    { name: "Tournai", name_nl: "Doornik", places: [[50.607, 3.389]] },
    { name: "Ghent", name_fr: "Gand", name_nl: "Gent", places: [[51.054, 3.722]], anchor: "end" },
    { name: "Antwerp", name_fr: "Anvers", name_nl: "Antwerpen", places: [[51.22, 4.40]] },
    { name: "Vlissingen", name_fr: "Flessingue", places: [[51.44, 3.57]], anchor: "middle", dy: -6 },
  ],
};
