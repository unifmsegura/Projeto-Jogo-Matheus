const canvas = document.getElementById("desenho1");
const context = canvas.getContext("2d");
document.getElementById("menuButton").addEventListener("click", function () {
  window.location.href = "main.html";
});

document.getElementById("playButton").addEventListener("click", () => {
  document.getElementById("startScreen").style.display = "none"; //some com a tela de play
  gameLoopAtivo = true;
  iniciarJogo(); //chama o jogo
});

/*config*/
function iniciarJogo() {
  //reiniciar fase ou jogo com R
  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r") {
      if (!reiniciando) {
        reiniciando = true;

        if (gameOver) {
          reiniciarJogo(); //reinicia o jogo completo
        } else {
          reiniciarFase(); //reinicia apenas a fase atual
        }

        setTimeout(() => (reiniciando = false), 300);
      }
    }
  });

  let passos = 18; //total inicial de passos/vidas
  const grid = 70; 

  /*tipos*/
  const types = {
    wall: "#",
    player: "@",
    playerOnGoal: "+",
    block: "$",
    enemy: "M",
    blockOnGoal: "*",
    goal: ".",
    empty: " ",
    space: "&",
    trap: "%",
    slowtrap: "?",
    blockOnTrap: "^",
    keyhole: "~",
    key: "!",
  };

  //tipos específicos de sprites
  const wallTypes = {
    wall_top: "T",
    wall_bottom: "B",
    wall_left: "L",
    wall_right: "R",
    wall_topLeft: "Q", 
    wall_topRight: "E", 
    wall_bottomLeft: "Z", 
    wall_bottomRight: "C", 
    wall_rock: "W",
    wall_topLeftCorner: "Y",
    wall_topRightCorner: "U",
  };

  //APAGAR FLOOR E REDESENHAR wall, pq vai ser dificil redesenhar a caixa p ficar em baixo igual com as a traps

  //níveis
  const level1 = [
    ["&", "&", "&", "&", "&", "&", "&", "&", "&", "&"],
    ["&", "&", "&", "&", "&", "Q", "T", "T", "E", "&"],
    ["&", "&", "Q", "T", "T", "Y", " ", "@", "R", "&"],
    ["&", "&", "L", " ", " ", "M", " ", " ", "R", "&"],
    ["&", "Q", "Y", " ", "M", " ", "M", "W", "R", "&"],
    ["&", "L", " ", " ", "W", "W", "W", "W", "R", "&"],
    ["&", "L", " ", "$", " ", " ", "$", " ", "U", "E"],
    ["&", "L", " ", "$", " ", "$", " ", ".", " ", "R"],
    ["&", "Z", "B", "B", "B", "B", "B", "B", "B", "C"],
  ];

  const level2 = [
    ["&", "&", "&", "&", "&", "&", "&", "&", "&", "&"],
    ["&", "Q", "T", "T", "T", "E", "&", "&", "&", "&"],
    ["&", "L", " ", " ", " ", "Z", "T", "T", "E", "&"],
    ["Q", "Y", "M", "W", "%", "%", " ", " ", "R", "&"],
    ["L", " ", "%", "Q", "E", "$", "$", "$", "R", "&"],
    ["L", " ", " ", "L", "R", " ", "%", " ", "R", "&"],
    ["L", "@", " ", "L", "R", " ", "M", " ", "R", "&"],
    ["Z", "B", "B", "C", "R", ".", " ", "M", "R", "&"],
    ["&", "&", "&", "&", "Z", "B", "B", "B", "C", "&"],
  ];

  const level3 = [
    ["&", "&", "&", "Q", "T", "T", "T", "T", "E", "&"],
    ["&", "&", "&", "L", "W", "W", ".", " ", "R", "&"],
    ["&", "&", "Q", "C", "W", "W", "W", "~", "U", "E"],
    ["&", "&", "L", " ", "%", "%", " ", " ", "@", "R"],
    ["&", "&", "L", "%", "W", "%", "W", " ", " ", "R"],
    ["Q", "T", "Y", " ", " ", "M", "%", "%", "Q", "C"],
    ["L", "!", "W", "%", "W", "%", "W", " ", "R", "&"],
    ["L", " ", " ", " ", " ", " ", "M", " ", "R", "&"],
    ["Z", "B", "B", "B", "B", "B", "B", "B", "C", "&"],
  ];

  const level4 = [
    ["&", "&", "&", "&", "&", "&", "&", "&", "&", "&"],
    ["Q", "T", "T", "T", "T", "T", "E", "&", "&", "&"],
    ["L", "@", "W", "!", " ", "$", "U", "T", "E", "&"],
    ["L", " ", "$", "%", "%", " ", "~", " ", "Z", "E"],
    ["L", "$", " ", "$", " ", "$", "$", " ", ".", "R"],
    ["L", " ", "$", " ", "$", " ", "$", "$", " ", "R"],
    ["L", " ", " ", "$", " ", "$", " ", "Q", "B", "C"],
    ["Z", "B", "B", "B", "B", "B", "B", "C", "&", "&"],
    ["&", "&", "&", "&", "&", "&", "&", "&", "&", "&"],
  ];

  const level5 = [
    ["&", "&", "&", "&", "&", "Q", "T", "T", "E", "&"],
    ["&", "&", "&", "&", "Q", "Y", ".", " ", "Z", "E"],
    ["&", "&", "Q", "T", "Y", " ", "~", "$", " ", "R"],
    ["&", "&", "L", "@", "W", "?", " ", "$", " ", "R"],
    ["&", "&", "L", " ", "W", " ", "?", " ", "?", "R"],
    ["&", "&", "L", "M", "W", "$", "$", "$", "$", "R"],
    ["&", "&", "L", "?", " ", "?", " ", " ", "?", "R"],
    ["&", "&", "Z", "B", "B", "B", "B", "E", "!", "R"],
    ["&", "&", "&", "&", "&", "&", "&", "Z", "B", "C"],
  ];

  const level6 = [
    ["&", "Q", "T", "T", "T", "E", "&", "&", "&", "&"],
    ["&", "L", " ", "@", " ", "R", "&", "&", "&", "&"],
    ["Q", "C", "$", "$", "$", "R", "&", "&", "&", "&"],
    ["L", " ", " ", " ", "!", "Z", "E", "&", "&", "&"],
    ["Z", "E", "?", "?", " ", "W", "Z", "T", "E", "&"],
    ["&", "L", "M", "W", "$", "$", " ", " ", "R", "&"],
    ["&", "L", " ", " ", "$", " ", "M", "W", "R", "&"],
    ["&", "Z", "B", "B", "E", "~", "$", " ", "R", "&"],
    ["&", "&", "&", "&", "L", ".", " ", "Q", "C", "&"],
    ["&", "&", "&", "&", "Z", "B", "B", "C", "&", "&"],
  ];

  const level7 = [
    ["&", "&", "&", "&", "Q", "T", "T", "E", "&", "&"],
    ["&", "&", "&", "&", "L", " ", ".", "Z", "E", "&"],
    ["&", "Q", "T", "T", "C", " ", "~", " ", "R", "&"],
    ["&", "L", " ", "!", "W", "$", "$", "$", "R", "&"],
    ["&", "L", "M", "$", " ", "M", "$", " ", "R", "&"],
    ["&", "L", "?", "W", "M", " ", " ", "@", "R", "&"],
    ["&", "L", " ", "W", "W", "?", "Q", "B", "C", "&"],
    ["&", "L", "?", " ", "?", " ", "R", "&", "&", "&"],
    ["&", "Z", "B", "B", "B", "B", "C", "&", "&", "&"],
  ];

  const level8 = [
    ["&", "&", "&", "&", "&", "&", "&", "&", "&", "&", "&"],
    ["&", "&", "&", "Q", "T", "T", "T", "E", "&", "&", "&"],
    ["&", "&", "&", "L", " ", ".", " ", "R", "&", "&", "&"],
    ["&", "Q", "T", "Y", "$", "~", "$", "Z", "T", "E", "&"],
    ["Q", "Y", "$", "W", "$", " ", " ", "W", " ", "U", "E"],
    ["L", "$", " ", " ", "$", "$", "$", " ", " ", "!", "R"],
    ["L", " ", "$", "$", "$", " ", " ", "$", "$", " ", "R"],
    ["Z", "E", "@", " ", "$", " ", " ", "$", " ", "Q", "C"],
    ["&", "Z", "B", "B", "B", "B", "B", "B", "B", "Y", "&"],
  ];

  let gameLoopAtivo = true;
  let hasKey = false; //começa sem chave
  let gameOver = false;
  let gameOverImg = new Image();
  gameOverImg.src = "imagens/gameover.png";
  let reiniciando = false;
  gameOver = false;
  gameLoopAtivo = true;
  let slowtrapVisible = true;
  let lastSlowtrapCheck = 0; //controle do tempo entre danos

  //slowtraps piscam a cada 1 segundo
  setInterval(() => {
    slowtrapVisible = !slowtrapVisible;

    //verifica se o jogador está em cima dela quando a slowtrap fica visível
    if (slowtrapVisible) checkSlowtrapDamage();
  }, 1000);

  function mostrarGameOver() {
    gameOver = true;
  }

  function checkWin() {
    return false; //lógica real
  }

  function checkSlowtrapDamage() {
    const now = Date.now();
    //evita múltiplas penalidades muito rápidas (mínimo 500ms entre penalidades)
    if (now - lastSlowtrapCheck < 500) return;

    const playerCell = cells[playerPos.row][playerPos.col];
    const originalCell = levels[currentLevel][playerPos.row][playerPos.col];

    //se o jogador está sobre uma slowtrap e ela está visível
    if (originalCell === types.slowtrap && slowtrapVisible) {
      passos -= 2;
      lastSlowtrapCheck = now;

      if (passos < 0) passos = 0;
      console.log("Slowtrap ativa! -2 passos");
    }
  }

  let currentLevel = 0;

  const levels = [
    level1,
    level2,
    level3,
    level4,
    level5,
    level6,
    level7,
    level8,
  ];
  //limite de passos por fase
  const passosPorLevel = [18, 22, 30, 16, 17, 17, 27, 23];

  function reiniciarFase() {
    console.log("Reiniciando fase.");
    loadLevel(currentLevel); //recarrega a fase atual
  }

  function loadLevel(index) {
    hasKey = false; // o jogador não carrega a chave quando reinicia
    if (index >= levels.length) {
      //fim do jogo, para a animação
      cancelAnimationFrame(rAF);

      //limpa o canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      //cria a imagem de fim de jogo
      const endImg = new Image();
      endImg.src = "imagens/endscreen_02.png"; //caminho da imagem

      //efeito de fade-in 
      let opacity = 0;

      endImg.onload = () => {
        const draw = () => {
          //limpa o fundo
          context.clearRect(0, 0, canvas.width, canvas.height);

          context.fillStyle = "rgba(0, 0, 0, 0)";
          context.fillRect(0, 0, canvas.width, canvas.height);

          //desenha a imagem com opacidade crescente
          context.globalAlpha = opacity;
          const imgWidth = canvas.width * 0.8;
          const imgHeight = imgWidth * (endImg.height / endImg.width);
          const x = (canvas.width - imgWidth) / 2;
          const y = (canvas.height - imgHeight) / 2;
          context.drawImage(endImg, x, y, imgWidth, imgHeight);
          context.globalAlpha = 1.0;

          //aumenta opacidade até 1
          if (opacity < 1) {
            opacity += 0.02;
            requestAnimationFrame(draw);
          }
        };

        draw();
      };

      return;
    }

    //define o número de passos com base na fase atual
    passos = passosPorLevel[index] || 25;

    currentLevel = index;
    cells = levels[index].map((row) => row.slice());

    //procura jogador no novo nível
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        if (
          cells[r][c] === types.player ||
          cells[r][c] === types.playerOnGoal
        ) {
          playerPos = { row: r, col: c };
        }
      }
    }

    //reajusta canvas
    canvas.width = cells[0].length * grid;
    canvas.height = cells.length * grid;

    //atualiza sprite do jogador
    jogadorDados.posx = playerPos.col * grid;
    jogadorDados.posy = playerPos.row * grid;
    jogadorDados.targetX = jogadorDados.posx;
    jogadorDados.targetY = jogadorDados.posy;

    gameWon = false;
  }

  function reiniciarJogo() {
    console.log("Reiniciando jogo do zero.");

    //zera estados do jogo
    gameOver = false;
    gameWon = false;
    gameLoopAtivo = true;
    currentLevel = 0;
    hasKey = false;

    //limpa o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    //recarrega o primeiro nível
    loadLevel(currentLevel);

    //reativa o loop principal
    rAF = requestAnimationFrame(loop);

    //atualiza o texto da interface
    const ui = document.getElementById("ui");
    if (ui) {
      ui.textContent =
        'Quando aparecer a tela de game over, espere 10 segundos e depois aperte "R" para recomeçar.';
    }
  }

  function nextLevel() {
    loadLevel(currentLevel + 1);
  }

  /*cópia mutável do nível*/
  let cells = level1.map((row) => row.slice());

  /*player(posição em células)*/
  let playerPos = { row: 0, col: 0 };

  /*procura o jogador inicial na matriz*/
  (function findPlayer() {
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        if (
          cells[r][c] === types.player ||
          cells[r][c] === types.playerOnGoal
        ) {
          playerPos = { row: r, col: c };
          return;
        }
      }
    }
  })();

  /*configura o canvas de acordo com o mapa*/
  canvas.width = cells[0].length * grid;
  canvas.height = cells.length * grid;

  /*sistema de sprites*/
  const jogadorDados = {
    numeroSprite: 0,
    linhaSprite: 0,
    posx: playerPos.col * grid,
    posy: playerPos.row * grid,
    targetX: playerPos.col * grid,
    targetY: playerPos.row * grid,
    velocidade: 10, //pixels por frame durante a transição de célula
    img: "spritesheet/jogador.png",
    spritesPorLinha: 4,
    spritesPorColuna: 4,
    largura: 200,
    altura: 270,
    larguraFinal: 70,
    alturaFinal: 100,
    dirx: 0,
    diry: 0,
    esquerda: false,
    direita: false,
    cima: false,
    baixo: false,
    andando: false,
    atrazoSprite: 5,
    maxAtrazoSprite: 5,
    jogadorImg: new Image(),
  };

  jogadorDados.jogadorImg.src = jogadorDados.img; //carregar uma vez (não a cada frame)

  /*mapeamento de linhas da spritesheet*/
  function atualizarLinhaSprite() {
    if (jogadorDados.cima) jogadorDados.linhaSprite = 0;
    else if (jogadorDados.direita) jogadorDados.linhaSprite = 1;
    else if (jogadorDados.baixo) jogadorDados.linhaSprite = 2;
    else if (jogadorDados.esquerda) jogadorDados.linhaSprite = 3;
  }

  /*desenha o jogador usando a spritesheet nas coordenadas posx/posy*/
  function desenharJogador(ctx, dados) {
    //atualiza posição para animar movimento de célula
    const dx = dados.targetX - dados.posx;
    const dy = dados.targetY - dados.posy;
    if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
      //desloca por até 'velocidade' pixels por frame
      const stepX = Math.sign(dx) * Math.min(Math.abs(dx), dados.velocidade);
      const stepY = Math.sign(dy) * Math.min(Math.abs(dy), dados.velocidade);
      dados.posx += stepX;
      dados.posy += stepY;
      dados.andando = true;
    } else {
      dados.andando = false;
      //garantir alinhamento quando chega ao target
      dados.posx = dados.targetX;
      dados.posy = dados.targetY;
    }

    //atualiza linha da spritesheet de acordo com flags
    atualizarLinhaSprite();

    //fallback
    const spriteW =
      dados.jogadorImg && dados.jogadorImg.width
        ? dados.jogadorImg.width
        : dados.largura * dados.spritesPorLinha;
    const spriteH =
      dados.jogadorImg && dados.jogadorImg.height
        ? dados.jogadorImg.height
        : dados.altura * dados.spritesPorColuna;

    ctx.drawImage(
      dados.jogadorImg,
      (spriteW / dados.spritesPorLinha) * dados.numeroSprite,
      (spriteH / dados.spritesPorColuna) * dados.linhaSprite,
      dados.largura,
      dados.altura,
      dados.posx,
      dados.posy + (grid - dados.alturaFinal), //alinhar base do sprite com o tile
      dados.larguraFinal,
      dados.alturaFinal
    );

    //animação de sprite (quadros)
    if (dados.andando) {
      if (dados.atrazoSprite > 0) {
        dados.atrazoSprite--;
      } else {
        dados.atrazoSprite = dados.maxAtrazoSprite;
        if (dados.numeroSprite < dados.spritesPorLinha - 1) {
          dados.numeroSprite++;
        } else {
          dados.numeroSprite = 0;
        }
      }
    } else {
      dados.numeroSprite = 0;
    }
  }

  const enemyDados = {
    numeroSprite: 0,
    linhaSprite: 0, //linhas para direção ou estado
    posx: 0, //posição em pixels
    posy: 0,
    spritesPorLinha: 3, //número de frames/quadros na linha da spritesheet
    largura: 98, //largura do quadro na spritesheet
    altura: 108, //altura do quadro na spritesheet
    larguraFinal: grid, //tamanho final no canvas
    alturaFinal: grid,
    atrasarSprite: 40,
    maxAtrasarSprite: 40,
    enemyImg: new Image(),
  };
  enemyDados.enemyImg.src = "spritesheet/enemy.png"; //carrega imagem uma vez

  //sprites
  //definição dos sprites
  const sprites = {
    wall: new Image(),
    block: new Image(),
    enemy: new Image(),
    trap: new Image(),
    slowtrap: new Image(),
    blockOnTrap: new Image(),
    goal: new Image(),
    key: new Image(),
    keyhole: new Image(),
    space: new Image(),
    spike_ON: new Image(),
    spike_OFF: new Image(),
    box_on_spike: new Image(),
  };

  //caminhos das imagens
  sprites.block.src = "spritesheet/box.png"; 

  sprites.blockOnTrap.src = "spritesheet/box_on_spike.png";

  sprites.key.src = "spritesheet/key.png";
  sprites.keyhole.src = "spritesheet/keyhole.png";
  sprites.space.src = "spritesheet/background_space.png";
  sprites.spike_ON.src = "spritesheet/spike_ON.png";
  sprites.spike_OFF.src = "spritesheet/spike_OFF.png";

  sprites.wall_bottom = new Image();
  sprites.wall_bottom.src = "spritesheet/wall_bottom.png";
  sprites.wall_bottomLeft = new Image();
  sprites.wall_bottomLeft.src = "spritesheet/wall_bottomLeft.png";
  sprites.wall_bottomRight = new Image();
  sprites.wall_bottomRight.src = "spritesheet/wall_bottomRight.png";
  sprites.wall_left = new Image();
  sprites.wall_left.src = "spritesheet/wall_left.png";
  sprites.wall_right = new Image();
  sprites.wall_right.src = "spritesheet/wall_right.png";
  sprites.wall_top = new Image();
  sprites.wall_top.src = "spritesheet/wall_top.png";
  sprites.wall_topLeft = new Image();
  sprites.wall_topLeft.src = "spritesheet/wall_topLeft.png";
  sprites.wall_topRight = new Image();
  sprites.wall_topRight.src = "spritesheet/wall_topRight.png";
  sprites.wall_rock = new Image();
  sprites.wall_rock.src = "spritesheet/wall_rock.png";
  sprites.wall_topLeftCorner = new Image();
  sprites.wall_topLeftCorner.src = "spritesheet/wall_topLeftCorner.png";
  sprites.wall_topRightCorner = new Image();
  sprites.wall_topRightCorner.src = "spritesheet/wall_topRightCorner.png";

  //mapeamento símbolo
  const spriteMap = {
    "#": sprites.wall,
    "$": sprites.block,
    "M": sprites.enemy,
    "%": sprites.trap,
    "?": sprites.slowtrap,
    "^": sprites.blockOnTrap,
    ".": sprites.goal,
    "!": sprites.key,
    "~": sprites.keyhole,
    "&": sprites.space,
    " ": sprites.floor,
  };

  const wallSpriteMap = {
    Q: sprites.wall_topLeft,
    T: sprites.wall_top,
    E: sprites.wall_topRight,
    L: sprites.wall_left,
    R: sprites.wall_right,
    Z: sprites.wall_bottomLeft,
    B: sprites.wall_bottom,
    C: sprites.wall_bottomRight,
    W: sprites.wall_rock,
    Y: sprites.wall_topLeftCorner,
    U: sprites.wall_topRightCorner,
  };


  const backgroundSpace = new Image();
  backgroundSpace.src = "spritesheet/background_space.png";

  /*funções lógicas do sokoban*/

  /*retorna conteúdo seguro de célula (fora do mapa => wall)*/
  function cellAt(r, c) {
    if (r < 0 || r >= cells.length || c < 0 || c >= cells[0].length)
      return types.wall;
    return cells[r][c];
  }

  /*move entidade (player ou bloco) da célula start para end preserva goals corretamente e trata player/enemy/block*/
  function moveCell(startPos, endPos) {
    const startCell = cells[startPos.row][startPos.col];
    const endCell = cells[endPos.row][endPos.col];

    const isPlayer =
      startCell === types.player || startCell === types.playerOnGoal;
    const isBlock =
      startCell === types.block ||
      startCell === types.blockOnGoal ||
      startCell === types.blockOnTrap;
    const isEnemy = startCell === types.enemy;

    //pega o tipo original da célula no mapa original da fase para preservar o chão
    const floor = levels[currentLevel][startPos.row][startPos.col];

    //limpa célula de origem e preserva chão correto
    if (
      startCell === types.player ||
      startCell === types.block ||
      startCell === types.enemy
    ) {
      if (
        floor === types.goal ||
        floor === types.trap ||
        floor === types.slowtrap
      ) {
        cells[startPos.row][startPos.col] = floor;
      } else {
        cells[startPos.row][startPos.col] = types.empty;
      }
    } else if (
      startCell === types.playerOnGoal ||
      startCell === types.blockOnGoal
    ) {
      cells[startPos.row][startPos.col] = types.goal;
    } else if (startCell === types.blockOnTrap) {
      cells[startPos.row][startPos.col] = types.trap;
    } else {
      cells[startPos.row][startPos.col] = types.empty;
    }

    //define a célula de destino
    if (endCell === types.goal) {
      if (isPlayer) cells[endPos.row][endPos.col] = types.playerOnGoal;
      else if (isBlock) cells[endPos.row][endPos.col] = types.blockOnGoal;
      else if (isEnemy) cells[endPos.row][endPos.col] = types.enemy;
    } else if (endCell === types.trap) {
      if (isPlayer) cells[endPos.row][endPos.col] = types.player;
      else if (isBlock) cells[endPos.row][endPos.col] = types.blockOnTrap;
      else if (isEnemy) cells[endPos.row][endPos.col] = types.enemy;
    } else if (endCell === types.slowtrap) {
      if (isPlayer) cells[endPos.row][endPos.col] = types.player;
      else if (isBlock) cells[endPos.row][endPos.col] = types.blockOnTrap;
      else if (isEnemy) cells[endPos.row][endPos.col] = types.enemy;
    } else {
      if (isPlayer) cells[endPos.row][endPos.col] = types.player;
      else if (isBlock) cells[endPos.row][endPos.col] = types.block;
      else if (isEnemy) cells[endPos.row][endPos.col] = types.enemy;
    }
  }

  /*tenta mover o jogador na direção (dCol, dRow) e retorna true se houve movimento*/
  function tryMovePlayer(dCol, dRow) {
    // e o sprite estiver em transição entre células, ignora inputs extra
    if (
      jogadorDados.posx !== jogadorDados.targetX ||
      jogadorDados.posy !== jogadorDados.targetY
    ) {
      return false;
    }

    const nr = playerPos.row + dRow;
    const nc = playerPos.col + dCol;

    const dest = cellAt(nr, nc);

    //se for uma chave, o jogador coleta
    if (dest === types.key) {
      hasKey = true;
      //remove a chave do mapa
      cells[nr][nc] = types.empty;
      //jogador anda para lá
      moveCell(
        { row: playerPos.row, col: playerPos.col },
        { row: nr, col: nc }
      );
      playerPos = { row: nr, col: nc };
      //feedback visual
      console.log("Chave coletada.");
      jogadorDados.targetX = playerPos.col * grid;
      jogadorDados.targetY = playerPos.row * grid;
      return true;
    }

    //se for uma fechadura e o jogador tem a chave -> abre
    if (dest === types.keyhole) {
      if (hasKey) {
        hasKey = false; //usa a chave
        cells[nr][nc] = types.empty; //remove a fechadura
        console.log("Fechadura aberta.");
        moveCell(
          { row: playerPos.row, col: playerPos.col },
          { row: nr, col: nc }
        );
        playerPos = { row: nr, col: nc };
        jogadorDados.targetX = playerPos.col * grid;
        jogadorDados.targetY = playerPos.row * grid;
        return true;
      } else {
        console.log("Precisa da chave.");
        return false; //não pode passar
      }
    }

    //verifica se o jogador está sobre uma armadilha
    if (cellAt(playerPos.row, playerPos.col) === types.slowtrap) {
      if (slowtrapVisible) {
        passos -= 2; //perde 2 passos se a armadilha estiver visível
      } else {
        passos -= 1; //perde só 1 passo se estiver invisível
      }

      //impede que os passos fiquem negativos
      if (passos < 0) passos = 0;
    }

    //parede -> nada
    if (dest === types.wall) return false;

    //se for uma slowtrap, o jogador pode passar, mas perde passos
    if (dest === types.slowtrap) {
      //penalidade por pisar
      passos -= slowtrapVisible ? 2 : 1;
      if (passos < 0) passos = 0;

      //move o jogador normalmente
      moveCell(
        { row: playerPos.row, col: playerPos.col },
        { row: nr, col: nc }
      );
      playerPos = { row: nr, col: nc };

      //define direção e animação
      jogadorDados.targetX = playerPos.col * grid;
      jogadorDados.targetY = playerPos.row * grid;
      jogadorDados.cima = dRow < 0;
      jogadorDados.baixo = dRow > 0;
      jogadorDados.esquerda = dCol < 0;
      jogadorDados.direita = dCol > 0;
      return true;
    }

    //verifica o que há na célula onde o jogador está 
    const cellBelow = cells[playerPos.row][playerPos.col];

    //armadilha (trap), pode passar, mas perde 2 passos
    if (dest === types.trap) {
      passos -= 2;
      if (passos < 0) passos = 0;

      moveCell(
        { row: playerPos.row, col: playerPos.col },
        { row: nr, col: nc }
      );
      playerPos = { row: nr, col: nc };

      jogadorDados.targetX = playerPos.col * grid;
      jogadorDados.targetY = playerPos.row * grid;
      jogadorDados.cima = dRow < 0;
      jogadorDados.baixo = dRow > 0;
      jogadorDados.esquerda = dCol < 0;
      jogadorDados.direita = dCol > 0;

      return true;
    }

    //célula livre ou meta
    if (dest === types.empty || dest === types.goal) {
      moveCell(
        { row: playerPos.row, col: playerPos.col },
        { row: nr, col: nc }
      );
      playerPos = { row: nr, col: nc };
    } else if (
      dest === types.block ||
      dest === types.blockOnGoal ||
      dest === types.blockOnTrap
    ) {
      const nr2 = nr + dRow;
      const nc2 = nc + dCol;
      const after = cellAt(nr2, nc2);

      //pode empurrar se destino for vazio, meta ou armadilha
      if (
        after === types.empty ||
        after === types.goal ||
        after === types.trap ||
        after === types.slowtrap
      ) {
        //se o destino for armadilha -> bloco vira blockOnTrap
        if (after === types.trap) {
          cells[nr2][nc2] = types.blockOnTrap;
        } else if (after === types.slowtrap) {
          cells[nr2][nc2] = types.blockOnTrap; //usa o mesmo tipo visual
        } else if (after === types.goal) {
          cells[nr2][nc2] = types.blockOnGoal;
        } else {
          cells[nr2][nc2] = types.block;
        }

        //limpa a célula original do bloco, mantendo goal/trap 
        if (cells[nr][nc] === types.blockOnGoal) cells[nr][nc] = types.goal;
        else if (cells[nr][nc] === types.blockOnTrap)
          cells[nr][nc] = types.trap;
        else cells[nr][nc] = types.empty;

        //move o jogador para a posição anterior do bloco
        moveCell(
          { row: playerPos.row, col: playerPos.col },
          { row: nr, col: nc }
        );
        playerPos = { row: nr, col: nc };
      } else return false;
    }

    //monstro
    else if (dest === types.enemy) {
      const nr2 = nr + dRow;
      const nc2 = nc + dCol;
      const after = cellAt(nr2, nc2);

      //checa se saiu dos limites (parede implícita)
      const foraMapa =
        nr2 < 0 || nr2 >= cells.length || nc2 < 0 || nc2 >= cells[0].length;

      //se o monstro encostar em uma caixa -> morre
      if (
        after === types.block ||
        after === types.blockOnGoal ||
        after === types.blockOnTrap
      ) {
        cells[nr][nc] = types.empty; //remove o monstro
        moveCell(
          { row: playerPos.row, col: playerPos.col },
          { row: nr, col: nc }
        );
        playerPos = { row: nr, col: nc };
      }

      //se a próxima célula for parede (ou estiver fora do mapa) -> monstro morre (bateu)
      else if (
        foraMapa ||
        after === types.wall ||
        (wallSpriteMap && wallSpriteMap[after])
      ) {
        cells[nr][nc] = types.empty; //remove o inimigo
        moveCell(
          { row: playerPos.row, col: playerPos.col },
          { row: nr, col: nc }
        );
        playerPos = { row: nr, col: nc };
      }

      //se a próxima célula for vazia, meta ou armadilha -> empurra o monstro
      else if (
        after === types.empty ||
        after === types.goal ||
        after === types.trap ||
        after === types.slowtrap
      ) {
        moveCell({ row: nr, col: nc }, { row: nr2, col: nc2 });
        moveCell(
          { row: playerPos.row, col: playerPos.col },
          { row: nr, col: nc }
        );
        playerPos = { row: nr, col: nc };
      } else return false;
    }

    //define alvo e direção do sprite
    jogadorDados.targetX = playerPos.col * grid;
    jogadorDados.targetY = playerPos.row * grid;
    jogadorDados.cima = dRow < 0;
    jogadorDados.baixo = dRow > 0;
    jogadorDados.esquerda = dCol < 0;
    jogadorDados.direita = dCol > 0;

    //se o jogador estiver sobre uma célula que era "goal" antes de pisar, troca de fase
    if (dest === types.goal) {
      setTimeout(() => {
        nextLevel();
      }, 500); //espera meio segundo antes de trocar
    }

    //diminui 1 passo a cada movimento bem-sucedido
    //diminui passos dependendo do tipo de movimento
    let custoPasso = 1;

    //se o jogador empurrou uma caixa, o custo é menor
    if (
      dest === types.block ||
      dest === types.blockOnGoal ||
      dest === types.blockOnTrap
    ) {
      custoPasso = 1; //empurrar gasta um passo
    }

    //se o jogador pisar em trap ou slowtrap, mantém o custo normal (já há penalidade separada acima)

    //aplica o custo
    passos -= custoPasso;
    if (passos < 0) passos = 0;

    //gameover

    if (passos === 0) {
      //para o jogo
      cancelAnimationFrame(rAF);

      //limpa a tela
      context.clearRect(0, 0, canvas.width, canvas.height);

      //cria a imagem 
      const gameOverImg = new Image();
      gameOverImg.src = "imagens/gameover.png"; 
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);

      //quando a imagem carregar, desenha no centro
      gameOverImg.onload = () => {
        const imgWidth = canvas.width * 0.6; //60% da largura do canvas
        const imgHeight = imgWidth * (gameOverImg.height / gameOverImg.width);
        const x = (canvas.width - imgWidth) / 2;
        const y = (canvas.height - imgHeight) / 2;
        context.drawImage(gameOverImg, x, y, imgWidth, imgHeight);

        //após 5 segundos, pode reiniciar
        setTimeout(() => {
          mostrarGameOver();
        }, 5000);
      };

      return false;
    }

    return true;
  }

  /*desenho do mapa(formas coloridas)*/
  function desenharMapa(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[row].length; col++) {
        const cell = cells[row][col];
        const x = col * grid;
        const y = row * grid;
        const originalCell = levels[currentLevel][row][col];

        //se for o espaço, desenha o sprite de fundo
        if (cell === types.space) {
          ctx.drawImage(backgroundSpace, x, y, grid, grid);
          continue; //pula o restante, não desenha nada em cima
        }

        if (wallSpriteMap[cell]) {
          ctx.drawImage(wallSpriteMap[cell], x, y, grid, grid);
          continue; //para não desenhar o fallback depois
        }

        //desenhar fundo
        context.drawImage(sprites.space, x, y, grid, grid);

        //traps
        if (cell === types.trap) {
          //trap normal -> sempre spike_ON
          context.drawImage(sprites.spike_ON, x, y, grid, grid);
          continue;
        }

        //slowtraps
        if (cell === types.slowtrap) {
          //alterna entre spike_ON/spike_OFF igual a slowtrapVisible
          const spriteToUse = slowtrapVisible
            ? sprites.spike_ON
            : sprites.spike_OFF;
          context.drawImage(spriteToUse, x, y, grid, grid);
          continue;
        }

        //fallbac
        switch (cell) {
          case "#": //parede
            ctx.fillStyle = "rgb(110,110,110)";
            break;
          case "$": //bloco
            ctx.fillStyle = "#ffbb5b";
            break;
          case "M": //inimigo
            ctx.fillStyle = "red";
            break;
          case "!": //trap
            ctx.fillStyle = "#dcdcdc";
            break;
          case "?": //slowtrap
            ctx.fillStyle = "#dcdcdc";
            break;
          case ".": //goal
            ctx.fillStyle = "#a0ffa0";
            break;
          case "~": //key
            ctx.fillStyle = "yellow";
            break;
          case "%": //keyhole
            ctx.fillStyle = "gold";
            break;
          case "&": //espaço
            ctx.fillStyle = "#dcdcdc";
            break;
          default:
            ctx.fillStyle = "#ffffff"; //vazio
        }
        ctx.fillRect(x, y, grid, grid);

        //sprites gerais

        //se houver sprite para o tipo atual
        if (sprites[cell]) {
          ctx.drawImage(sprites[cell], x, y, grid, grid);
          continue; // não desenha fallback
        }

        //pinta o chão base

        if (originalCell === types.trap || originalCell === types.slowtrap) {
          ctx.fillStyle = "#dcdcdc"; //roxo forte para ambas as armadilhas
        } else {
          ctx.fillStyle = "#dcdcdc"; //cinza claro padrão
        }
        ctx.fillRect(x, y, grid, grid);

        if (originalCell === types.slowtrap) {
          //se slowtrap está visível, desenha spike_ON
          if (slowtrapVisible) {
            ctx.drawImage(sprites.spike_ON, x, y, grid, grid);
          } else {
            ctx.drawImage(sprites.spike_OFF, x, y, grid, grid);
          }
        }

        if (originalCell === types.trap) {
          //se trap tem uma lógica de ativação/desativação,
          //usar uma variável ou condição própria
          //se a slowtrapVisible controla ambas:
          if (slowtrapVisible) {
            ctx.drawImage(sprites.spike_ON, x, y, grid, grid);
          } else {
            ctx.drawImage(sprites.spike_OFF, x, y, grid, grid);
          }
        }

        if (cell === types.blockOnTrap) {
          ctx.drawImage(sprites.blockOnTrap, x, y, grid, grid);
          continue; //pula o resto
        }

        //entidades e efeitos visuais

        //parede
        if (cell === types.wall) {
          ctx.fillStyle = "rgb(110,110,110)";
          ctx.fillRect(x, y, grid, grid);
          ctx.strokeStyle = "black";
          ctx.strokeRect(x, y, grid, grid);
        }

        //chave
        if (cell === types.key) {
          if (sprites.key.complete) {
            ctx.drawImage(sprites.key, x, y, grid, grid);
          } else {
            //fallback 
            ctx.fillStyle = "yellow";
            ctx.fillRect(x + 10, y + 10, grid - 20, grid - 20);
          }
        }

        //fechadura
        if (cell === types.keyhole) {
          if (sprites.keyhole.complete) {
            ctx.drawImage(sprites.keyhole, x, y, grid, grid);
          } else {
            //fallback
            ctx.fillStyle = "gold";
            ctx.fillRect(x, y, grid, grid);
          }
        }

        //função para desenhar cada inimigo
        function desenharEnemy(ctx, dados, col, row) {
          dados.posx = col * grid;
          dados.posy = row * grid;

          //largura e altura do quadro na spritesheet
          const spriteW =
            dados.enemyImg.width || dados.largura * dados.spritesPorLinha;
          const spriteH = dados.enemyImg.height || dados.altura;

          ctx.drawImage(
            dados.enemyImg,
            (spriteW / dados.spritesPorLinha) * dados.numeroSprite,
            0, //linha 0 se for apenas animação idle horizontal
            dados.largura,
            dados.altura,
            dados.posx,
            dados.posy,
            dados.larguraFinal,
            dados.alturaFinal
          );

          //atualiza animação
          if (dados.atrasarSprite > 0) {
            dados.atrasarSprite--;
          } else {
            dados.atrasarSprite = dados.maxAtrasarSprite;
            dados.numeroSprite =
              (dados.numeroSprite + 1) % dados.spritesPorLinha;
          }
        }

        //monstro
        if (cell === types.enemy) {
          desenharEnemy(ctx, enemyDados, col, row);
          continue;
        }

        if (
          cell === types.block ||
          cell === types.blockOnGoal ||
          cell === types.blockOnTrap
        ) {
          //fundo do bloco fallback
          ctx.fillStyle = "#ffbb5b";
          ctx.fillRect(x + 8, y + 8, grid - 16, grid - 16);

          //sprite box.png acima do fundo
          if (sprites.block.complete) {
            //mesmo tamanho do bloco gráfico
            ctx.drawImage(sprites.block, x + 8, y + 8, grid - 16, grid - 16);
          }
        }

        //meta (goal)
        if (
          cell === types.goal ||
          cell === types.blockOnGoal ||
          cell === types.playerOnGoal
        ) {
          ctx.strokeStyle = "#333";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x + grid * 0.3, y + grid * 0.3);
          ctx.lineTo(x + grid * 0.7, y + grid * 0.7);
          ctx.moveTo(x + grid * 0.7, y + grid * 0.3);
          ctx.lineTo(x + grid * 0.3, y + grid * 0.7);
          ctx.stroke();
          ctx.closePath();
          ctx.lineWidth = 1;
        }
      }
    }
  }

  /*mensagem de vitória*/
  let rAF;
  let gameWon = false;
  function showWin() {
    //desenha overlay de vitória
    context.fillStyle = "black";
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
    context.globalAlpha = 1;
    context.fillStyle = "white";
    context.font = "36px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2);
  }

  /*loop principal*/
  function loop() {
    rAF = requestAnimationFrame(loop);

    //desenha mapa (paredes, caixas, metas)
    desenharMapa(context);

    //desenha jogador por cima
    desenharJogador(context, jogadorDados);

    //desenhar contador de passos
    context.font = "bold 48px monospace";
    context.fillStyle = "white";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(passos, 20, 20);

    if (!gameLoopAtivo) return; //impede o loop de rodar se o jogo estiver parado

    //checa vitória
    if (!gameWon && checkWin()) {
      gameWon = true;
      //mostra a vitória e bloquea inputs por flag
    }

    if (gameWon) {
      showWin();
    }
  }

  /*inicia loop*/
  rAF = requestAnimationFrame(loop);

  /*inputs*/
  window.addEventListener("keydown", (e) => {
    if (gameWon) return; //bloquea inputs após vitória

    let moved = false;
    const key = e.key.toLowerCase(); //garante que funcione com maiúsculas/minúsculas

    if (key === "a") {
      moved = tryMovePlayer(-1, 0); 
    } else if (key === "d") {
      moved = tryMovePlayer(1, 0); 
    } else if (key === "w") {
      moved = tryMovePlayer(0, -1); 
    } else if (key === "s") {
      moved = tryMovePlayer(0, 1); 
    }

    //atualiza o jogo após movimento
    if (moved) {
      checkWin();// verifica vitória
      //o loop principal já redesenha automaticamente
    }
  });

  loadLevel(0); //carrega o primeiro nível
}

/*FIM*/
