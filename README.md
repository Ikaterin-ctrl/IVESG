# Impacto Verde ESG — MVP

> Plataforma de diagnóstico e gestão ESG para PMEs brasileiras.  
> Projeto acadêmico — FIAP 2TDS · Startup One · Fase 5

**Time:** Catarina Costa · Miguel Garcia · Enzo Martini

---

## Demo ao vivo

Se hospedado no GitHub Pages:  
`https://<seu-usuario>.github.io/impacto-verde-esg/`

---

## Rodar localmente

Qualquer servidor estático funciona. O mais simples:

```bash
# Python 3 (já vem no macOS/Linux)
cd mvp-impacto-verde
python3 -m http.server 3131
```

Abra **http://localhost:3131** no navegador.

> Não abra o `index.html` diretamente pelo Finder/Explorer — as fontes do Google Fonts precisam de HTTP.

---

## Estrutura do projeto

```
mvp-impacto-verde/
├── index.html          ← SPA com 6 páginas
├── css/
│   └── style.css       ← Design system neo-brutalista completo
└── js/
    ├── data.js         ← Dados mockados ESG (pilares, questionário, planos)
    ├── app.js          ← Router SPA, toast, animações, planos
    ├── dashboard.js    ← KPIs, gráfico de barras, checklist de tarefas
    ├── diagnostico.js  ← Questionário multi-etapas (radio + slider)
    └── resultado.js    ← Score, medidor animado, recomendações
```

---

## Páginas disponíveis

| Página | Descrição |
|---|---|
| **Home** | Landing page com hero, stats, como funciona, proposta de valor |
| **Como Funciona** | 3 passos do produto explicados |
| **Diagnóstico** | Questionário 12 perguntas em 4 etapas — calcula score real |
| **Resultado** | Score ESG, classificação, pilares A/S/G, recomendações |
| **Dashboard** | KPIs por pilar, gráfico mensal, checklist de ações |
| **Planos** | 3 planos com toggle mensal/anual |

---

## Hospedando no GitHub Pages

1. Crie um repositório público no GitHub (ex: `impacto-verde-esg`)
2. Faça o push de todos os arquivos da pasta `mvp-impacto-verde/` para a raiz do repositório
3. Vá em **Settings → Pages → Source: Deploy from a branch → main → / (root)**
4. Aguarde ~1 minuto e acesse a URL gerada

---

## Tecnologias

- HTML5 semântico + ARIA
- CSS3 puro (variáveis, grid, flexbox, animações)
- JavaScript vanilla ES6 (sem dependências externas)
- Fontes: [Syne](https://fonts.google.com/specimen/Syne) + [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) via Google Fonts

---

## Contexto do projeto

A **Impacto Verde ESG** é uma startup SaaS B2B que resolve o problema de 85% das PMEs brasileiras que não sabem medir seu impacto ESG. O MVP valida a proposta de valor central: um diagnóstico rápido (<10min) que gera score por pilar (Ambiental, Social, Governança) com recomendações priorizadas.

**Problema central:** PMEs do setor farmacêutico/industrial enfrentam risco de multas PNRS, não têm rastreabilidade de resíduos (blisters, embalagens) e perdem acesso a crédito/licitações por falta de documentação ESG.
