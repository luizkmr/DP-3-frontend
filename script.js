document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("download-pdf")

  if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {
      const target = document.getElementById("diagnosis-container")
      if (!target) return alert("Diagnóstico não encontrado.")

      const canvas = await html2canvas(target)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jspdf.jsPDF("p", "mm", "a4")
      const largura = pdf.internal.pageSize.getWidth()
      const altura = pdf.internal.pageSize.getHeight()
      pdf.addImage(imgData, "PNG", 0, 0, largura, altura)
      pdf.save("diagnostico.pdf")
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

      fetch("https://dpa-sk6b.onrender.com/api/gerar-diagnostico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ respostas })
      })
        .then(res => res.json())
        .then(data => {
          document.getElementById("diagnosis-container").innerHTML = data.html
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
