document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("balancoForm");
  const resultadoContainer = document.getElementById("resultados-container");
  const recomeçarBtn = document.getElementById("recomeçarBtn");
  const textResults = document.getElementById("text-results");
  let myChart = null;

  function recomeçar() {
    form.reset();
    textResults.innerHTML = "<p>Os resultados aparecerão aqui.</p>";
    if(myChart) {
      myChart.destroy();
      myChart = null;
    }
  }

  recomeçarBtn.addEventListener("click", recomeçar);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Coleta dos valores do formulário
    const receitaMensal = parseFloat(document.getElementById("receitaMensal").value);
    const despesaMensal = parseFloat(document.getElementById("despesaMensal").value);
    const margemEsperada = parseFloat(document.getElementById("margemEsperada").value);
    const ativoTotal = parseFloat(document.getElementById("ativoTotal").value);
    const passivoTotal = parseFloat(document.getElementById("passivoTotal").value);
    const custosFixos = parseFloat(document.getElementById("custosFixos").value);
    const margemContribuicao = parseFloat(document.getElementById("margemContribuicao").value);

    // Validação dos campos
    if ([receitaMensal, despesaMensal, margemEsperada, ativoTotal, passivoTotal, custosFixos, margemContribuicao].some(isNaN)) {
      textResults.innerHTML = "<p style='color: red;'>Preencha todos os campos corretamente para obter um resultado preciso.</p>";
      return;
    }

    // Cálculos financeiros
    const lucroLiquido = receitaMensal - despesaMensal;
    const margemLucro = ((lucroLiquido / receitaMensal) * 100).toFixed(2);
    const liquidezCorrente = (ativoTotal / passivoTotal).toFixed(2);
    const rentabilidade = ((lucroLiquido / ativoTotal) * 100).toFixed(2);
    const pontoEquilibrio = (custosFixos / (margemContribuicao / 100)).toFixed(2);
    const endividamento = ((passivoTotal / ativoTotal) * 100).toFixed(2);

    // Análise diagnóstica
    let diagnostico = [];
    if (liquidezCorrente < 1) {
      diagnostico.push("<p style='color: red;'>Alerta: Dificuldade para pagar dívidas de curto prazo</p>");
    } else {
      diagnostico.push("<p style='color: green;'>Ótimo! Condição financeira saudável para curto prazo</p>");
    }

    if (rentabilidade < 5) {
      diagnostico.push("<p style='color: orange;'>Atenção: Retorno sobre ativos abaixo do ideal</p>");
    } else {
      diagnostico.push("<p style='color: green;'>Bom retorno sobre os ativos</p>");
    }

    if (receitaMensal < pontoEquilibrio) {
      diagnostico.push(`<p style='color: red;'>Alerta: Operando abaixo do ponto de equilíbrio (R$ ${pontoEquilibrio})</p>`);
    } else {
      diagnostico.push("<p style='color: green;'>Operação acima do ponto de equilíbrio</p>");
    }

    // Atualizar resultados textuais
    textResults.innerHTML = `
      <h3>Análise Financeira</h3>
      <p>➤ Lucro Líquido: R$ ${lucroLiquido.toFixed(2)}</p>
      <p>➤ Margem de Lucro: ${margemLucro}%</p>
      <p>➤ Liquidez Corrente: ${liquidezCorrente}</p>
      <p>➤ Rentabilidade: ${rentabilidade}%</p>
      <p>➤ Ponto de Equilíbrio: R$ ${pontoEquilibrio}</p>
      <p>➤ Endividamento: ${endividamento}%</p>
      <div class="diagnostico">${diagnostico.join('')}</div>
    `;

    // Atualizar gráfico de pizza
    if(myChart) myChart.destroy();
    
    const ctx = document.getElementById('pieChart').getContext('2d');
    myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Receita', 'Despesas', 'Lucro'],
        datasets: [{
          data: [receitaMensal, despesaMensal, lucroLiquido],
          backgroundColor: [
            '#4CAF50', // Verde
            '#FF5252', // Vermelho
            '#2196F3'  // Azul
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `R$ ${context.parsed.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  });
});