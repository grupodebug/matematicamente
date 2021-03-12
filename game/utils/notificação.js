export default function notificacao(tipo, mensagem) {
    const boxNotificacao = document.querySelector('.box-notificacoes');
    setTimeout(() => {
      const div = document.createElement('div');
      div.classList.add(`notificacao-${tipo}`);
      div.classList.add('ativo');
      div.innerHTML = `<h3>${mensagem}</h3>`;
      boxNotificacao.appendChild(div);
  
      div.addEventListener('click', removeNotificacao);
  
      setTimeout(() => {
        removeNotificacao();
      }, 3300);
  
      function removeNotificacao() {
        div.remove();
      }
    }, 700);
  
  }