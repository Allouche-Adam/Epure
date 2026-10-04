// Épure - translations (English, French, Spanish).
//
// Every piece of text the user sees lives here, never directly in the HTML or in app.js.
// In the HTML, an element says which text it wants with data-text="key" (see translatePage below).
// In app.js, text is fetched with t('key').
// To add a language: copy the "en" block, translate the values, and add an <option> in index.html.

const TRANSLATIONS = {
  // ---------- English ----------
  en: {
    // Header
    headerLocal: "Runs locally. Nothing is sent.",
    backHome: "Back to home",
    feedback: "Feedback",

    // Hero
    heroEyebrow: "Password export cleaner",
    heroTitleLine1: "Messy passwords,",
    heroTitleLine2: "wiped clean.",
    heroText: "Drop your browser's password export. Epure spots duplicates, weak and reused passwords, and hands you back a clean file. Nothing leaves your device.",
    chooseFile: "Choose a CSV file",
    trySample: "Try with sample data",
    heroNote: "Works with Chrome, Edge, Firefox and Brave exports.",

    // Home page sections
    pillOffline: "Works offline",
    pillNoAccount: "No account",
    pillUndo: "Undo any step",
    step1Title: "Drop your file",
    step1Text: "Export your passwords from your browser as a CSV and drop it here.",
    step2Title: "Review and clean",
    step2Text: "See duplicates, weak and reused passwords. Remove a site in one click.",
    step3Title: "Export a clean file",
    step3Text: "Download the result and import it back wherever you want.",
    trustTitle: "Private by design",
    trustText: "Everything runs on your device. No account, no upload, no tracking. Open your browser's Network tab and check.",

    // Import card
    importTitle: "Import a file",
    dropTitle: "Drop your CSV file here",
    plainTextWarning: "The CSV contains passwords in plain text. Delete the exported and cleaned files when you are done.",
    noFileAtHand: "No file at hand?",
    sampleBanner: "You are looking at sample data. Every entry is fake.",

    // Sidebar
    summaryTitle: "Summary",
    statEntries: "Entries",
    statDuplicates: "Duplicates",
    statWeak: "Weak passwords",
    statReused: "Reused passwords",
    statEmpty: "Empty entries",
    topSitesTitle: "Top sites",
    noSite: "(no site)",

    // Clean up tools
    cleanUpTitle: "Clean up",
    removeSiteTitle: "Remove a site",
    removeSiteText: "Removes every entry of a domain, subdomains included.",
    siteExample: "example.com",
    matchCount: "Matches: {count}",
    remove: "Remove",
    removeDuplicatesTitle: "Remove duplicates",
    removeDuplicatesText: "Same site, username and password. The first one is kept.",
    removeEmptyTitle: "Remove empty entries",
    removeEmptyText: "Entries without a password.",
    addEntryTitle: "Add an entry",
    editEntryTitle: "Edit entry",
    addEntryText: "Add a missing entry, or click Edit on any row to change it.",
    sitePlaceholder: "Site (example.com)",
    add: "Add",
    save: "Save",
    cancel: "Cancel",
    restoreTitle: "Restore original",
    restoreText: "Brings back every entry from the file you imported.",
    restore: "Restore",
    exportTitle: "Export",
    exportText: "Downloads the cleaned CSV. Your original file is not changed.",
    exportButton: "Export CSV",

    // Entries table
    entriesTitle: "Entries",
    searchPlaceholder: "Search a site or username",
    removeSelection: "Remove selection",
    selectAll: "Select all",
    columnSite: "Site",
    columnUsername: "Username",
    columnPassword: "Password",
    columnStatus: "Status",
    show: "Show",
    hide: "Hide",
    edit: "Edit",
    filterAll: "All",
    filterDuplicates: "Duplicates",
    filterWeak: "Weak",
    filterReused: "Reused",
    filterEmpty: "Empty",
    noEntries: "No entries to show.",
    tableCap: "Showing the first {shown} of {total} entries. Use search to narrow down.",

    // Messages after an action ({count} etc. are replaced by real values)
    undo: "Undo",
    msgImported: "Entries imported: {count}.",
    msgBadFile: "Empty or unreadable file.",
    msgColumnsNotFound: "Columns not found. Headers read: {headers}",
    msgSiteRemoved: "Removed for {site}: {count}.",
    msgDuplicatesRemoved: "Duplicates removed: {count}.",
    msgNoDuplicates: "No duplicates found.",
    msgEmptyRemoved: "Empty entries removed: {count}.",
    msgNoEmpty: "No empty entries.",
    msgSelectionRemoved: "Entries removed: {count}.",
    msgUndone: "Action undone.",
    msgExported: "Entries exported: {count}.",
    msgRestored: "Original file restored.",
    msgAdded: "Entry added for {site}.",
    msgEdited: "Entry updated for {site}.",
    msgSiteAndPasswordNeeded: "Enter at least a site and a password.",
    confirmGoHome: "Go back home? Imported data and changes will be cleared.",

    // Feedback card (after export)
    feedbackCardTitle: "Your clean file is ready.",
    feedbackCardText: "Got a minute? Tell me what you thought, it really helps.",
    giveFeedback: "Give feedback",
    close: "Close",
  },

  // ---------- French ----------
  fr: {
    // Header
    headerLocal: "Traitement local. Rien n'est envoyé.",
    backHome: "Retour à l'accueil",
    feedback: "Avis",

    // Hero
    heroEyebrow: "Nettoyeur de mots de passe",
    heroTitleLine1: "Mots de passe en vrac,",
    heroTitleLine2: "remis au propre.",
    heroText: "Dépose l'export de mots de passe de ton navigateur. Epure repère les doublons, les mots de passe faibles et réutilisés, et te rend un fichier propre. Rien ne quitte ton appareil.",
    chooseFile: "Choisir un fichier CSV",
    trySample: "Essayer avec des données d'exemple",
    heroNote: "Compatible avec les exports de Chrome, Edge, Firefox et Brave.",

    // Home page sections
    pillOffline: "Fonctionne hors ligne",
    pillNoAccount: "Sans compte",
    pillUndo: "Chaque étape est annulable",
    step1Title: "Dépose ton fichier",
    step1Text: "Exporte tes mots de passe depuis ton navigateur en CSV et dépose-le ici.",
    step2Title: "Vérifie et nettoie",
    step2Text: "Repère les doublons, les mots de passe faibles et réutilisés. Supprime un site en un clic.",
    step3Title: "Exporte un fichier propre",
    step3Text: "Télécharge le résultat et réimporte-le où tu veux.",
    trustTitle: "Privé par conception",
    trustText: "Tout se passe sur ton appareil. Pas de compte, pas d'envoi, pas de suivi. Ouvre l'onglet Réseau de ton navigateur et vérifie.",

    // Import card
    importTitle: "Importer un fichier",
    dropTitle: "Dépose ton fichier CSV ici",
    plainTextWarning: "Le CSV contient des mots de passe en clair. Supprime le fichier exporté et le fichier nettoyé une fois terminé.",
    noFileAtHand: "Pas de fichier sous la main ?",
    sampleBanner: "Tu regardes des données d'exemple. Toutes les entrées sont fausses.",

    // Sidebar
    summaryTitle: "Résumé",
    statEntries: "Entrées",
    statDuplicates: "Doublons",
    statWeak: "Mots de passe faibles",
    statReused: "Mots de passe réutilisés",
    statEmpty: "Entrées vides",
    topSitesTitle: "Sites fréquents",
    noSite: "(sans site)",

    // Clean up tools
    cleanUpTitle: "Nettoyage",
    removeSiteTitle: "Supprimer un site",
    removeSiteText: "Retire toutes les entrées d'un domaine, sous-domaines inclus.",
    siteExample: "exemple.com",
    matchCount: "Correspondances : {count}",
    remove: "Supprimer",
    removeDuplicatesTitle: "Supprimer les doublons",
    removeDuplicatesText: "Même site, identifiant et mot de passe. Le premier est conservé.",
    removeEmptyTitle: "Supprimer les entrées vides",
    removeEmptyText: "Entrées sans mot de passe.",
    addEntryTitle: "Ajouter une entrée",
    editEntryTitle: "Modifier l'entrée",
    addEntryText: "Ajoute une entrée manquante, ou clique sur Modifier sur une ligne pour la changer.",
    sitePlaceholder: "Site (exemple.com)",
    add: "Ajouter",
    save: "Enregistrer",
    cancel: "Annuler",
    restoreTitle: "Restaurer l'original",
    restoreText: "Récupère toutes les entrées du fichier importé.",
    restore: "Restaurer",
    exportTitle: "Exporter",
    exportText: "Télécharge le CSV nettoyé. Ton fichier d'origine n'est pas modifié.",
    exportButton: "Exporter le CSV",

    // Entries table
    entriesTitle: "Entrées",
    searchPlaceholder: "Rechercher un site ou un identifiant",
    removeSelection: "Supprimer la sélection",
    selectAll: "Tout sélectionner",
    columnSite: "Site",
    columnUsername: "Identifiant",
    columnPassword: "Mot de passe",
    columnStatus: "Statut",
    show: "Afficher",
    hide: "Masquer",
    edit: "Modifier",
    filterAll: "Tous",
    filterDuplicates: "Doublons",
    filterWeak: "Faibles",
    filterReused: "Réutilisés",
    filterEmpty: "Vides",
    noEntries: "Aucune entrée à afficher.",
    tableCap: "Affichage des {shown} premières entrées sur {total}. Utilise la recherche pour affiner.",

    // Messages after an action ({count} etc. are replaced by real values)
    undo: "Annuler",
    msgImported: "Entrées importées : {count}.",
    msgBadFile: "Fichier vide ou illisible.",
    msgColumnsNotFound: "Colonnes introuvables. En-têtes lus : {headers}",
    msgSiteRemoved: "Supprimées pour {site} : {count}.",
    msgDuplicatesRemoved: "Doublons supprimés : {count}.",
    msgNoDuplicates: "Aucun doublon trouvé.",
    msgEmptyRemoved: "Entrées vides supprimées : {count}.",
    msgNoEmpty: "Aucune entrée vide.",
    msgSelectionRemoved: "Entrées supprimées : {count}.",
    msgUndone: "Action annulée.",
    msgExported: "Entrées exportées : {count}.",
    msgRestored: "Fichier d'origine restauré.",
    msgAdded: "Entrée ajoutée pour {site}.",
    msgEdited: "Entrée modifiée pour {site}.",
    msgSiteAndPasswordNeeded: "Indique au moins un site et un mot de passe.",
    confirmGoHome: "Retourner à l'accueil ? Les données importées et les modifications seront effacées.",

    // Feedback card (after export)
    feedbackCardTitle: "Ton fichier propre est prêt.",
    feedbackCardText: "Une minute ? Dis-moi ce que tu en as pensé, ça aide beaucoup.",
    giveFeedback: "Donner mon avis",
    close: "Fermer",
  },

  // ---------- Spanish ----------
  es: {
    // Header
    headerLocal: "Se ejecuta en local. No se envía nada.",
    backHome: "Volver al inicio",
    feedback: "Opinión",

    // Hero
    heroEyebrow: "Limpiador de contraseñas",
    heroTitleLine1: "Contraseñas desordenadas,",
    heroTitleLine2: "por fin limpias.",
    heroText: "Suelta el archivo de contraseñas exportado de tu navegador. Epure detecta duplicados y contraseñas débiles o reutilizadas, y te devuelve un archivo limpio. Nada sale de tu dispositivo.",
    chooseFile: "Elegir un archivo CSV",
    trySample: "Probar con datos de ejemplo",
    heroNote: "Funciona con exportaciones de Chrome, Edge, Firefox y Brave.",

    // Home page sections
    pillOffline: "Funciona sin conexión",
    pillNoAccount: "Sin cuenta",
    pillUndo: "Cada paso se puede deshacer",
    step1Title: "Suelta tu archivo",
    step1Text: "Exporta tus contraseñas del navegador en CSV y suéltalo aquí.",
    step2Title: "Revisa y limpia",
    step2Text: "Mira duplicados y contraseñas débiles o reutilizadas. Elimina un sitio con un clic.",
    step3Title: "Exporta un archivo limpio",
    step3Text: "Descarga el resultado e impórtalo donde quieras.",
    trustTitle: "Privado por diseño",
    trustText: "Todo ocurre en tu dispositivo. Sin cuenta, sin subidas, sin rastreo. Abre la pestaña Red de tu navegador y compruébalo.",

    // Import card
    importTitle: "Importar un archivo",
    dropTitle: "Suelta aquí tu archivo CSV",
    plainTextWarning: "El CSV contiene contraseñas en texto plano. Borra el archivo exportado y el limpio cuando termines.",
    noFileAtHand: "¿No tienes un archivo a mano?",
    sampleBanner: "Estás viendo datos de ejemplo. Todas las entradas son falsas.",

    // Sidebar
    summaryTitle: "Resumen",
    statEntries: "Entradas",
    statDuplicates: "Duplicados",
    statWeak: "Contraseñas débiles",
    statReused: "Contraseñas reutilizadas",
    statEmpty: "Entradas vacías",
    topSitesTitle: "Sitios frecuentes",
    noSite: "(sin sitio)",

    // Clean up tools
    cleanUpTitle: "Limpieza",
    removeSiteTitle: "Eliminar un sitio",
    removeSiteText: "Quita todas las entradas de un dominio, subdominios incluidos.",
    siteExample: "ejemplo.com",
    matchCount: "Coincidencias: {count}",
    remove: "Eliminar",
    removeDuplicatesTitle: "Eliminar duplicados",
    removeDuplicatesText: "Mismo sitio, usuario y contraseña. Se conserva el primero.",
    removeEmptyTitle: "Eliminar entradas vacías",
    removeEmptyText: "Entradas sin contraseña.",
    addEntryTitle: "Añadir una entrada",
    editEntryTitle: "Editar entrada",
    addEntryText: "Añade una entrada que falte, o pulsa Editar en una fila para cambiarla.",
    sitePlaceholder: "Sitio (ejemplo.com)",
    add: "Añadir",
    save: "Guardar",
    cancel: "Cancelar",
    restoreTitle: "Restaurar original",
    restoreText: "Recupera todas las entradas del archivo importado.",
    restore: "Restaurar",
    exportTitle: "Exportar",
    exportText: "Descarga el CSV limpio. Tu archivo original no se modifica.",
    exportButton: "Exportar CSV",

    // Entries table
    entriesTitle: "Entradas",
    searchPlaceholder: "Buscar un sitio o usuario",
    removeSelection: "Eliminar selección",
    selectAll: "Seleccionar todo",
    columnSite: "Sitio",
    columnUsername: "Usuario",
    columnPassword: "Contraseña",
    columnStatus: "Estado",
    show: "Mostrar",
    hide: "Ocultar",
    edit: "Editar",
    filterAll: "Todas",
    filterDuplicates: "Duplicados",
    filterWeak: "Débiles",
    filterReused: "Reutilizadas",
    filterEmpty: "Vacías",
    noEntries: "No hay entradas que mostrar.",
    tableCap: "Mostrando las primeras {shown} de {total} entradas. Usa la búsqueda para acotar.",

    // Messages after an action ({count} etc. are replaced by real values)
    undo: "Deshacer",
    msgImported: "Entradas importadas: {count}.",
    msgBadFile: "Archivo vacío o ilegible.",
    msgColumnsNotFound: "No se encontraron columnas. Encabezados leídos: {headers}",
    msgSiteRemoved: "Eliminadas para {site}: {count}.",
    msgDuplicatesRemoved: "Duplicados eliminados: {count}.",
    msgNoDuplicates: "No se encontraron duplicados.",
    msgEmptyRemoved: "Entradas vacías eliminadas: {count}.",
    msgNoEmpty: "No hay entradas vacías.",
    msgSelectionRemoved: "Entradas eliminadas: {count}.",
    msgUndone: "Acción deshecha.",
    msgExported: "Entradas exportadas: {count}.",
    msgRestored: "Archivo original restaurado.",
    msgAdded: "Entrada añadida para {site}.",
    msgEdited: "Entrada actualizada para {site}.",
    msgSiteAndPasswordNeeded: "Escribe al menos un sitio y una contraseña.",
    confirmGoHome: "¿Volver al inicio? Se borrarán los datos importados y los cambios.",

    // Feedback card (after export)
    feedbackCardTitle: "Tu archivo limpio está listo.",
    feedbackCardText: "¿Tienes un minuto? Cuéntame qué te pareció, ayuda mucho.",
    giveFeedback: "Dar mi opinión",
    close: "Cerrar",
  },
};

// The language currently shown. Changed by setLanguage() in app.js.
let currentLanguage = 'en';

/**
 * Returns the text for a key in the current language.
 * Falls back to English if a translation is missing.
 * Placeholders like {count} are replaced with values: t('msgImported', { count: 12 }) -> "Entries imported: 12."
 */
function t(key, values = {}) {
  const text = TRANSLATIONS[currentLanguage][key] ?? TRANSLATIONS.en[key];
  return text.replace(/\{(\w+)\}/g, (placeholder, name) => values[name]);
}

/**
 * Picks the language to show on first load:
 * 1. the one the user chose last time (saved in localStorage),
 * 2. otherwise the first browser language we support,
 * 3. otherwise English.
 */
function detectLanguage() {
  let saved = null;
  try {
    saved = localStorage.getItem('lang'); // can throw in private mode or when storage is blocked
  } catch (error) {}
  if (TRANSLATIONS[saved]) return saved;

  for (const browserLanguage of navigator.languages || [navigator.language]) {
    const code = (browserLanguage || '').slice(0, 2).toLowerCase(); // "fr-FR" -> "fr"
    if (TRANSLATIONS[code]) return code;
  }
  return 'en';
}

/** Fills every element that has a data-text, data-placeholder or data-aria-label attribute. */
function translatePage() {
  document.querySelectorAll('[data-text]').forEach(element => {
    element.textContent = t(element.dataset.text);
  });
  document.querySelectorAll('[data-placeholder]').forEach(element => {
    element.placeholder = t(element.dataset.placeholder);
  });
  document.querySelectorAll('[data-aria-label]').forEach(element => {
    element.setAttribute('aria-label', t(element.dataset.ariaLabel));
  });
}
