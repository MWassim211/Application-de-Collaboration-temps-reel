---
title: Rendu TP3 - TIW8
authors: Beldjillali Wassim, Leano-Martinet Michelle
...

## Instructions

Après le clonage du du dépot [git]( https://forge.univ-lyon1.fr/p1808195/tiw8-tp3.git ), deplacez vous au répertoire tiw8-tp3.

- Pour le lancement de l'application en **local** tapez les commandes suivantes: 
    * `npm install`
    * `npm run dev`

- Puis lancer http://localhost:3000

Vous pouvez voir le contenu de l'application déploye sur le lien suivant :  https://tiw8-chat.herokuapp.com/

## Spécificité du projet

- La page d'accueil nous dirige vers deux options:
    * **VideoChat :** Application du video et chat
        - Pour un fonctionnement optimal du VideoChat il est preferable d'utiliser Google Chrome.
        - Les buttons START STOP controllent la connection entre les deux utilisateurs on peut toujours se reconnecter
        - La fonctionnalite HangUp prends entre 5 et 6 secondes pour arreter l'appel (et le partage video) dans le remote. Car pour arreter l'appel, l'utilisateur local close sa MediaConnexion et le remote attends que le state du RTCpeerconnexion (attribut peerConnection de sa MediaConnexion) change a 'disconnect' dans la fonction **onconnectionstatechange**

    * **ChatDiscussion :** Application du chat
        - Les buttons START HANGUP controllent la connection entre les deux utilisateurs on peut toujours se reconnecter
        - La fonctionnalite HangUp coupe la connexion de deux cotes.
