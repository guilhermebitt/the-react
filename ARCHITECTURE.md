# Arquitetura do projeto

Este documento define a organização de `src` e as responsabilidades de cada pasta. A regra principal é manter a interface, as regras do RPG e os efeitos globais separados.

## Pastas na raiz

| Pasta | Responsabilidade | Regras |
| --- | --- | --- |
| `public` | Arquivos servidos diretamente pelo Vite, como sprites, imagens, áudios e favicon. | Use caminhos públicos, como `/assets/...`; não importe regras, componentes ou estado daqui. |
| `src` | Código-fonte da aplicação React. | Todo código da aplicação deve respeitar as camadas descritas abaixo. |

## Estrutura de `src`

| Pasta | Responsabilidade | Regras |
| --- | --- | --- |
| `assets` | Estilos e recursos importados pelo código. | Estilos globais ficam em `assets/css`; não coloque regras de jogo aqui. |
| `components` | Componentes reutilizáveis e partes da interface. | Renderizam UI e recebem dados por props, hooks ou stores. Não concentre fluxos globais em componentes visuais. |
| `components/common` | Componentes genéricos compartilhados. | Não devem depender de um domínio específico do RPG. |
| `components/game` | Componentes visuais da experiência de jogo. | Não devem assumir a responsabilidade por ciclos globais da partida. |
| `components/map` | Componentes de apresentação do mapa. | Devem se limitar à renderização e interação do mapa. |
| `components/Perks` | Componentes visuais relacionados a perks. | Regras e efeitos dos perks ficam em hooks ou em `logic`. |
| `components/sections` | Agrupamentos visuais maiores de uma tela. | Podem coordenar seus filhos, mas não devem substituir uma tela. |
| `components/ui` | HUD, barras, modais e elementos de interface do jogo. | Não devem conter regras de domínio extensas. |
| `data` | Dados estáticos do jogo, em JSON ou TypeScript. | Não coloque estado mutável nem efeitos de React. |
| `hooks` | Hooks React reutilizáveis e adaptadores entre UI, stores e regras. | Pode usar hooks React e Zustand. Todo hook começa com `use`. |
| `hooks/game` | Hooks específicos do domínio do jogo, como perks e status. | Pode reagir a stores e disparar regras; regras puras devem permanecer em `logic`. |
| `logic` | Regras de domínio independentes da UI, como turnos, eventos e geração de mapa. | Não pode usar JSX, `useEffect`, `useState` ou outros hooks React. Prefira receber dependências como parâmetros. |
| `managers` | Processos globais sem interface, montados uma vez pela aplicação. | Renderizam `null` e observam/sincronizam efeitos globais, como áudio, batalha, progresso do jogador e mapa. |
| `screens` | Páginas vinculadas às rotas. | Compõem componentes e definem a experiência de uma rota; evite colocar regras de domínio nelas. |
| `stores` | Estado global e ações Zustand. | Cada store representa um domínio. Evite efeitos de React e renderização. |
| `types` | Tipos, interfaces e constantes TypeScript. | Sem efeitos, UI ou estado mutável. |
| `utils` | Utilitários genéricos e entidades compartilhadas. | Não devem depender de React; se a função for uma regra de RPG, prefira `logic`. |

## Decisão rápida: onde criar um arquivo?

- É uma regra que recebe dados e calcula ou altera um resultado? Use `logic`.
- Precisa de `useEffect`, `useState`, `useMemo` ou conectar regras a stores? Use `hooks`.
- Precisa estar montado uma vez e reagir ao estado global sem desenhar nada? Use `managers`.
- Desenha algo na tela? Use `components` ou `screens`.

## Convenções atuais

- `BattleManager` centraliza os efeitos globais de uma batalha; ele substitui o antigo `BattleEventLogic`.
- `usePerkLogic` e `useStatusLogic` são hooks de domínio e ficam em `hooks/game`.
- Managers vazios não devem ser mantidos. Crie um novo manager somente quando houver um efeito global real para ele coordenar.
