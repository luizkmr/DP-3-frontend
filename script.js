document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("download-pdf")
  const restartBtn = document.createElement("button")

  if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {
      const target = document.getElementById("diagnosis-container")
      if (!target) return alert("Diagnóstico não encontrado.")

      alert("📥 Iniciando download do PDF...")

      const canvas = await html2canvas(target)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jspdf.jsPDF("p", "mm", "a4")
      const largura = pdf.internal.pageSize.getWidth()
      const altura = pdf.internal.pageSize.getHeight()
      pdf.addImage(imgData, "PNG", 0, 0, largura, altura)
      pdf.save("diagnostico.pdf")
    })
  }

  restartBtn.id = "restart-button"
  restartBtn.className = "secondary-button"
  restartBtn.innerHTML = '<i class="fas fa-redo"></i> Reiniciar Diagnóstico'
  restartBtn.style.marginTop = "10px"
  const resultScreen = document.getElementById("result-screen")
  if (resultScreen) {
    resultScreen.appendChild(restartBtn)
    restartBtn.addEventListener("click", () => {
      localStorage.removeItem("diagnostico_respostas")
      localStorage.removeItem("diagnostico_html")
      document.getElementById("diagnosis-container").innerHTML = ""
      document.getElementById("presentation-screen").classList.add("active")
      document.getElementById("result-screen").classList.remove("active")
    })
  }

  const form = document.getElementById("diagnostico-form")
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault()

      const respostas = {
        nome: document.getElementById("nome")?.value,
        email: document.getElementById("email")?.value,
        whatsapp: document.getElementById("whatsapp")?.value,
        nome_negocio: document.getElementById("nome_negocio")?.value,
        site: document.getElementById("site")?.value,
        cidade: document.getElementById("cidade")?.value,
        instagram: document.getElementById("instagram")?.value,
        socios: document.getElementById("socios")?.value,
        nicho_problema: document.getElementById("nicho_problema")?.value,
        modelo_negocio: document.getElementById("modelo_negocio")?.value
      }

      localStorage.setItem("diagnostico_respostas", JSON.stringify(respostas))

      fetch("https://dp-3-backend-production.up.railway.app/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(respostas)
      })
        .then(res => res.json())
        .then(data => {
          const htmlFinal = `
            <div class="bloco">
              <h2>📌 Diagnóstico Estratégico</h2>
              <p>${data.diagnostico}</p>

              <h2>🔍 Oportunidades e Ameaças</h2>
              <p>${data.oportunidades}</p>

              <h2>📊 Projeção de Faturamento</h2>
              <p>${data.faturamento}</p>

              <h2>✅ Plano de Ação</h2>
              <p>${data.plano_acao}</p>
            </div>
          `
          document.getElementById("diagnosis-container").innerHTML = htmlFinal
          localStorage.setItem("diagnostico_html", htmlFinal)
        })
        .catch(async error => {
          let mensagem = "Erro desconhecido."
          if (error?.response) {
            const erroJson = await error.response.json().catch(() => ({}))
            mensagem = erroJson?.erro || JSON.stringify(erroJson)
          }
          console.error("Erro ao enviar dados:", error)
          alert("Erro ao gerar o diagnóstico: " + mensagem)
        })
    })
  }
})
