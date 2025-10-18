document.addEventListener("DOMContentLoaded", () => {
  const mensagem = document.getElementById("mensagem");

  document.getElementById("formCadastro")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    auth.createUserWithEmailAndPassword(email, senha)
      .then(cred => db.collection("jogadores").doc(cred.user.uid).set({
        nome, level: 1, exp: 0, vida: 100, mana: 100, posX: 0, posY: 0
      }))
      .then(() => { 
        mensagem.style.color = "#0f0";
        mensagem.textContent = "Conta criada! Redirecionando...";
        setTimeout(() => window.location.href = "jogo.html", 1000);
      })
      .catch(err => {
        mensagem.style.color = "#f00";
        mensagem.textContent = err.message;
      });
  });

  document.getElementById("formLogin")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    auth.signInWithEmailAndPassword(email, senha)
      .then(() => {
        mensagem.style.color = "#0f0";
        mensagem.textContent = "Login realizado! Redirecionando...";
        setTimeout(() => window.location.href = "jogo.html", 500);
      })
      .catch(err => {
        mensagem.style.color = "#f00";
        mensagem.textContent = err.message;
      });
  });
});
