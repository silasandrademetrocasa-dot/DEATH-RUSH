# Death Rush — Hordas Eternas V1.2

## Visão geral

Nova modalidade **Hordas Eternas**: batalha sem duração máxima. Cada onda dura 30 segundos; cada quinta onda concede um ponto de evolução de armas, um ponto permanente de Maestria e um Núcleo de Forja, além de um elite reforçado e um baú. Malgor aparece a cada dez ondas, com vida crescente e, ao ser derrotado, concede +2 pontos de evolução da partida, +1 ponto permanente de Maestria, +3 Núcleos de Forja e almas extras. A partida continua depois do chefe. É possível retirar-se pela pausa para guardar as almas. A morte também consolida as almas e recordes.

**Sistema de raridades de habilidades durante uma partida:** Comum (níveis I–V) → Rara (custo: 1 ponto de evolução) → Épica (custo: 2) → Lendária (custo: 3). A habilidade só ascende após chegar ao nível V. Na primeira ascensão, escolha o **Caminho da Destruição** ou o **Caminho do Ritual**. A escolha não pode ser alterada na mesma partida; dura até a morte ou retirada.

### Benefícios dos caminhos de evolução

| Raridade | Destruição | Ritual |
|---|---|---|
| Comum | Habilidade base (níveis I–V) | Habilidade base (níveis I–V) |
| Rara | Dano da habilidade +30% | Frequência/velocidade da habilidade +27% |
| Épica | Dano da habilidade +60% | Frequência/velocidade +54% |
| Lendária | Dano da habilidade +90% | Frequência/velocidade +81% |

No caminho da Destruição, há também +9% de velocidade por nível de raridade. No caminho do Ritual, há +10% de dano por nível de raridade. As porcentagens indicadas são multiplicadores de raridade sobre o comportamento normal da habilidade, sem levar em conta bônus permanentes de equipamento e Maestria.

### Evoluções especiais das cinco armas

| Habilidade | Rara: Destruição / Ritual | Épica: Destruição / Ritual | Lendária: Destruição / Ritual | Efeito exclusivo Lendário |
|---|---|---|---|---|
| **Sentinelas Orbitais** | Sentinelas Predadoras / Órbita Voraz | Esquadrão da Ruína / Turbilhão Escarlate | Legião do Extermínio / Anel do Apocalipse | Dispara periodicamente um projétil perfurante contra o inimigo próximo |
| **Julgamento Trovejante** | Raio de Castigo / Corrente Relampejante | Julgamento Celestial / Ritual da Tormenta | Tempestade do Fim / Céus Partidos | +2 descargas por ciclo |
| **Dança das Lâminas** | Lâminas Famintas / Giro Assassino | Dança Carniceira / Dança Frenética | Coroa da Carnificina / Furacão de Aço | +1 lâmina giratória |
| **Círculo Infernal** | Chama Abissal / Fogo Incessante | Círculo da Calamidade / Roda Flamejante | Inferno Absoluto / Sol Negro | Segunda explosão no centro do círculo |
| **Legião de Espectros** | Almas Vingativas / Ritual das Sombras | Espectros Devastadores / Invocação Frenética | Exército dos Condenados / Marcha dos Mortos | +1 espectro invocado |

**Exemplo de combinação:** Sentinelas Orbitais V + Sede de Sangue V + Maestria de Sentinelas V + Órbita Voraz → Turbilhão Escarlate → Anel do Apocalipse. O resultado mantém cinco drones e acelera a rotação, ampliando os impactos por segundo. Outra partida pode optar por Legião do Extermínio para priorizar dano de contato e projéteis perfurantes.

## Forja do Abismo — equipamentos permanentes

As seis relíquias originais mantêm suas raridades iniciais e podem evoluir. Cada relíquia tem seu próprio nível de forja (I–V) e raridade. Aumento de nível custa almas; depois do nível V é possível ascender para a próxima raridade, consumindo almas e Núcleos de Forja. A ascensão reinicia apenas o **nível daquela raridade** para I (não perde a relíquia nem o bônus), e o próximo patamar parte de um multiplicador mais alto.

Multiplicador de raridade sobre o bônus-base: **Comum 1×; Rara 1,6×; Épica 2,6×; Lendária 4,2×**. Cada nível além do primeiro da raridade atual acrescenta **12% do bônus da raridade**, totalizando +48% no nível V. **Toda ascensão aumenta o bônus mesmo com o nível reiniciado para I**, pois o multiplicador da raridade seguinte é maior que o da raridade anterior no nível V. As relíquias originalmente Raras ou Épicas preservam o bônus inicial ao migrar o save V1.1.

Custos de nível: `arredondar((45 + raridadeIndex × 65) × 1,48 ^ (nível - 1))` almas. Ascensão: `170 + raridadeIndex × 200` almas e `2 + raridadeIndex × 2` Núcleos; raridadeIndex = 0 Comum, 1 Rara, 2 Épica. Não é possível ascender acima de Lendária V.

**Onde obter Núcleos de Forja:** +1 garantido a cada 5 ondas, +3 por chefe derrotado e 30% de chance de +1 por elite derrotado. Núcleos são adicionados ao save local assim que obtidos.

## Maestria permanente das habilidades

Investir de 0 a 5 pontos por habilidade na aba **Maestria**. +1 ponto de Maestria a cada quinta onda e +1 por chefe derrotado. Pontos restantes e melhorias compradas são salvos localmente, inclusive ao fechar ou morrer na partida.

| Maestria | Efeito por ponto | Bônus no nível V |
|---|---|---|
| Sentinelas Orbitais | +8% velocidade de rotação | +40% |
| Julgamento Trovejante | +7% frequência de descargas | +35% |
| Dança das Lâminas | +9% dano das lâminas | +45% |
| Círculo Infernal | +8% raio da explosão | +40% |
| Legião de Espectros | +8% frequência de invocação | +40% |

**Fórmulas:** velocidade efetiva é multiplicativa entre o efeito de Maestria e o da evolução de raridade, sujeita às recargas mínimas configuradas para manter o jogo controlável em celulares. Forja e Altar mantêm a progressão permanente; as mutações da arma são só da partida.

## Balanceamento e desempenho

- Vida inimiga aumenta +23% da vida-base por onda, até +2400% (multiplicador máximo 25×); dano inimigo aumenta +7,5% por onda até multiplicador 5×.
- A quantidade de monstros ativos permanece limitada pelo perfil de dispositivo: até ~105 em mobile, ~155 em desktop; maior dificuldade vem da resistência, composição e ritmo, não de criar milhares de entidades simultaneamente.
- A cadência de aparição acelera gradualmente, limitada a um intervalo mínimo de 0,24 segundo entre grupos.
- O número de projéteis amigáveis continua limitado a 155; projéteis hostis de chefes passam a ter limite de 200; partículas mantêm os limites anteriores.
- Após maximizar as melhorias normais, as opções repetíveis Vigor Eterno (+15 vida), Fúria Eterna (+4% dano) e Colheita Eterna (+14 alcance de XP) mantêm a evolução ativa em ondas longas.
- O recorde de onda, Núcleos, Maestria, Relíquias, Almas e melhorias antigas são mantidos na mesma chave de save V1.

## Fluxo para a V1.2

1. Menu → **♾ Hordas Eternas**.
2. Obtenha XP e evolua suas habilidades até nível V.
3. Chegou à onda 5? Use o botão **✦ EVOLUIR** no HUD para escolher a mutação Rara. Continue avançando para Épica/Lendária com mais pontos.
4. Colete caixas e enfrente elites; os quatro especiais da V1.1 permanecem funcionando.
5. Derrote Malgor a cada décima onda e continue a partida.
6. Pause → **RETIRAR E GUARDAR ALMAS** para salvar o resultado. Na tela inicial use **RELICÁRIO** (melhora equipamentos) e **MAESTRIA** (melhora eficiência).

### Regras técnicas

- HTML, CSS e JavaScript puros; sem bibliotecas externas, servidor ou build.
- Sem alterações artísticas nessa versão: mantidos os desenhos e efeitos existentes.
- Save em localStorage, chave `deathrush.infernal.v1`, preservando compatibilidade com V1.0 e V1.1. Backup manual do navegador recomendado: limpar armazenamento do site apaga o progresso.
- O workflow `.github/workflows/deploy-from-zip.yml` permanece igual ao V1.1. Depois de instalado uma única vez e configurado o GitHub Pages para **GitHub Actions**, basta enviar o ZIP cumulativo ao repositório (na raiz ou em `uploads/`). O workflow valida, extrai, remove o ZIP do Git e publica os arquivos da nova versão.
