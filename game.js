// faire les getlemeentId querySlector à l'initiation du jeu pour les avoir
// dans  toutes les fonctions ; idem const
// function sjuffle a revoir
// provlème quand joueur doit couper, NA value> gagne au lieu atout
// afficher info (score att)
// ---------------------GAME--------------------------
class Card {
    constructor(val, clr){
        this.value = val
        this.color = clr
    }
}
class Player {
    constructor(name){
        this.name = name
        this.hand = []
        this.hasBet = false
        this.hasTaken = false
        this.roundWon = false
        this.pliWon = []
    }
}

function startGame(){
    nbJoueurs = 4
    listeJoueurs = loadPlayers(nbJoueurs)
    deckCards = createDeck()
    console.log("Before shuffle:", JSON.parse(JSON.stringify(deckCards)))
    deckCards = shuffleDeck(deckCards)
    console.log("After shuffle:", deckCards)
    chien = dealCards(deckCards, listeJoueurs)
    console.log("Chien:", chien)

    setZonePlayer()
    startEnchere(listeJoueurs)

}
function createDeck(){
    let deck = []
    colors.forEach(color => {
        values.forEach(value =>{
            deck.push(new Card(value, color)) 
        })
    })
    valuesAtout.forEach(value =>{
        deck.push(new Card(value, "Atout"))          
    })   
    return deck
}
function loadPlayers(nb){
    const players = []
    for (let i = 0; i < nb; i++){
        players.push(new Player(`Joueur ${i+1}`))
    }
    return players
}
const shuffleDeck = (deck) => deck.sort(() => Math.random() - 0.5)

function dealCards(deck){
    while (deck.length != 6){
       listeJoueurs.forEach(player => {
            player.hand.push(...deck.splice(0,3))
        }) 
    }
    console.log("Cards dealed")
    return deck
}
function sortHandCard(plyrHand){
    colors.push("Atout")
    plyrHand.sort(sortingFunction)
    colors.pop()
    return plyrHand

}
function sortingFunction(cardA, cardB){
    const valueA = cardA.value;
    const suitA = cardA.color
    const valueB = cardB.value;
    const suitB = cardB.color
    // Comparer les couleurs des cartes
    if (suitA !== suitB) {
        return colors.indexOf(suitA) - colors.indexOf(suitB);
    }
    // Si les couleurs sont égales, comparer les valeurs
    return valueB - valueA;
}
function setZonePlayer(){
    listeJoueurs.forEach(player => {
        player.hand = sortHandCard(player.hand) 
        player.zone = document.createElement("div")
        player.zone.setAttribute("id", "zonePlayer")
        player.zone.classList.add("player")

        playerElement = document.createElement("label")
        playerElement.textContent = player.name
        playerElement.classList.add("labelPlayer")
        
        player.zone.appendChild(playerElement)
        balisePlayer.appendChild(player.zone)

        player.hand.forEach(card=>{
        cardElement = document.createElement("button")
        cardElement.classList.add("cardElement")
        textval = card.value
        textcol =  card.color
        cardElement.textContent = `${textval} ${textcol}`
        if (textcol === "Coeur" || textcol === "Carreau" ){
            cardElement.style.color = "red"
        }
        if (textcol === "Atout"){
            cardElement.style.color = "blue"
        }
        cardElement.addEventListener("click", (event)=>{
            // console.log(event)
            onClickedCard(card)     
        })
        player.zone.appendChild(cardElement) 
    })
})

}
function updateHandPlayer(){
    listeJoueurs.forEach(player => {
        balisePlayer.removeChild(player.zone)
    })
}
function getHasTaken(){
    return listeJoueurs.find(player => player.hasTaken)
}
// ______________________________________________________
// ------------------ENCHERES----------------------------
function setBet(bet, joueur){
    console.log(joueur.name)
    console.log(joueur.hand)
    joueur.hasBet = true
    dicBets.set(joueur, bet)
    if (bet > actualBet){
        actualBet = bet
    }

    let turn = 0
    listeJoueurs.forEach(player => {
        if (player.hasBet){
            turn +=1
        }
    }) 
    if (turn === 4 || bet === 4){
        endEnchere(dicBets)
    }
    else {
        joueur = changeTurn(joueur, listeJoueurs)
        setUpEnchere(joueur)
} 
    
}
function endEnchere(dic){
    let max = 0
    dic.forEach((value, key) => max = Math.max(max, value))
    cleanBtnsEncheres()
    if (max == 0){
        startEnchere(listeJoueurs)
    }
    else {
        for ([key, value] of dic){
            if (max === value){
                key.hasTaken = true
                console.log(key.name, "a pris une", value)
                settingChien = true               
                SetupChien(value)
            } 
        } 
    }
}
function setUpEnchere(speaker){
    console.log("Enchères : ")
    bets = ["Passer", "Prise", "Garde", "Garde sans", "Garde contre"]
    for (let i = 0; i < bets.length; i++){
        let btnEnchere = document.createElement("button")
        let txt = document.createTextNode(bets[i])
        btnEnchere.setAttribute("id", bets[i])
        btnEnchere.setAttribute("value", i)
        btnEnchere.className = "enchere_button"
        
        if (btnEnchere.value <= actualBet && btnEnchere.value !=0){
            btnEnchere.disabled = true
        }
        else {
            btnEnchere.addEventListener("click", (event) => {
            // console.log(event.target.value)
            setBet(Number(event.target.value), speaker)
            
            })
        }  
        btnEnchere.appendChild(txt)
        baliseMain.appendChild(btnEnchere)
    
    }
}
const cleanBtnsEncheres = () =>
    document
        .querySelectorAll("#mainContainer button")
        .forEach(button => {
           button.remove()
        }) 
function changeTurn(joueur, joueurs){
    cleanBtnsEncheres()
    ind = joueurs.indexOf(joueur)
    speaker = joueurs[ind+1]
    return speaker
}
function startEnchere(joueurs){
    joueurs.forEach(player =>{
        player.hasBet = false
    })
    actualBet = 0
    dicBets = new Map()
    speaker = listeJoueurs[0]
    setUpEnchere(speaker)

}
function SetupChien(val){
    if (val <= 2){
        chienElement = document.createElement("div")
        chienElement.classList.add("chien")
        chienLabel = document.createElement("label")
        chienLabel.textContent = "Cartes du chien : "
        chienElement.appendChild(chienLabel)
        chienElement.appendChild(document.createElement("br"))
        chien.forEach(card => {
            cardChien = document.createElement("button")
            cardChien.classList.add("cardChien")
            textval = card.value
            textcol = card.color
            cardChien.textContent = `${textval} ${textcol}`
            chienElement.appendChild(cardChien)
            chienElement.appendChild(document.createElement("br"))
            cardChien.addEventListener("click", (event) => {
                clickCardChien(card, val)
            })
        })
        baliseMain.appendChild(chienElement)
        // afficher nouveau chien + faire fonction pour quand click sur carte joueur
        newChienElement = document.createElement("div")
        newChienElement.classList.add("chien")
        newChienLabel = document.createElement("label")
        newChienLabel.textContent = "Nouveau chien :"
        newChienElement.appendChild(newChienLabel)
        
        newChien.forEach(card => {
            cardNewChien = document.createElement("button")
            cardNewChien.classList.add("cardChien")
            textval = card.value
            textcol = card.color
            cardNewChien.textContent = `${textval} ${textcol}`
            newChienElement.appendChild(cardNewChien)
            newChienElement.appendChild(document.createElement("br"))
            cardNewChien.addEventListener("click", (event) => {
                clickCardNewChien(card, val)
            })
        })
        baliseMain.appendChild(newChienElement)
       
        chienButton = document.createElement("button")
        chienButton.classList.add("chienButton")
        chienButton.textContent = "Valider le chien"

        // attention pour jeu à 5
        if (newChien.length === 6 && chien.length === 0){
            chienButton.disabled = false 
        } else {
            chienButton.disabled = true 
        }
        chienButton.addEventListener("click", (event)=> {
            validateChien()
        })

        newChienElement.appendChild(chienButton)
    
    
    } else {
        console.log("Pas de chien à faire")
        settingChien = false
        startManche()
    }
}
function clickCardChien(card, val){
    // ajouter carte à la main du joueur qui a pris
    let p = getHasTaken()
        if (p){
            p.hand.push(card)
            chien = chien.filter((c)=> c !== card)
            cleanBtnsChien()
            SetupChien(val)
            updateHandPlayer(p.hand)
            sortHandCard(p.hand)
            setZonePlayer()
            
        }
}
function cleanBtnsChien(){
    document
    .querySelectorAll("#chien button")
    .forEach(button => {
       button.remove()
    })
    document
       .querySelectorAll("#chien label")
       .forEach(label => {
          label.remove()
    })
    baliseMain.removeChild(chienElement)
    baliseMain.removeChild(newChienElement)
}
function clickCardNewChien(card, val){
    let p = getHasTaken()
        if (p){
            p.hand.push(card)
            newChien = newChien.filter((c)=> c !== card)
            cleanBtnsChien()
            SetupChien(val)
            updateHandPlayer(p.hand)
            sortHandCard(p.hand)
            setZonePlayer()
        
        }
}
function validateChien(){
    cleanBtnsChien()
    settingChien = false
    startManche()
}
// ______________________________________________________
// ---------------- MANCHE / PLI-------------------------
function startManche(){
    speaker = listeJoueurs[0]
    isPlaying = true

    setUpManche()
    setupInfo(speaker)
}
function setUpManche(){
    zonePli = document.createElement("div")
    zonePli.classList.add("zonePli")
    labelPli = document.createElement("label")
    labelPli.textContent = "Manche en cours : "
    zonePli.appendChild(labelPli)
    zonePli.style.display = "block"
    baliseMain.appendChild(zonePli)
}
function onClickedCard(card){
    if (settingChien){
        let p = getHasTaken()
        // transferer card à nouveau chien et maj l'affichage
        if (p.hand.includes(card) && newChien.length < 6){
            newChien.push(card)
            p.hand = p.hand.filter((c)=>c !== card)
            updateHandPlayer(p.hand)
            cleanBtnsChien()
            SetupChien(actualBet)
            setZonePlayer()
        }

    }
    if (isPlaying && speaker.hand.includes(card)){
        if (checkPossibleCards(card)){
            console.log(card.value, card.color)
            pli.set(speaker, card)
            speaker.hand = speaker.hand.filter((c)=>c !== card)
            updateHandPlayer()
            updateZonePli(card)

            if (pli.size === 4 ){
                speaker = winnerTurn(pli)
                if (speaker.hand.length === 0){
                    console.log("fin de manche")
                    restartManche()
                } else {
                    restartRound()
                }
            } else {
                speaker = changeTurn(speaker, listeJoueurs)   
            }
        setZonePlayer()
        updateInfo()
        setupInfo(speaker)
        }
        
    }
}
function checkPossibleCards(cardSpeaker) {
    let possibleCards = [];

    if (!colorPli) {
        colorPli = cardSpeaker.color
        possibleCards = speaker.hand.slice();
        
    } else {
        if (colorPli === "Atout" && cardSpeaker.value !== 0) {
            let maxAtout = Math.max(...listAtout, 0);
            possibleCards = speaker.hand.filter(c => c.color === colorPli && c.value > maxAtout);
    
            if (possibleCards.length === 0) {
                possibleCards = speaker.hand.filter(c => c.color === colorPli);
            }
    
            if (possibleCards.length === 0) {
                possibleCards = speaker.hand.slice(); // Copier la main du joueur
            }
        } else {
            possibleCards = speaker.hand.filter(c => c.color === colorPli);
            if (possibleCards.length === 0 && listAtout.length === 0) {
                possibleCards = speaker.hand.filter(c => c.color === "Atout");
            }

            if (possibleCards.length === 0 && listAtout.length !== 0) {
                let maxAtout = Math.max(...listAtout, 0);
                possibleCards = speaker.hand.filter(c => c.color === "Atout" && c.value > maxAtout);
            }

            if (possibleCards.length === 0) {
                possibleCards = speaker.hand.filter(c => c.color === "Atout");
            }

            if (possibleCards.length === 0) {
                possibleCards = speaker.hand.slice(); // Copier la main du joueur
            }
        }
    }
    if (possibleCards.includes(cardSpeaker) || cardSpeaker.value === 0) {
        if (cardSpeaker.color === "Atout" && cardSpeaker.value !== 0) {
            listAtout.push(cardSpeaker.value);
        }
        return true;
    }
    else {return false}
}
function updateZonePli(card){
    textval = card.value
    textcol = card.color
    listPli = document.createElement("ul")
    listPli.textContent = `${textval} ${textcol} `
    zonePli.appendChild(listPli)
    


}
function winnerTurn(dic){
    cardsToCompare = []
    dic.forEach(card=> {
        if (card.color === colorPli){
            cardsToCompare.push(card.value)
        }
        if (card.color === "Atout" && card.value !==0){
            cardsToCompare = []
            colorPli = "Atout"
            cardsToCompare.push(card.value)
        }
    })
    max =0
    cardsToCompare.forEach((value) => max = Math.max(max, value))

    for (const [plyr, c] of dic) {
        if (c.value === max){
            plyr.roundWon = true
            console.log(plyr.name, "a gagné le pli")
            dic.forEach(card => {
                plyr.pliWon.push(card)
            })
            console.log(plyr.pliWon)
            return plyr
        }
    }
}
function restartRound(){
    // changement d'index des joeur dans lsite
    ind = listeJoueurs.indexOf(speaker)
    listeJoueurs = listeJoueurs.slice(ind).concat(listeJoueurs.slice(0, ind))
    pli.clear()
    colorPli = undefined
    listAtout = []
    zonePli.remove()
    setUpManche()
}
function endRound(){
    nbRound += 1
    if (nbRound === nbRoundMax){
        endGame()
    } else {
        startManche()
    }
}
function endGame(){
    console.log("fin du jeu")
}
function restartManche(){
    ind = listeJoueurs.indexOf(speaker)
    listeJoueurs = listeJoueurs.slice(ind).concat(listeJoueurs.slice(0, ind))
    pli.clear()
    colorPli = undefined
    listAtout = []
    zonePli.remove()
    // redistribuer cartes
    startEnchere(listeJoueurs)
}
// ______________________________________________________
// -------------------- INFO JEU ------------------------
function setupInfo(player){
    if (isPlaying){
        infoLabel = document.createElement("label")
        infoLabel.textContent = "Infos jeu :"
        
        infoPlayer = document.createElement("label")
        infoPlayer.textContent = `Au tour du ${player.name}`

        infoManche = document.createElement("label")
        infoManche.textContent = `Manche ${nbRound} / ${nbRoundMax} `

        baliseInfo.appendChild(infoLabel)
        baliseInfo.appendChild(document.createElement("br"))
        baliseInfo.appendChild(infoPlayer)
        baliseInfo.appendChild(document.createElement("br"))
        baliseInfo.appendChild(infoManche)

    }
}
function updateInfo(){
    while (baliseInfo.hasChildNodes()){
        baliseInfo.removeChild(baliseInfo.firstChild)
    }
}
// ______________________________________________________
// _________________INITIALISATION JEU___________________
let colors = ["Pique", "Carreau", "Trêfle", "Coeur"]
const values = Array(14).fill().map((_, i) => i+1)
const valuesAtout = Array(22).fill().map((_, i) => i)
let newChien = []
let settingChien = false 
let isPlaying = false
let pli = new Map()
let colorPli
let listAtout = []
let nbRoundMax = 3
let nbRound = 1

// ___________________INIT ELEMENT HTML_____________

// table = document.getElementById("tableJeu")
let baliseMain = document.getElementById("mainContainer")
let balisePlayer = document.getElementById("playerContainer")
let baliseInfo = document.getElementById("infoContainer")
let zonePli = document.getElementById("zonePli")
// let enchereElement = document.createElement("div")



