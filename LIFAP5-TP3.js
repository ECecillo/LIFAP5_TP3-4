/* eslint-disable no-unused-vars */
////////////////////////////////////////////////////////////////////////////////
// données exemple, qui seront remplacées par des données chargées dynamiquement
////////////////////////////////////////////////////////////////////////////////

const baseUrl =
  'https://perso.liris.cnrs.fr/romuald.thion/files/Enseignement/LIFAP5/TP3';
const nouvellesUrl = `${baseUrl}/nouvelles.json`;
const annuaireUrl = `${baseUrl}/annuaire.json`;

////////////////////////////////////////////////////////////////////////////////
// Fonctions de RENDU : génération de HTML à partir des données des nouvelles :
// mises en forme de titre, de liste de nouvelle, génération de liste d'années
////////////////////////////////////////////////////////////////////////////////

// transforme une nouvelle en un item HTML à partir de son titre et de sa date
function formate_titre(nouvelle) {
  return `<li>${nouvelle.date}: ${nouvelle.titre}</li>`;
}

// transforme une liste de nouvelles en une énumération HTML
function liste_nouvelles_html(nouvelles) {
  const nouvelles_html = nouvelles.map(formate_titre).join("\n");
  return `<ul>\n${nouvelles_html}</ul>\n`;
}

// transforme une liste de valeur en un liste (pour les select HTML)
// prettier-ignore
function liste_to_options(valeurs) {
  /* /!\ TODO REECRIRE CETTE FONCTION avec map, join, des templates literal uniquement avec des const sans for*/
  
  let str = "";
  for ( var i = 0; i < valeurs.length; i++) {
    str += `<option value="${valeurs[i]} ${(i === 0) ? 'selected="true"' : ''}>
    ${valeurs[i]}
    </option>`;
  }
  return str;

  /*
   autre façon d'écrire la fonction en fonctionnel 
  const transform = (x, i) => {
    `<option value="${x} ${(i === 0) ? 'selected="true"' : ''}>
    ${x}
    </option>`;
  }
  return return valeurs.map(transform).join('\n');
  */
}

////////////////////////////////////////////////////////////////////////////////
// Fonctions outils et manipulation de liste de nouvelles
////////////////////////////////////////////////////////////////////////////////

function elimine_doublons_trie(liste) {
  /* /!\ TODO EXPLIQUER ce que fait cette fonction*/
  const asSet = new Set(liste);
  let asTab = Array.from(asSet.values());
  asTab.sort();
  return asTab;
}
// Explication : asSet est un objet créer à partir de liste, asTab est un tableau qui contient pour chaque case un objet de asSet.
// asTab est ensuite trié avec sort dans un ordre croissant suivant l'UNICODE des éléments.

// trie une liste de nouvelles par date (selon l'ordre lexicographique)
function trie_articles_date(nouvelles) {
  const res = Array.from(nouvelles);
  res.sort((n1, n2) => (n1.date < n2.date ? 1 : n1.date > n2.date ? -1 : 0));
  return res;
}

// extrait la liste des années d'une liste de nouvelles (sans doublons)
function annees(nouvelles) {
  return elimine_doublons_trie(
    nouvelles.map(n => new Date(n.date)).map(d => d.getFullYear())
  );
}

function mois_de_annee(nouvelles, annee) {
  /* /!\ TODO EXPLIQUER ce que fait cette fonction*/
  const nAnnee = Number(annee);
  let filtered = nouvelles
    .map(n => new Date(n.date))
    .filter(d => d.getFullYear() === nAnnee)
    .map(d => d.getMonth() + 1);
  return elimine_doublons_trie(filtered);
}
// Explication : nAnnee est le résultat de la conversion du string annee en Number.
// filtered est le résulat de plusieurs fonctions :
// 1 - pour chaque élément de l'objet nouvelle qui a pour nom de variable 'date' on créer un objet de type Date
// 2 - on filtre ensuite ce nouvelle objet pour avoir que l'annee et ça renvoie un tableau où l'annee est la même que nAnnee.
// 3 - on rajoute 1 à chaque mois dans le tableau pour que lors de l'affichage avec la liste on ait de 1 à 12 et pas de 0 à 11.
// 4 - On applique au tableau la fonction elimine_doublon qui enlève les doublons.

// filtre une liste de nouvelle à celles qui ont l'année ET le mois passés en paramètres
function filtre_mois_annee(nouvelles, mois, annee) {
  const nAnnee = Number(annee);
  const nMois = Number(mois);
  let filtered = nouvelles
    .filter(n => new Date(n.date).getFullYear() === nAnnee)
    .filter(n => new Date(n.date).getMonth() + 1 === nMois);
  return filtered;
}

////////////////////////////////////////////////////////////////////////////////
// Fonctions de génération et de mises à jour d'interface HTML
////////////////////////////////////////////////////////////////////////////////

function maj_liste_nouvelles(nouvelles, mois, annee) {
  console.debug(`CALL maj_liste_nouvelles([${nouvelles}],${mois},${annee})`);
  const filtrees = filtre_mois_annee(nouvelles, mois, annee);
  const liste_html = liste_nouvelles_html(filtrees);
  document.getElementById("elt-nouvelles").innerHTML = liste_html;
}

function maj_annees(nouvelles) {
  /* /!\ TODO EXPLIQUER ce que fait cette fonction*/
  console.debug(`CALL maj_annees([${nouvelles}])`);
  const annee_html = liste_to_options(annees(nouvelles));
  document.getElementById("select-annee").innerHTML = annee_html;
}
// Explication : Va afficher dans la console le type des valeurs dans nouvelles (pour donnes_exemple on a [object Object] x5 , par exemple).
// dans annee_html on met un message avec :
// <option value=\"2016\"selected=\"true\">2016</option> <option value=\"2017\">2017</option> (exemple avec donnees exemple).

// cela nous renvoie cette chaine de caractères (qui est un code html) où on récupère les années que l'on met deans l'ordre croissant et on supprime également les doublons.
// Enfin on met ce code dans l'élément html qui a pour ID select annee. Ce qui nous donne une liste déroulante de date.

// fonction pour générer le contenu de la liste des mois d'une année donnée
function maj_mois(nouvelles, annee) {
  console.debug(`CALL maj_mois([${nouvelles}, ${annee}])`);
  /* /!\ TODO MODIFIER CETTE FONCTION */
  const select = document.getElementById("select-mois");
  select.innerHTML = `
  <option value="1" selected="true">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
  <option value="8">8</option>
  <option value="9">9</option>
  <option value="10">10</option>
  <option value="11">11</option>
  <option value="12">12</option>`;
  maj_liste_nouvelles(nouvelles, select.value, annee);
}

function change_annee(nouvelles) {
  /* /!\ TODO EXPLIQUER ce que fait cette fonction*/
  console.debug(`CALL change_annee()`);
  const annee = document.getElementById("select-annee").value;
  maj_mois(trie_articles_date(nouvelles), annee);
}
// Explication : 1 - écrit dans le terminale CALL change_annee
//  2 - annee prend la valeur contenu dans l'élément avec l'id "select-annee".
//  3 - (Rappel : trie_article_date trie les dates d'un objet dans l'ordre croissant et renvoie ce dernier trié),
//  Dans la console on aura `CALL maj_mois[[object Object] x5 fois, (2016,2017))` les valeurs de la page avec l'idee select-annee,
//  Ensuite on va généré un code html avec des numéros associés à des dates que l'on va mettre dans un élément avec un id elt-nouvelles.
// En gros on va mettre à jour les données qui sont dans select-annee et dans init menu en fonction des années on va mettre les données dans les cases de select-mois.

// fonction appellée lorsqu'on change la liste des mois
function change_mois(nouvelles) {
  console.debug(`CALL change_mois()`);
  const mois = document.getElementById("select-mois").value;
  const annee = document.getElementById("select-annee").value;
  maj_liste_nouvelles(trie_articles_date(nouvelles), mois, annee);
}

// prend une liste d'ID HTML id_contenus et les rens invisibles sur la page
// puis rend visible l'ID id_contenu_a_afficher (s'il existe)
function masque_affiche_contenus(id_contenus, id_contenu_a_afficher) {
  console.debug(
    `CALL masque_affiche_contenus([${id_contenus}],${id_contenu_a_afficher})`
  );
  id_contenus.map(function(idc) {
    document.getElementById(idc).style.display = "none";
  });
  if (id_contenu_a_afficher !== undefined)
    document.getElementById(id_contenu_a_afficher).style.display = "block";
}

// Fonction principale appelée pour générer les menus HTML
function init_menus() {
  console.debug(`CALL init_menus()`);
  const eltNouvelles = document.getElementById('elt-nouvelles');
  fetch(nouvellesUrl)
    .then((response) => response.json())
    .then((nouvelles) => {
      eltNouvelles.innerHTML = liste_nouvelles_html(nouvelles);
      maj_annees(nouvelles);
      document.getElementById('select-annee').onchange = () => change_annee(nouvelles);
      // /!\ Si on met .onchange = change_annee(nouvelles) c'est KO /!\ 
      document.getElementById('select-mois').onchange = () => change_mois(nouvelles);
      // /!\ Pareil ! /!\
      change_annee(nouvelles); 
    });
}


////////////////////////////////////////////////////////////////////////////////
// Code permettant d'utiliser les fonctions ci-dessus dans la page LIFAP5-TP3.html
////////////////////////////////////////////////////////////////////////////////
/* 
document.addEventListener(
  "DOMContentLoaded",
  function() {
    // garde pour ne pas exécuter dans la page des tests unitaires.
    if (document.getElementById("title-test-tp3") == null) {
      document.getElementById("elt-nouvelles").innerHTML = liste_nouvelles_html(
        nouvelles
      );
      init_menus();
    }
  },
  false
);
 */