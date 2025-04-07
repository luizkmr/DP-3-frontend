document.addEventListener("DOMContentLoaded", () => {
  const perguntas = [
    { name: 'nome', label: 'Seu nome *', type: 'text' },
    { name: 'email', label: 'E-mail *', type: 'email' },
    { name: 'whatsapp', label: 'WhatsApp *', type: 'tel' },
    { name: 'cidade', label: 'Cidade *', type: 'text' },
    { name: 'nome_negocio', label: 'Nome do negócio *', type: 'text' },
    { name: 'instagram', label: 'Instagram', type: 'text' },
    { name: 'modelo_negocio', label: 'Modelo de negócio *', type: 'text' },
    { name: 'nicho_problema', label: 'Qual problema você resolve? *', type: 'textarea' },
    { name: 'investimento_mkt', label: 'Investimento em marketing (R$)', type: 'number' },
    { name: 'ticket_medio', label: 'Ticket médio (R$)', type: 'number' },
    { name: 'vendas_mensais', label: 'Vendas nos últimos 3 meses', type: 'number' },
    { name: 'meta_crescimento', label: 'Meta de crescimento *', type: 'text' },
    { name: 'maior_desafio', label: 'Maior desafio hoje *', type: 'textarea' },
    { name: 'estrutura_trabalho', label: 'Sua estrutura atual', type: 'textarea' },
    { name: 'ferramentas', label: 'Ferramentas que usa', type: 'text' },
    { name: 'resultado_esperado', label: 'O que você espera deste diagnóstico? *', type: 'textarea' },
    { name: 'interesse_ajuda', label: 'Gostaria de ajuda para aplicar o plano?', type: 'radio', options: ['Sim', 'Não'] }
  ]

  const presentation = document.getElementById('presentation-screen')
  const formScreen = document.getElementById('form-screen')
  const processing = document.getElementById('processing-screen')
  const result = document.getElementById('result-screen')
  const questionContainer = document.getElementById('question-container')
  const progressText = document.getElementById('progress-text')
  const progressFill = document.getElementById('progress-fill')
  const nextBtn = document.getElementById('next-button')
  const prevBtn = document.getElementById('prev-button')
  const startBtn = document.getElementById('start-button')

  let step = 0
  const respostas = {}

  const showScreen = (screen) => {
    [presentation, formScreen, processing, result].forEach(s => s.classList.remove('active'))
    screen.classList.add('active')
  }

  startBtn.addEventListener('click', () => {
    step = 0
    renderQuestion()
    showScreen(formScreen)
  })

  nextBtn.addEventListener('click', () => {
    if (!validarCamposObrigatorios()) return

    const input = questionContainer.querySelector('input, textarea, select')
    if (input) respostas[input.name] = input.value || ''

    if (step < perguntas.length - 1) {
      step++
      renderQuestion()
    } else {
      showScreen(processing)
      enviarRespostas()
    }
  })

  prevBtn.addEventListener('click', () => {
    if (step > 0) {
      step--
      renderQuestion()
    }
  })

  function renderQuestion() {
    const q = perguntas[step]
    progressText.textContent = `Pergunta ${step + 1} de ${perguntas.length}`
    progressFill.style.width = `${((step + 1) / perguntas.length) * 100}%`

    let html = `<div class="question"><h3>${q.label}</h3>`
    if (q.type === 'textarea') {
      html += `<textarea name="${q.name}" class="input-text">${respostas[q.name] || ''}</textarea>`
    } else if (q.type === 'radio') {
      html += q.options.map(opt => `
        <label class="radio-item">
          <input type="radio" name="${q.name}" value="${opt}" ${respostas[q.name] === opt ? 'checked' : ''}> ${opt}
        </label>`).join('')
    } else {
      html += `<input type="${q.type}" name="${q.name}" value="${respostas[q.name] || ''}" />`
    }
    html += `</div>`
    questionContainer.innerHTML = html

    prevBtn.disabled = step === 0
  }

  function validarCamposObrigatorios() {
    const atual = document.querySelector('#question-container')
    const campo = atual.querySelector('[name]')
    const label = atual.querySelector('h3')
    const isEmpty =
      !campo ||
      (campo.type === 'radio' && !atual.querySelector('input:checked')) ||
      (campo.type === 'checkbox' && atual.querySelectorAll('input:checked').length === 0) ||
      campo.value.trim() === ''

    atual.querySelectorAll('input, select, textarea').forEach(i => {
      i.style.border = '1px solid #ccc'
    })

    if (isEmpty) {
      campo?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      label.innerHTML += ` <span style="color:red">*</span>`
      atual.querySelectorAll('input, select, textarea').forEach(i => {
        i.style.border = '2px solid red'
      })
      return false
    }

    return true
  }

  async function enviarRespostas() {
    const res = await fetch('https://dpa-sk6b.onrender.com/api/gerar-diagnostico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respostas })
    })

    const data = await res.json()
    document.getElementById('diagnosis-container').innerHTML = data.html || '<p>Erro ao gerar diagnóstico.</p>'
    showScreen(result)
  }
})
