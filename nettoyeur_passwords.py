#!/usr/bin/env python3
"""
Nettoyeur de CSV de mots de passe (export Chrome / Edge / Firefox / Brave).

Exemples :
  python nettoyeur_passwords.py passwords.csv --stats
  python nettoyeur_passwords.py passwords.csv --supprimer-site facebook.com
  python nettoyeur_passwords.py passwords.csv --doublons
  python nettoyeur_passwords.py passwords.csv --faibles --vides
  python nettoyeur_passwords.py passwords.csv --supprimer-site facebook.com --doublons --vides -o propre.csv

Rien n'est modifié sur le fichier d'origine : le résultat va dans un nouveau fichier.
"""
import argparse
import csv
import sys
from collections import Counter
from urllib.parse import urlparse

# Noms de colonnes selon le navigateur
URL_KEYS = ("url", "login_uri", "origin", "hostname", "website")
USER_KEYS = ("username", "login_username", "user", "login")
PASS_KEYS = ("password", "login_password", "pass")


def trouver_colonne(headers, candidats):
    bas = {h.lower().strip(): h for h in headers}
    for c in candidats:
        if c in bas:
            return bas[c]
    return None


def domaine(url):
    """Extrait le domaine propre d'une URL (sans www., sans port)."""
    url = (url or "").strip()
    if not url:
        return ""
    if "://" not in url:
        url = "https://" + url
    host = urlparse(url).hostname or ""
    return host.lower().removeprefix("www.")


def correspond_site(url, site):
    """True si l'URL appartient au site (sous-domaines inclus)."""
    d = domaine(url)
    site = site.lower().removeprefix("www.")
    return d == site or d.endswith("." + site)


def est_faible(mdp):
    if len(mdp) < 8:
        return True
    communs = {"password", "motdepasse", "azerty", "qwerty", "123456", "12345678",
               "123456789", "000000", "111111", "admin", "azerty123", "password1"}
    if mdp.lower() in communs:
        return True
    types = sum([any(c.islower() for c in mdp), any(c.isupper() for c in mdp),
                 any(c.isdigit() for c in mdp), any(not c.isalnum() for c in mdp)])
    return types < 2


def charger(chemin):
    with open(chemin, newline="", encoding="utf-8-sig") as f:
        lecteur = csv.DictReader(f)
        return lecteur.fieldnames, list(lecteur)


def sauver(chemin, headers, lignes):
    with open(chemin, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=headers)
        w.writeheader()
        w.writerows(lignes)


def main():
    p = argparse.ArgumentParser(description="Nettoie un CSV de mots de passe.")
    p.add_argument("fichier", help="CSV exporté depuis le navigateur")
    p.add_argument("-o", "--sortie", help="fichier de sortie (défaut: <nom>_propre.csv)")
    p.add_argument("--supprimer-site", action="append", default=[], metavar="DOMAINE",
                   help="supprime toutes les entrées de ce site (répétable)")
    p.add_argument("--doublons", action="store_true",
                   help="supprime les doublons (même domaine + identifiant + mot de passe)")
    p.add_argument("--vides", action="store_true",
                   help="supprime les entrées sans mot de passe")
    p.add_argument("--faibles", action="store_true",
                   help="affiche la liste des mots de passe faibles (ne supprime pas)")
    p.add_argument("--reutilises", action="store_true",
                   help="affiche les mots de passe réutilisés sur plusieurs sites")
    p.add_argument("--stats", action="store_true", help="affiche des statistiques et quitte")
    args = p.parse_args()

    headers, lignes = charger(args.fichier)
    if not headers:
        sys.exit("CSV vide ou illisible.")

    c_url = trouver_colonne(headers, URL_KEYS)
    c_user = trouver_colonne(headers, USER_KEYS)
    c_pass = trouver_colonne(headers, PASS_KEYS)
    if not (c_url and c_pass):
        sys.exit(f"Colonnes introuvables. En-têtes du fichier : {headers}")

    total = len(lignes)
    print(f"{total} entrées chargées.")

    # --- Stats ---
    if args.stats:
        par_site = Counter(domaine(l[c_url]) for l in lignes)
        print("\nTop 15 des sites :")
        for site, n in par_site.most_common(15):
            print(f"  {n:4d}  {site}")
        return

    # --- Rapports (lecture seule) ---
    if args.faibles:
        print("\nMots de passe faibles :")
        for l in lignes:
            if l[c_pass] and est_faible(l[c_pass]):
                print(f"  {domaine(l[c_url])}  ({l.get(c_user, '')})")

    if args.reutilises:
        usage = {}
        for l in lignes:
            if l[c_pass]:
                usage.setdefault(l[c_pass], set()).add(domaine(l[c_url]))
        print("\nMots de passe réutilisés :")
        for sites in usage.values():
            if len(sites) > 1:
                print(f"  utilisé sur {len(sites)} sites : {', '.join(sorted(sites))}")

    # --- Nettoyage ---
    resultat = lignes

    for site in args.supprimer_site:
        avant = len(resultat)
        resultat = [l for l in resultat if not correspond_site(l[c_url], site)]
        print(f"Site '{site}' : {avant - len(resultat)} entrée(s) supprimée(s).")

    if args.vides:
        avant = len(resultat)
        resultat = [l for l in resultat if (l[c_pass] or "").strip()]
        print(f"Entrées vides : {avant - len(resultat)} supprimée(s).")

    if args.doublons:
        vus, uniques = set(), []
        for l in resultat:
            cle = (domaine(l[c_url]), (l.get(c_user) or "").lower(), l[c_pass])
            if cle not in vus:
                vus.add(cle)
                uniques.append(l)
        print(f"Doublons : {len(resultat) - len(uniques)} supprimé(s).")
        resultat = uniques

    if args.supprimer_site or args.vides or args.doublons:
        sortie = args.sortie or args.fichier.rsplit(".", 1)[0] + "_propre.csv"
        sauver(sortie, headers, resultat)
        print(f"\n{len(resultat)} entrées restantes -> {sortie}")
        print("Rappel : ce fichier contient des mots de passe EN CLAIR. "
              "Importe-le dans ton gestionnaire puis supprime-le (et vide la corbeille).")


if __name__ == "__main__":
    main()
