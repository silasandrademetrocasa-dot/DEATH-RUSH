# DEATH RUSH — INFERNAL ASCENSION V1.1 CUMULATIVA

Jogo em HTML, CSS e JS puro, offline/PWA, sem dependências externas. Esta versão inclui integralmente a V1.0 mais novas mecânicas de combate, caixas e efeitos especiais. **Não foram substituídos os gráficos/sprites.**

## Conteúdo da V1.1

- **Sentinelas Orbitais (níveis I–V):** exatamente 1, 2, 3, 4 ou 5 drones que ficam orbitando o jogador. Causam dano por contato. **Sede de Sangue** aumenta a velocidade da rotação em 20% por nível e aumenta o dano dos drones em 10% por nível, além de acelerar ataques básicos.
- **Julgamento Trovejante (níveis I–V):** raios automáticos atingem alvos aleatórios próximos. Mais níveis = mais raios, dano maior e recarga menor. No nível V ocorrem sete raios por ativação, se houver alvos suficientes.
- **Baús no mapa:** cinco baús iniciais perto da origem, novos baús periodicamente e chance de baú em elites. Ao chegar perto, o especial ativa automaticamente, sem pausar a batalha.
- **4 especiais:** Ímã Abissal (puxa cristais de XP próximos em grande raio); Bomba do Juízo (mata todos os inimigos comuns e elites numa área, tira 20% da vida máxima de Malgor sem finalizar a luta); Sangue Vital (cura até o máximo); Eclipse Temporal (congela monstros, tiros e ataques inimigos por 7 segundos; o herói continua lutando).
- **Chefão:** deixa baú ao entrar na segunda fase; derrotá-lo rende espólio extra de 50 almas além de relíquia e vitória.
- **Combate mais ágil:** movimentação inicial +17%, cadência base ampliada, mais inimigos desde os primeiros segundos e frequência de hordas maior.
- **HUD:** mostra os níveis de drones e raios e informa o último especial coletado ou duração do Eclipse.
- **Compatibilidade com o save V1:** armazenamento original preservado, sem migração destrutiva.
- **PWA:** cache atualizado para a V1.1 e arquivos de código priorizados pela rede quando online.

## Como jogar

Abra `index.html` em um navegador. No celular, use joystick virtual + botão de esquiva. No computador, use WASD ou setas e espaço. Ataques são automáticos. XP oferece três escolhas de nível. Malgor chega no final da caçada. Modos de 5 minutos e 90 segundos disponíveis.

## GitHub: subir só o ZIP, extrair e excluir automaticamente

O arquivo `.github/workflows/deploy-from-zip.yml` está incluso no projeto. **GitHub não executa um workflow que ainda está dentro do ZIP.** Configure o workflow **uma única vez**, antes de enviar seu primeiro ZIP:

1. Crie um repositório público no GitHub, por exemplo `death-rush`, com branch `main`.
2. No repositório, clique em **Add file → Create new file**. No nome do arquivo digite **`.github/workflows/deploy-from-zip.yml`**, cole o conteúdo do arquivo `WORKFLOW_GITHUB_DEATH_RUSH.yml` fornecido separadamente e salve com **Commit changes**. (Você também pode enviar o arquivo dentro da pasta `.github/workflows` de uma cópia extraída.)
3. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions** (não `Deploy from a branch`).
4. No repositório, use **Add file → Upload files** para enviar **`DEATH_RUSH_V1_1_CUMULATIVA.zip`** na raiz, **sem descompactar**. Faça o commit na branch `main`.
5. Abra a aba **Actions** e acompanhe `Death Rush - ZIP cumulativo para GitHub Pages`.
6. O workflow extrai os arquivos para a raiz, exclui o ZIP, grava as alterações com commit e publica o jogo pelo GitHub Pages. Depois abra `https://SEU-USUARIO.github.io/death-rush/` (troque o usuário e nome do repositório).

**Próximas atualizações:** publique sempre um único ZIP cumulativo na raiz do repositório. Não é preciso abrir ou extrair no Android. O GitHub só executará o workflow após o seu envio/commit. É normal o commit do bot não disparar uma segunda execução; o próprio workflow já faz o deploy do site.

**Segurança:** não extrai links simbólicos, caminhos que escapem do repositório ou arquivos dentro de `.github` e `.git`. Limites de 25 MB no ZIP e 90 MB descompactado. Não apaga arquivos do jogo antigos que deixaram de estar no ZIP; nesse caso é necessário limpar explicitamente em uma atualização.

## Observações

- O jogo roda totalmente no navegador. Instalar como PWA precisa de HTTPS/localhost e do suporte do navegador.
- Saves são locais a cada dispositivo/navegador, não são sincronizados na nuvem.
- Ajuste de FPS e desempenho final devem ser validados em celulares reais.
