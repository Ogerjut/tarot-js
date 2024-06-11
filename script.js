// faire les getlemeentId querySlector à l'initiation du jeu pour les avoir
// dans  toutes les fonctions ; idem const
// 
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
    }
}

function startGame(){
    getElement()
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
    for (let c = 0; c < colors.length; c++){
        for (let i = 0; i < 14; i++ ){
            deck.push(new Card(i+1, colors[c])) 
        }
    }
    for (let i = 0; i <= 21; i++ ){
        deck.push(new Card(i, "Atout"))          
    }   
    return deck
}
function loadPlayers(nb){
    const players = []
    for (let i = 0; i < nb; i++){
        players.push(new Player(`Joueur ${i+1}`))
    }
    return players
}
function shuffleDeck(deck){
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
}
function dealCards(deck){
    while (deck.length != 6){
       for (let p = 0 ; p < listeJoueurs.length;p++ ){
            listeJoueurs[p].hand.push(deck[0], deck[1], deck[2])
            deck.splice(0,3)
        } 
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
function getElement(){
    // table = document.getElementById("tableJeu")
    baliseMain = document.getElementById("mainContainer")
    zonePli = document.getElementById("zonePli")
}

// function pour afficher main player et clic sur une carte
function setZonePlayer(){
    for (let i = 0; i < listeJoueurs.length; i++){
        listeJoueurs[i].hand = sortHandCard(listeJoueurs[i].hand) 
        zonePlayer = document.createElement("div")
        playerElement = document.createElement("label")
        playerElement.textContent = listeJoueurs[i].name
        playerElement.classList.add("labelPlayer")
        zonePlayer.setAttribute("id", listeJoueurs[i].name)
        zonePlayer.classList.add("player")
        zonePlayer.appendChild(playerElement)
        baliseMain.appendChild(zonePlayer)
        zoneCards = document.createElement("ul")
        zonePlayer.appendChild(zoneCards) 
        for (let j =0; j < listeJoueurs[i].hand.length; j++){
            cardElement = document.createElement("li")
            cardAnchor = document.createElement("a")
            cardElement.appendChild(cardAnchor)

            textval = listeJoueurs[i].hand[j].value
            textcol =  listeJoueurs[i].hand[j].color
            cardElement.textContent = `${textval} ${textcol}`

            if (textcol === "Coeur" || textcol === "Carreau" ){
                cardElement.style.color = "red"
            }
            if (textcol === "Atout"){
                cardElement.style.color = "blue"
            }

            zoneCards.appendChild(cardElement)
            
        }
        

    }
    
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
    // console.log("Dicbets :", dicBets)

    let turn = 0
    for (i=0; i < listeJoueurs.length; i++){
        if (listeJoueurs[i].hasBet){
            turn +=1
        }
    } 
    if (turn === 4){
        endEnchere(dicBets)
    }
    else {
        joueur = changeTurn(joueur, listeJoueurs)
        setUpEnchere(joueur)
} 
    
}
function endEnchere(dic){
    let max = 0
    for ([key, value] of dic){
        if (max < value){
            max = value
        }
    }
    if (max == 0){
        cleanBtnsEncheres()
        startEnchere(listeJoueurs)
        
    }
    else {
        for ([key, value] of dic){
            if (max === value){
                key.hasTaken = true
                console.log(key.name, "a pris une", value)
                cleanBtnsEncheres()
                startManche()
            } 
        } 
    }
}
function setUpEnchere(speaker){
    console.log("Enchères : ")
    bets = ["Passer", "Prise", "Garde", "Garde sans", "Garde contre"]
    for (let i = 0; i < bets.length; i++){
        enchereElement = document.createElement("div")
        enchereElement.setAttribute("id", "enchere")
        baliseMain.appendChild(enchereElement)
        let btnEnchere = document.createElement("button")
        let txt = document.createTextNode(bets[i])
        btnEnchere.setAttribute("id", bets[i])
        btnEnchere.setAttribute("value", i)
        btnEnchere.classList.add("enchere_button")
        btnEnchere.appendChild(txt)
        enchereElement.appendChild(btnEnchere)
        if (btnEnchere.value <= actualBet && btnEnchere.value !=0){
            btnEnchere.disabled = true
        }
        else {
            btnEnchere.addEventListener("click", (event) => {
            // console.log(event.target.value)
            setBet(Number(event.target.value), speaker)
            
            })
        }  
    }
//     let buttons = document.querySelectorAll("button")
//         console.log(buttons)
}
function cleanBtnsEncheres(){
    let buttons = document.querySelectorAll("button")
    for (let i=0 ; i <buttons.length; i++){
        buttons[i].parentElement.removeChild(buttons[i])
    }
}
function changeTurn(joueur, joueurs){
    cleanBtnsEncheres()
    ind = joueurs.indexOf(joueur)
    speaker = joueurs[ind+1]
    return speaker
}
function startEnchere(joueurs){
    for (let i = 0; i < joueurs.length; i++){
        joueurs[i].hasBet = false
    }
    actualBet = 0
    dicBets = new Map()
    speaker = listeJoueurs[0]
    setUpEnchere(speaker)

}
// ______________________________________________________
// ---------------- MANCHE / PLI-------------------------
function startManche(){
    speaker = listeJoueurs[0]
    pli = new Map()
    colorChoosen = false

    setUpManche()
}
function setUpManche(){
     zonePli.style.display = "block"
    // faire un elément pour hand joueur et un pour zone pli
    // 
}
// ______________________________________________________
// _________________INITIALISATION JEU___________________
let colors = ["Pique", "Carreau", "Trêfle", "Coeur"]
const values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
const valuesAtout = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]

startGame()

