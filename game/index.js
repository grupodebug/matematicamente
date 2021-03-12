//  import countdown from './countdown.js';

document.addEventListener("DOMContentLoaded", function(){
 
  //  countdown();

    //evitar document.querySelector();
    window.$ = (query, ctx = document) => ctx.querySelector(query);
    
    //capturei o elemento de video
    const videoBase = $('#video');
    //não realizar captura de audio e apenas do video
    const constraints = { audio: false, video: true }; 
    
      
    //responsável por solicitar a abertura da camera e capturar o stream de vídeo
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      videoBase.srcObject = stream;
      console.log(stream);
      videoBase.onloadedmetadata = function(e) {
        videoBase.play();
      };//onloadedmetadata        
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
    
    
    
    
    //captura canvas
    var videoComFlip = $("#video-com-flip");
    var mapaDeMovimento = $("#mapa-de-movimento");

    //cria a base para edição do canvas com as imagens capturadas
    var contextoVideoComFlip = videoComFlip.getContext('2d');
    var contextoMapaDeMovimento = mapaDeMovimento.getContext('2d');
    
    //flip horizontal para facilitar a usabilidade interação por gestos
    contextoVideoComFlip.translate(videoComFlip.width, 0);
    contextoVideoComFlip.scale(-1, 1);
    
    //retorna o valor absoluto do numero (Math.abs)
    function valorAbsoluto(valor) {
      return (valor ^ (valor >> 31)) - (valor >> 31);
    }
    
    //aproximar
    function normalizacao(valor) {
      //se o valor for > 21, retorne 255 caso contrário retorna 0
      //0xFF - 255 em hexadecimal
      return (valor > 0x15) ? 0xFF : 0;
      //return (valor > 21) ? 255 : 0;
    }
    

function montarMapaDeMovimento(dadosMapa, dadosImgAtual, dadosImgAntiga) {
    if (dadosImgAtual.length != dadosImgAntiga.length) return null;
    let i = 0;
    let quantidadeDePixels = dadosImgAtual.length * 0.25; 
    while (i < quantidadeDePixels) {
      let mediaImgAtual = (dadosImgAtual[4*i] + dadosImgAtual[4*i+1] + dadosImgAtual[4*i+2]) / 3;
      let mediaImgAntiga = (dadosImgAntiga[4*i] + dadosImgAntiga[4*i+1] + dadosImgAntiga[4*i+2]) / 3;
      let diff = normalizacao(valorAbsoluto(mediaImgAtual - mediaImgAntiga));
      dadosMapa[4*i] = dadosMapa[4*i+1] = dadosMapa[4*i+2] = diff;
      dadosMapa[4*i+3] = 0xFF;
      ++i;
    }
  }
    
   
    
    function atualizarMapaDeMovimento() {
      let teste = '';
      let largura = videoComFlip.width;//640
      let altura = videoComFlip.height;//480
      //capturar dados da imagem vinda da webcam
      dadosImgVideo = contextoVideoComFlip.getImageData(0, 0, largura, altura);
      //se ñ houver registro da imagem anterior crie o local para armazena-la
      if (typeof dadosImgAnterior === 'undefined') 
        dadosImgAnterior = contextoVideoComFlip.getImageData(0, 0, largura, altura);

        // if(teste != true){
        //   console.log(dadosImgAnterior.data);
        //   teste = true;
        // }
      //criar imagem para receber o resultado da subtração da imagem atual com a anterior
      var dadosImgMapaMovimento = contextoVideoComFlip.createImageData(largura, altura);
      //subtrair pixels das duas imagens
      montarMapaDeMovimento(dadosImgMapaMovimento.data, dadosImgVideo.data, dadosImgAnterior.data);
      //colocar a imagem resultante no canvas do mapa de movimento para ser mostrada
      contextoMapaDeMovimento.putImageData(dadosImgMapaMovimento, 0, 0);
      //atualizar imagem anterior colocando os dados da imagem atual
      dadosImgAnterior = dadosImgVideo;
    }// end blend()
     
    
    //verifica se na imagem preto e branco houve movimento nessa área
    function verificarMovimento(x,y,w,h){
      //capturar area do canvas preto que será analisada
      let dadosImgMapa = contextoMapaDeMovimento.getImageData(x,y,w,h);
      let quantidadeDePixels = (dadosImgMapa.data.length / 4);
      let i = 0;
      let soma = 0;
      // passa por cada pixel da area analisada
      while (i < quantidadeDePixels) {
        //soma a cor do pixel 255 branco, 0 preto
        soma += dadosImgMapa.data[i*4];
        ++i;
      }
      // faz uma media entre o valor dos pixel por sua quantidade
      //a media será um valor entre 0 e 255
      
      return average = Math.round(soma / quantidadeDePixels);
    }// end checkMovimento()
    
    function verificarBotao(item) {
     //  let item = $("#tecla");
      //recuperar posição e tamanho do item
      let x=item.offsetLeft, y=item.offsetTop, w=item.offsetWidth, h = item.offsetHeight;
      //checar se a area do botao
      let mediaCorDaArea = verificarMovimento(x,y,w,h);
      // item.style.border = '2px solid blue';
      if (mediaCorDaArea > 12) {
        // contextoVideoComFlip.drawImage(video, 0, 0, 400, 400);
        // console.log(item.dataset);
        // console.log(item.dataset.tipo);
      // var data = mapaDeMovimento.toDataURL('image/png');
      // console.log(data);
      // localStorage.setItem('img', data);
        // console.log(mediaCorDaArea)
        //altera a cor do item para azul
        item.style.border = '2px solid blue';
        // console.log("eu ja")
        if (typeof voltaCor === 'undefined')
       
          voltaCor = null;
        // console.log("eu ja");
        clearTimeout(voltaCor);
        // //daqui a 1s volta a cor do item para vermelho
        voltarCor = setTimeout(function(){item.style.border="none";},1000);
        return "true";
  
      }//end if (mediaCorDaArea > 10)s
    }//end checkAreas()


 
    
  
    var cont = 0;
    var escolhas = []
    const atualizacao = setInterval(function(){
      //ela pega o conteudo do video e joga no canvas invertido para melhorar a percepção do usuaroo
      contextoVideoComFlip.drawImage(video, 0, 0, video.width, video.height);
      atualizarMapaDeMovimento();
      
      setTimeout(()=>{

        var a = verificarBotao( $("#tecla0"));
        var b = verificarBotao( $("#tecla1"));
        var c = verificarBotao( $("#tecla2"));
        var d = verificarBotao( $("#tecla3"));

      },2000);
      
    },1000/40);// end setInterval atualizacao
    });//domcontent load
  