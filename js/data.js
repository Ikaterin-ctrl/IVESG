/* ==========================================================
   data.js — Dados mockados · Impacto Verde ESG
   ========================================================== */

const DATA = {

  empresa: {
    nome: 'Demo Corp S.A.',
    cnpj: '12.345.678/0001-99',
    segmento: 'Indústria Farmacêutica',
    estado: 'SP',
    plano: 'PRO'  // demo visitor usa PRO para mostrar o dashboard completo
  },

  /* ── Pilares ESG ── */
  pilares: {
    ambiental: {
      nome: 'AMBIENTAL',
      cor: '#AAFF00',
      corBorda: '#AAFF00',
      score: 82,
      pontosFortesTexto: [
        '96% dos resíduos destinados corretamente',
        'Rastreabilidade ponta a ponta ativa',
        '2,1t de CO₂ evitado no período'
      ],
      pontosDemelhoriaTexto: [
        '1 lote pendente de emissão de MTR',
        'Ampliar rede de cooperativas para 8+'
      ],
      icone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 22l10-10M12 2c0 6-4 10-10 10M22 12c-6 0-10 4-10 10"/></svg>`
    },
    social: {
      nome: 'SOCIAL',
      cor: '#0047FF',
      corBorda: '#0047FF',
      score: 71,
      pontosFortesTexto: [
        '6 cooperativas com acesso gratuito',
        '38 empregos indiretos gerados'
      ],
      pontosDemelhoriaTexto: [
        'Ampliar treinamentos de descarte correto',
        'Adicionar 2 comunidades ao programa'
      ],
      icone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>`
    },
    governanca: {
      nome: 'GOVERNANÇA',
      cor: '#7B00FF',
      corBorda: '#7B00FF',
      score: 88,
      pontosFortesTexto: [
        '100% de conformidade PNRS',
        '31 MTRs emitidos com validade jurídica',
        '0 multas ambientais no período'
      ],
      pontosDemelhoriaTexto: [
        'Emitir MTR faltante (1 pendente)',
        'Contratar auditoria ISO 14001'
      ],
      icone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
    }
  },

  /* ── Score geral (média ponderada dos pilares) ── */
  get scoreGeral() {
    const p = this.pilares;
    return Math.round(p.ambiental.score * .4 + p.social.score * .3 + p.governanca.score * .3);
  },

  /* ── Série mensal para gráfico de barras ── */
  seriesMensal: [
    { mes: 'FEV', kg: 550,  score: 72 },
    { mes: 'MAR', kg: 700,  score: 74 },
    { mes: 'ABR', kg: 620,  score: 76 },
    { mes: 'MAI', kg: 800,  score: 79 },
    { mes: 'JUN', kg: 750,  score: 82 },
    { mes: 'JUL', kg: 860,  score: 80 }
  ],

  /* ── Ações recomendadas para o dashboard ── */
  acoes: [
    { texto: 'Registrar lote de blisters farmacêuticos pendente (240 kg)', tag: 'ambiental', done: false },
    { texto: 'Emitir MTR do lote LOTE-2025-041 até 20/07', tag: 'governanca', done: false },
    { texto: 'Cadastrar nova cooperativa parceira para atingir meta de 8', tag: 'social', done: true  },
    { texto: 'Agendar treinamento de descarte correto para equipe operacional', tag: 'social', done: false },
    { texto: 'Gerar relatório ESG de Julho/2025 para envio à auditoria', tag: 'governanca', done: false }
  ],

  /* ── Questionário de diagnóstico ── */
  etapas: [
    {
      titulo: 'AMBIENTAL',
      cor: '#AAFF00',
      corTexto: 'black',
      perguntas: [
        {
          id: 'amb_1',
          tipo: 'radio',
          texto: 'SUA EMPRESA REALIZA DESCARTE CORRETO DE RESÍDUOS SÓLIDOS?',
          opcoes: [
            { valor: 0,  label: 'Não temos nenhum processo formal de descarte' },
            { valor: 33, label: 'Descartamos alguns resíduos corretamente, sem rastreamento' },
            { valor: 66, label: 'Temos processo de descarte, mas sem documentação' },
            { valor: 100,label: 'Descarte 100% documentado com MTR e cooperativas homologadas' }
          ]
        },
        {
          id: 'amb_2',
          tipo: 'radio',
          texto: 'COMO SUA EMPRESA MONITORA O CONSUMO DE ENERGIA E EMISSÃO DE CO₂?',
          opcoes: [
            { valor: 0,  label: 'Não monitoramos' },
            { valor: 33, label: 'Monitoramos informalmente em planilhas' },
            { valor: 66, label: 'Temos metas definidas mas sem auditoria' },
            { valor: 100,label: 'Inventário de GEE auditado e publicado anualmente' }
          ]
        },
        {
          id: 'amb_3',
          tipo: 'slider',
          texto: 'QUE PERCENTUAL DE SEUS RESÍDUOS É DESTINADO CORRETAMENTE?',
          min: 0, max: 100, unidade: '%', default: 50
        }
      ]
    },
    {
      titulo: 'SOCIAL',
      cor: '#0047FF',
      corTexto: 'white',
      perguntas: [
        {
          id: 'soc_1',
          tipo: 'radio',
          texto: 'SUA EMPRESA POSSUI PROGRAMA DE DIVERSIDADE E INCLUSÃO?',
          opcoes: [
            { valor: 0,  label: 'Não temos nenhuma iniciativa formal' },
            { valor: 33, label: 'Temos algumas ações pontuais sem política definida' },
            { valor: 66, label: 'Política D&I documentada mas não monitorada' },
            { valor: 100,label: 'Política ativa com metas, acompanhamento e relatórios' }
          ]
        },
        {
          id: 'soc_2',
          tipo: 'radio',
          texto: 'COMO SUA EMPRESA APOIA A CADEIA DE FORNECEDORES E COMUNIDADE LOCAL?',
          opcoes: [
            { valor: 0,  label: 'Sem iniciativas formais com fornecedores ou comunidade' },
            { valor: 33, label: 'Ações eventuais de doação ou apoio sem estrutura' },
            { valor: 66, label: 'Programa de desenvolvimento de fornecedores locais' },
            { valor: 100,label: 'Política de compras sustentáveis com critérios ESG obrigatórios' }
          ]
        },
        {
          id: 'soc_3',
          tipo: 'slider',
          texto: 'QUAL O PERCENTUAL DE MULHERES EM CARGOS DE LIDERANÇA NA SUA EMPRESA?',
          min: 0, max: 100, unidade: '%', default: 30
        }
      ]
    },
    {
      titulo: 'GOVERNANÇA',
      cor: '#7B00FF',
      corTexto: 'white',
      perguntas: [
        {
          id: 'gov_1',
          tipo: 'radio',
          texto: 'SUA EMPRESA PUBLICA RELATÓRIO DE SUSTENTABILIDADE OU ESG?',
          opcoes: [
            { valor: 0,  label: 'Nunca publicamos nenhum relatório' },
            { valor: 33, label: 'Publicamos internamente mas não para stakeholders' },
            { valor: 66, label: 'Relatório anual publicado sem auditoria externa' },
            { valor: 100,label: 'Relatório auditado externamente seguindo GRI ou SASB' }
          ]
        },
        {
          id: 'gov_2',
          tipo: 'radio',
          texto: 'COMO SUA EMPRESA GERENCIA RISCOS AMBIENTAIS E COMPLIANCE?',
          opcoes: [
            { valor: 0,  label: 'Não temos gestão formal de riscos ambientais' },
            { valor: 33, label: 'Riscos identificados informalmente' },
            { valor: 66, label: 'Matriz de riscos atualizada semestralmente' },
            { valor: 100,label: 'Sistema de gestão certificado (ISO 14001 ou equivalente)' }
          ]
        },
        {
          id: 'gov_3',
          tipo: 'radio',
          texto: 'SUA EMPRESA POSSUI CÓDIGO DE ÉTICA E CANAL DE DENÚNCIAS?',
          opcoes: [
            { valor: 0,  label: 'Não temos nenhum documento formal' },
            { valor: 33, label: 'Código de ética existe mas não é divulgado ativamente' },
            { valor: 66, label: 'Código de ética publicado sem canal de denúncias' },
            { valor: 100,label: 'Código de ética + canal anônimo + treinamentos regulares' }
          ]
        }
      ]
    },
    {
      titulo: 'DADOS GERAIS',
      cor: '#AAFF00',
      corTexto: 'black',
      perguntas: [
        {
          id: 'ger_1',
          tipo: 'radio',
          texto: 'QUAL O PORTE DA SUA EMPRESA?',
          opcoes: [
            { valor: 0,  label: 'MEI ou Microempresa (até 9 funcionários)' },
            { valor: 33, label: 'Pequena empresa (10 a 49 funcionários)' },
            { valor: 66, label: 'Média empresa (50 a 499 funcionários)' },
            { valor: 100,label: 'Grande empresa (500+ funcionários)' }
          ]
        },
        {
          id: 'ger_2',
          tipo: 'radio',
          texto: 'JÁ INVESTIU EM CONSULTORIA ESG ANTERIORMENTE?',
          opcoes: [
            { valor: 0,  label: 'Nunca e não temos orçamento para isso' },
            { valor: 33, label: 'Nunca, mas gostaríamos de investir' },
            { valor: 66, label: 'Sim, uma vez para mapeamento inicial' },
            { valor: 100,label: 'Sim, mantemos consultoria contínua' }
          ]
        },
        {
          id: 'ger_3',
          tipo: 'slider',
          texto: 'EM UMA ESCALA DE 0 A 100, QUAL A PRIORIDADE DO ESG PARA SUA EMPRESA HOJE?',
          min: 0, max: 100, unidade: 'pts', default: 50
        }
      ]
    }
  ],

  /* ── Recomendações por faixa de score ── */
  recomendacoes: {
    baixa: [ /* score 0-49 */
      { titulo: 'MAPEAMENTO DE RESÍDUOS', dificuldade: 'FÁCIL', impacto: 'ALTO', desc: 'Identifique e classifique todos os resíduos gerados na operação seguindo a ABNT NBR 10.004.' },
      { titulo: 'POLÍTICA AMBIENTAL BÁSICA', dificuldade: 'FÁCIL', impacto: 'ALTO', desc: 'Elabore um documento de 1 página definindo os compromissos ambientais da empresa.' },
      { titulo: 'TREINAMENTO DA EQUIPE', dificuldade: 'FÁCIL', impacto: 'MÉDIO', desc: 'Capacite colaboradores sobre descarte correto e boas práticas de sustentabilidade.' }
    ],
    media: [ /* score 50-74 */
      { titulo: 'SISTEMA DE RASTREABILIDADE', dificuldade: 'MÉDIO', impacto: 'ALTO', desc: 'Implante controle digital de resíduos com MTR e vinculação a cooperativas homologadas.' },
      { titulo: 'PRIMEIRO RELATÓRIO ESG', dificuldade: 'MÉDIO', impacto: 'ALTO', desc: 'Publique um relatório simplificado seguindo os indicadores GRI Core para PMEs.' },
      { titulo: 'PROGRAMA DE DIVERSIDADE', dificuldade: 'MÉDIO', impacto: 'MÉDIO', desc: 'Formalize metas de representatividade com indicadores mensuráveis trimestralmente.' }
    ],
    alta: [ /* score 75-100 */
      { titulo: 'CERTIFICAÇÃO ISO 14001', dificuldade: 'DIFÍCIL', impacto: 'MUITO ALTO', desc: 'Busque a certificação de sistema de gestão ambiental para credenciar a empresa a contratos premium.' },
      { titulo: 'INVENTÁRIO DE GEE AUDITADO', dificuldade: 'DIFÍCIL', impacto: 'ALTO', desc: 'Publique inventário de emissões com verificação externa para acesso a crédito verde.' },
      { titulo: 'PROGRAMA NET ZERO 2030', dificuldade: 'DIFÍCIL', impacto: 'MUITO ALTO', desc: 'Defina trajetória de descarbonização com metas SBTi para posicionamento como líder ESG do setor.' }
    ]
  },

  /* ── Planos ── */
  planos: [
    {
      id: 'basico',
      nome: 'BÁSICO',
      precoMensal: 0,
      precoAnual: 0,
      descricao: 'Para começar a jornada ESG',
      featured: false,
      features: [
        { texto: '1 diagnóstico ESG por mês',      incluso: true  },
        { texto: 'Score por pilar A/S/G',           incluso: true  },
        { texto: 'Relatório PDF básico',            incluso: true  },
        { texto: '3 recomendações de melhoria',     incluso: true  },
        { texto: 'Dashboard com histórico',         incluso: false },
        { texto: 'MTR digital ilimitado',           incluso: false },
        { texto: 'Relatório auditável para CVM',    incluso: false },
        { texto: 'Suporte dedicado',                incluso: false }
      ]
    },
    {
      id: 'pro',
      nome: 'PRO',
      precoMensal: 297,
      precoAnual: 238,
      descricao: 'Para empresas em crescimento',
      featured: true,
      features: [
        { texto: 'Diagnósticos ilimitados',          incluso: true },
        { texto: 'Score por pilar A/S/G',            incluso: true },
        { texto: 'Dashboard com histórico completo', incluso: true },
        { texto: 'MTR digital ilimitado',            incluso: true },
        { texto: 'Relatório ESG auditável (PDF)',    incluso: true },
        { texto: 'Comparativo com benchmark setorial',incluso: true },
        { texto: 'Suporte por e-mail (48h)',          incluso: true },
        { texto: 'Consultoria dedicada',              incluso: false }
      ]
    },
    {
      id: 'enterprise',
      nome: 'ENTERPRISE',
      precoMensal: 890,
      precoAnual: 712,
      descricao: 'Para grupos e grandes operações',
      featured: false,
      features: [
        { texto: 'Tudo do plano Pro',               incluso: true },
        { texto: 'Multi-CNPJ (até 10 unidades)',    incluso: true },
        { texto: 'API para integração com ERPs',    incluso: true },
        { texto: 'Relatório ISO 14001 ready',       incluso: true },
        { texto: 'Consultoria mensal dedicada',     incluso: true },
        { texto: 'SLA 99.9% + suporte 24/7',        incluso: true },
        { texto: 'Onboarding personalizado',        incluso: true },
        { texto: 'Auditoria externa incluída',      incluso: true }
      ]
    }
  ]
};
