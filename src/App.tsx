import { useState, useRef } from 'react'
import './index.css'

function App() {
  const [inputEmail, setInputEmail] = useState('')
  const [outputHtml, setOutputHtml] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  // Helper to generate the table HTML. 
  // Accepts an optional 'context' string to modify content slightly for demo purposes, 
  // ensuring the table STRUCTURE remains 100% intact.
  const generateTableHtml = (context: string = '') => {
    // Mock data based on screenshot
    const headers = ['Subscription ID', 'Request Type', 'VM Type', 'Region', 'Cores', 'Status']
    const baseRowData = [
      ['689ebfb2-0f24-4c89-85dd-9f40f58c22a9', 'Region Enablement', 'ESv3 Series', 'Brazil South', '350', 'Fulfilled'],
      ['689ebfb2-0f24-4c89-85dd-9f40f58c22a9', 'Region Enablement', 'Ev3 Series', 'Brazil South', '350', 'Fulfilled'],
      ['689ebfb2-0f24-4c89-85dd-9f40f58c22a9', 'Region Enablement', 'Dsv6 Series', 'Brazil South', '350', 'Fulfilled'],
    ]

    // Apply context to show button reactivity without breaking structure
    const rowData = baseRowData.map(row => {
      if (context) {
        const newRow = [...row];
        newRow[5] = context;
        return newRow;
      }
      return row;
    });

    // Enterprise Consistency UI Standard - Strict Transparent Grid
    // - High contrast white text, 100% transparent backgrounds
    // - Strict white borders for all rows/columns
    const tableStyle = 'width: 100%; border-collapse: collapse; font-family: "Segoe UI", "Calibri", sans-serif; font-size: 10pt; color: #ffffff; border: 1px solid #ffffff; table-layout: fixed;'
    const thStyle = 'border: 1px solid #ffffff; padding: 6px 12px; background-color: transparent; color: #ffffff; text-align: center; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle;'
    const tdStyle = 'border: 1px solid #ffffff; padding: 6px 12px; background-color: transparent; color: #ffffff; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle;'

    let html = `<table style="${tableStyle}"><thead><tr>`
    headers.forEach(h => html += `<th style="${thStyle}">${h}</th>`)
    html += `</tr></thead><tbody>`

    rowData.forEach(row => {
      html += `<tr>`
      row.forEach(cell => html += `<td style="${tdStyle}">${cell}</td>`)
      html += `</tr>`
    })
    html += `</tbody></table>`

    return html
  }

  const handleAction = (action: string) => {
    setIsLoading(true)
    setTimeout(() => {
      let result = ''
      // Common wrapper for email style to ensure font consistency in the preview
      // using standard opaque colors for text to match the "email" look
      const wrapEmail = (content: string) => `
        <div style="font-family: 'Calibri', sans-serif; font-size: 11pt; color: #ffffff; text-align: left;">
          ${content}
        </div>
      `

      const tableHtml = generateTableHtml()

      // CRITICAL: ALL actions must return the TABLE to preserve structure.
      // We modify the content slightly to reflect the action.
      switch (action) {
        case 'table-format':
          result = wrapEmail(`
            <p><strong>Subject: Azure Quota Increase Request - Formatted Table</strong></p>
            <p>Here is the formatted table as requested:</p>
            <br/>
            ${tableHtml}
            <br/>
            <p>Use the 'Copy as HTML' button to paste this into your email client.</p>
          `)
          break
        case 'en-proofread':
          result = wrapEmail(`
            <p><strong>Subject: Azure Quota Increase Request - Approved</strong></p>
            <p>Dear Customer,</p>
            <p>We are pleased to inform you that your request for an Azure quota increase has been processed successfully. Below are the details of the approved resources:</p>
            <br/>
            ${tableHtml}
            <br/>
            <p>If you have any further questions or require additional resources, please do not hesitate to contact our support team.</p>
            <p>Best regards,<br/>Azure Support Team</p>
          `)
          break
        case 'pt-proofread':
          result = wrapEmail(`
            <p><strong>Assunto: Solicitação de Aumento de Cota Azure - Aprovada</strong></p>
            <p>Prezado Cliente,</p>
            <p>Informamos que sua solicitação de aumento de cota no Azure foi processada com sucesso. Abaixo estão os detalhes dos recursos aprovados:</p>
            <br/>
            ${generateTableHtml('Aprovado')}
            <br/>
            <p>Caso tenha dúvidas adicionais ou necessite de mais recursos, por favor, entre em contato com nossa equipe de suporte.</p>
            <p>Atenciosamente,<br/>Equipe de Suporte Azure</p>
          `)
          break
        case 'translator':
          result = wrapEmail(`
            <p><strong>Subject: Azure Quota Update / Assunto: Atualização de Cota Azure</strong></p>
            <p>Hello / Olá,</p>
            <p>Please find the translated status of your request below / Segue abaixo o status traduzido da sua solicitação:</p>
            <br/>
            ${generateTableHtml('Translated / Traduzido')}
            <br/>
            <p>Thank you / Obrigado.</p>
          `)
          break
        case 'case-title':
          result = wrapEmail(`
            <p><strong>Case Title: Subscription Quota Enablement - [Case #12345]</strong></p>
            <p>Hi there,</p>
            <p>We have updated the case title to reflect the specific request. Please verify the details below:</p>
            <br/>
            ${tableHtml}
            <br/>
            <p>Let us know if this looks correct.</p>
          `)
          break
        case 'case-notes':
          result = wrapEmail(`
            <p><strong>Internal Case Notes</strong></p>
            <p><strong>Status:</strong> Resolved</p>
            <p><strong>Action Taken:</strong> Verified capacity and approved quota increase for the following regions:</p>
            <br/>
            ${tableHtml}
            <br/>
            <p>Customer notified via email. Case ready for closure.</p>
          `)
          break
        case 'troubleshooting':
          result = wrapEmail(`
            <p><strong>Troubleshooting Report</strong></p>
            <p>We investigated the deployment failure and confirmed it was due to a quota limit. We have now applied the necessary increase:</p>
            <br/>
            ${tableHtml}
            <br/>
            <p>Please attempt the deployment again. If the issue persists, provide the new error logs.</p>
          `)
          break
        default:
          result = wrapEmail(`
            <p>Prezado(a),</p>
            <p>Conforme solicitado, aumentamos sua cota de núcleos de computação do Azure para as VMs da série [# Series] na região [# region] para [# cores] núcleos, para a assinatura com ID: [Subscription ID].</p>
            <br/>
            ${tableHtml}
            <br/>
            <p>Para verificar e confirmar um aumento de cota no Azure:</p>
          `)
      }
      setOutputHtml(result)
      setIsLoading(false)
    }, 800)
  }

  const copyToClipboard = async () => {
    if (!outputHtml) return
    try {
      const type = "text/html"
      const blob = new Blob([outputHtml], { type })
      const data = [new ClipboardItem({ [type]: blob })]
      await navigator.clipboard.write(data)
      alert("Copied to clipboard as HTML!")
    } catch (err) {
      console.error('Failed to copy: ', err)
      navigator.clipboard.writeText(outputRef.current?.innerText || '')
      alert("Copied as plain text (HTML copy failed check console).")
    }
  }

  return (
    <>
      <h1 className="title">Email Generator AI</h1>

      <div className="container">
        <div className="input-group">
          <label className="label">Paste Email Draft</label>
          <textarea
            className="textarea"
            placeholder="Paste your rough email text here..."
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
          />
        </div>

        <div className="actions">
          <button className="btn" onClick={() => handleAction('table-format')} disabled={isLoading}>
            <span className="btn-icon">📊</span>
            Table Format
          </button>
          <button className="btn" onClick={() => handleAction('en-proofread')} disabled={isLoading}>
            <span className="btn-icon">📝</span>
            EN Proofread
          </button>
          <button className="btn" onClick={() => handleAction('pt-proofread')} disabled={isLoading}>
            <span className="btn-icon">🇧🇷</span>
            PT Proofread
          </button>
          <button className="btn" onClick={() => handleAction('translator')} disabled={isLoading}>
            <span className="btn-icon">🌐</span>
            EN ↔ PT Translator
          </button>
          <button className="btn" onClick={() => handleAction('case-title')} disabled={isLoading}>
            <span className="btn-icon">🏷️</span>
            Case Title
          </button>
          <button className="btn" onClick={() => handleAction('case-notes')} disabled={isLoading}>
            <span className="btn-icon">📋</span>
            Case Notes
          </button>
          <button className="btn" onClick={() => handleAction('troubleshooting')} disabled={isLoading}>
            <span className="btn-icon">🔧</span>
            Troubleshooting
          </button>
        </div>

        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label">Generated Result (Preview)</label>
            <button className="copy-btn" onClick={copyToClipboard} disabled={!outputHtml}>
              Copy as HTML
            </button>
          </div>
          <div
            className="output-preview"
            ref={outputRef}
            dangerouslySetInnerHTML={{ __html: outputHtml || generateTableHtml() }} // Default to table if empty to show stability
          />
        </div>
      </div>
    </>
  )
}

export default App
