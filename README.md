# DEATH RUSH: INFERNAL ASCENSION — V1.2 CUMULATIVA

Jogo HTML5 offline-first, top-down, roguelite de fantasia sombria para Android e PC. Sem dependências externas. **A V1.2 contém integralmente a V1.1**, sem exigir arquivos antigos.

## Novidades da V1.2

- **Hordas Eternas:** ondas infinitas de 30s, a cada 5 ondas um reforço elite e premiação; Malgor volta a cada 10 ondas, mais forte, e não encerra a partida.
- **Mutação de armas:** evolua Sentinelas, Raios, Lâminas, Fogo e Espectros do nível V até Rara, Épica e Lendária. Escolha um de dois caminhos (Destruição e Ritual) com nomes e efeitos exclusivos.
- **Pontos de Evolução:** conquistados a cada 5 ondas (+1) e ao matar Malgor (+2), utilizados apenas durante a partida.
- **Forja do Abismo:** relíquias sobem do nível I ao V em cada raridade, utilizando almas e Núcleos de Forja; bônus aplicado nos atributos reais.
- **Maestria Permanente:** pontos de eficiência para cada uma das cinco armas, máximo 5 por habilidade. Pontos ganhos nas ondas e chefões.
- **Endgame infinito:** após maximizar os níveis normais, opções repetíveis de vida, dano e coleta.
- **Recordes:** melhor onda alcançada, mantida no mesmo save da V1/V1.1.
- **Preservado:** três classes, quatro especiais, combate automático, joystick, esquiva, melhorias existentes, partidas de 5 minutos e teste de 90 segundos.

Detalhes completos dos nomes de evoluções, custos, fórmulas e regras: **[EVOLUCOES_E_BALANCEAMENTO_V1_2.md](EVOLUCOES_E_BALANCEAMENTO_V1_2.md)**.

## Abrir localmente

Extraia o ZIP. Abra `index.html` no navegador de PC. No Android, prefira subir o projeto no GitHub Pages e abrir pelo Chrome (HTTPS), pois a instalação PWA precisa de contexto seguro.

## Atualização via ZIP no GitHub

**Configuração inicial única**: adicione ao seu repositório o arquivo `.github/workflows/deploy-from-zip.yml` que está dentro deste ZIP (não adianta deixá-lo apenas dentro do ZIP: o GitHub precisa ter um workflow já instalado para poder extrair pacotes). Em Settings → Pages → Build and deployment, selecione **GitHub Actions**. Certifique-se de que o GitHub Actions tem permissão de escrita no repositório e que o Pages está disponível.

Depois, envie `DEATH_RUSH_V1_2_CUMULATIVA.zip` diretamente para a raiz do repositório, na branch main, sem extrair. Em Actions, o workflow extrai e valida, faz commit dos arquivos, exclui o ZIP e publica no Pages. Nas versões futuras, basta enviar o próximo ZIP.

O workflow existente ignora arquivos dentro de `.github/` durante a extração como medida de segurança. Para atualizações futuras do próprio workflow, edite-o diretamente em `.github/workflows/`.

## Save e segurança

Progressão local em `localStorage` na chave `deathrush.infernal.v1`. Save das versões anteriores é mantido, com novos campos inicializados de forma compatível. Nada é enviado para um servidor. Progresso não é sincronizado entre dispositivos e pode ser perdido se limpar os dados do site. O modo Hordas Eternas registra imediatamente núcleos e pontos permanentes; almas acumuladas na partida são consolidadas na retirada ou morte.

## Validação

O código JavaScript foi verificado sintaticamente (`node --check`) e a lógica de ondas, chefe, evoluções, forja, maestria, retirada e modo rápido foi testada num ambiente JS simulado. Não foi possível executar uma validação gráfica automatizada no navegador desta sessão: realize um teste de FPS e interface em Android real após publicar. O limite de ~105 inimigos mobile é alvo técnico, não garantia universal de FPS.
