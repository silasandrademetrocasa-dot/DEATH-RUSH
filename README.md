# DEATH RUSH — INFERNAL ASCENSION V1.0

Protótipo **cumulativo e jogável**, totalmente em **HTML, CSS e JavaScript puro**, sem dependências, sem API externa e sem servidor de jogo.

## Jogar agora

1. Extraia o ZIP.
2. Abra `index.html` no Chrome, Edge, Firefox ou navegador Android moderno.
3. Escolha seu pacto e clique em **INICIAR CAÇADA**.

**Importante:** o jogo por arquivo local (`file://`) funciona, mas a instalação como PWA e o service worker exigem uma origem HTTP segura (`https://` ou `http://localhost`). Para servir localmente, rode no diretório do jogo:

```bash
python -m http.server 8080
```

Abra `http://localhost:8080`. Para Android e instalação, publique os arquivos em **GitHub Pages** (HTTPS) ou outro host estático. Use o menu do navegador → *Adicionar à tela inicial* / *Instalar app*. O progresso fica salvo somente no navegador e dispositivo em uso; não há sincronização entre aparelhos.

## Controles

| Comando | Celular | Teclado |
|---|---|---|
| Movimentação | Joystick inferior esquerdo | WASD ou setas |
| Atacar | Automático | Automático |
| Esquiva | Botão ↯ inferior direito | Espaço |
| Pausar | Botão Ⅱ | P ou Esc |
| Escolher upgrade | Toque no cartão | 1, 2 ou 3 |

## Conteúdo incluído

- 3 pactos iniciais: **Carnificina**, **Necromancia**, **Ascensão Infernal**.
- Arena procedural com ruínas, runas e solo vulcânico.
- 4 tipos de demônios: **imps**, **cães do abismo**, **cultistas**, **brutos**; versões elite com mais vida.
- Ataque automático, projéteis, efeitos de colisão e botão de esquiva.
- 10 tipos de melhorias com até 5 níveis; 3 armas evolutivas (lâminas, círculos de fogo e espectros).
- Coleta de XP, níveis, upgrades aleatórios e poder permanente.
- Frenesi em quatro estágios e transformação demoníaca temporária.
- Malgor, chefão com barras de HP, duas fases, projéteis radiais e ataques telegrafados.
- Modo padrão de **5 minutos** com Malgor aparecendo a partir de ~3min58s; modo rápido de **90 segundos** com chefão a partir de 56s.
- **Relicário com 6 itens equipáveis**: armas, armaduras e amuletos, obtidos de elites e chefão; efeitos aplicados nas partidas seguintes.
- Pontuação, almas por abates, moeda adicional por vitória, recordes e **Altar de Poder**.
- Save com `localStorage`, som procedural Web Audio e ajuste gráfico Alto/Baixo/Automático.
- Canvas responsivo, processamento de inimigos limitado, PWA básico e cache offline.

## Organização

```text
index.html             Interface, HUD e menus
style.css              Layout e responsividade
 game.js               Motor de jogo, física, combate, progressão, desenhos proceduralmente renderizados
manifest.webmanifest   Instalação PWA
service-worker.js      Cache offline
assets/icon-*.png      Ícones do aplicativo
```

## Observações e limites honestos da V1

- Arte é **procedural/vetorial desenhada no Canvas**, sem sprites externos. Não inclui spritesheets animadas produzidas por artista.
- Saves podem desaparecer ao limpar dados do site. Não há conta, nuvem, multiplayer, backend ou loja real.
- Balanceamento e FPS são **objetivos a validar em aparelhos reais**; não há garantia de 30 FPS em todo Android.
- O limite de inimigos é adaptado à largura/tipo de ponteiro para reduzir uso de CPU; isso não é um benchmark.
- O modo de 90 segundos é para desenvolvimento e demonstração; as almas são concedidas nos dois modos.

## Próximas melhorias naturais

Criar sprites com atlas e animações reais; outras arenas e chefões; inventário visual com itens equipáveis; novos inimigos e chefões; balanceamento com telemetria local; conquistas e missões; desafios diários; persistência em nuvem opcional.

© Projeto original de protótipo. Sem bibliotecas ou assets de terceiros.
