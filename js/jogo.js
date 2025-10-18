document.addEventListener("DOMContentLoaded", () => {
  const playerImg = document.getElementById("player");
  const mapaDiv = document.getElementById("mapa");
  const nomeJogadorEl = document.getElementById("nomeJogador");
  const vidaEl = document.getElementById("vida");
  const manaEl = document.getElementById("mana");
  const levelEl = document.getElementById("level");
  const logoutBtn = document.getElementById("logout");

  const step = 32;
  let playerPos = { x: 0, y: 0 };
  let monsters = [];
  let lastUpdate = 0;

  auth.onAuthStateChanged(user => {
    if(user){
      db.collection("jogadores").doc(user.uid).get().then(doc => {
        if(doc.exists){
          const data = doc.data();
          nomeJogadorEl.innerText = data.nome;
          vidaEl.innerText = data.vida;
          manaEl.innerText = data.mana;
          levelEl.innerText = data.level;
          playerPos.x = data.posX;
          playerPos.y = data.posY;
          updatePlayer();
          spawnMonsters();
          listenOtherPlayers();
        }
      });
    } else {
      window.location.href = "index.html";
    }
  });

  function updatePlayer(){
    playerImg.style.left = playerPos.x + "px";
    playerImg.style.top = playerPos.y + "px";
  }

  document.addEventListener("keydown", e => {
    switch(e.key){
      case "ArrowUp": case "w": case "W": playerPos.y -= step; break;
      case "ArrowDown": case "s": case "S": playerPos.y += step; break;
      case "ArrowLeft": case "a": case "A": playerPos.x -= step; break;
      case "ArrowRight": case "d": case "D": playerPos.x += step; break;
    }
    playerPos.x = Math.max(0, Math.min(608, playerPos.x));
    playerPos.y = Math.max(0, Math.min(448, playerPos.y));
    updatePlayer();
    checkCollision();

    const user = auth.currentUser;
    if(user){
      db.collection("jogadores").doc(user.uid).update({
        posX: playerPos.x,
        posY: playerPos.y
      });
    }
  });

  function spawnMonsters(){
    const positions = [{x:128,y:128},{x:256,y:256},{x:384,y:128}];
    positions.forEach(pos => {
      const mon = document.createElement("img");
      mon.src = "assets/sprites/monster.png";
      mon.classList.add("monster");
      mon.style.left = pos.x + "px";
      mon.style.top = pos.y + "px";
      mapaDiv.appendChild(mon);
      monsters.push({el: mon, x: pos.x, y: pos.y, vida: 50});
    });
  }

  function checkCollision(){
    monsters.forEach(mon => {
      if(mon.x === playerPos.x && mon.y === playerPos.y){
        mon.vida -= 10;
        alert("Você atacou um monstro! Vida restante: "+mon.vida);
        if(mon.vida <=0) mon.el.remove();
      }
    });
  }

  logoutBtn.addEventListener("click", () => auth.signOut());

  function listenOtherPlayers(){
    db.collection("jogadores").onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const uid = change.doc.id;
        if(uid !== auth.currentUser.uid){
          const data = change.doc.data();
          let otherEl = document.getElementById("player_"+uid);
          if(change.type === "added"){
            otherEl = document.createElement("img");
            otherEl.src = "assets/sprites/player.png";
            otherEl.id = "player_"+uid;
            otherEl.classList.add("monster"); // reusar classe
            mapaDiv.appendChild(otherEl);
          }
          otherEl.style.left = data.posX + "px";
          otherEl.style.top = data.posY + "px";
        }
      });
    });
  }
});
