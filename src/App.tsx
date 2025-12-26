import { useState, useRef } from 'react'
import './index.css'

const translations = {
  en: {
    title: 'Email Generator AI',
    pasteEmail: 'Paste Email Draft',
    placeholder: 'Paste your rough email text here...',
    tableFormat: 'Table Format',
    enProofread: 'EN Proofread',
    ptProofread: 'PT Proofread',
    translator: 'EN ↔ PT Translator',
    caseTitle: 'Case Title',
    caseNotes: 'Case Notes',
    troubleshooting: 'Troubleshooting',
    preview: 'Generated Result (Preview)',
    copyBtn: 'Copy as HTML',
    copied: 'Copied to clipboard!',
    copyFailed: 'Failed to copy',
    loading: 'Generating...',
    headers: ['Subscription ID', 'Request Type', 'VM Type', 'Region', 'Cores', 'Status'],
    statusValue: 'Fulfilled'
  },
  pt: {
    title: 'Gerador de E-mail AI',
    pasteEmail: 'Cole o rascunho do e-mail',
    placeholder: 'Cole o texto bruto do seu e-mail aqui...',
    tableFormat: 'Formatar Tabela',
    enProofread: 'Revisão EN',
    ptProofread: 'Revisão PT',
    translator: 'Tradutor EN ↔ PT',
    caseTitle: 'Título do Caso',
    caseNotes: 'Notas do Caso',
    troubleshooting: 'Solução de Problemas',
    preview: 'Resultado Gerado (Prévia)',
    copyBtn: 'Copiar como HTML',
    copied: 'Copiado para a área de transferência!',
    copyFailed: 'Falha ao copiar',
    loading: 'Gerando...',
    headers: ['ID da Assinatura', 'Tipo de Solicitação', 'Tipo de VM', 'Região', 'Núcleos', 'Status'],
    statusValue: 'Atendido'
  }
}

function App() {
  const [lang, setLang] = useState<'en' | 'pt'>('en')
  const [inputEmail, setInputEmail] = useState('')
  const [outputHtml, setOutputHtml] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const outputRef = useRef<HTMLDivElement>(null)

  const t = translations[lang]

  const generateTableHtml = (context: string = '') => {
    const headers = t.headers
    const baseRowData = [
      ['689ebfb2-0f24-4c89-85dd-9f40f58c22a9', lang === 'en' ? 'Region Enablement' : 'Habilitação Regional', 'ESv3 Series', 'Brazil South', '350', t.statusValue],
      ['689ebfb2-0f24-4c89-85dd-9f40f58c22a9', lang === 'en' ? 'Region Enablement' : 'Habilitação Regional', 'Ev3 Series', 'Brazil South', '350', t.statusValue],
      ['689ebfb2-0f24-4c89-85dd-9f40f58c22a9', lang === 'en' ? 'Region Enablement' : 'Habilitação Regional', 'Dsv6 Series', 'Brazil South', '350', t.statusValue],
    ]

    const rowData = baseRowData.map(row => {
      if (context) {
        const newRow = [...row];
        newRow[5] = context;
        return newRow;
      }
      return row;
    });

    const tableStyle = 'width: 100%; border-collapse: collapse; font-family: "Segoe UI", "Calibri", sans-serif; font-size: 10pt; color: #000000; border: 1px solid #000000; table-layout: auto;'
    const thStyle = 'border: 1px solid #000000; padding: 6px 12px; background-color: #ffffff; color: #000000; text-align: center; font-weight: bold; white-space: nowrap; vertical-align: middle;'
    const tdStyle = 'border: 1px solid #000000; padding: 6px 12px; background-color: #ffffff; color: #000000; text-align: center; white-space: nowrap; vertical-align: middle;'

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
      const wrapEmail = (content: string) => `
        <div style="font-family: 'Segoe UI', 'Calibri', sans-serif; font-size: 10pt; color: #000000; text-align: left; background-color: #ffffff; padding: 20px;">
          ${content}
        </div>
      `

      const tableHtml = generateTableHtml()

      switch (action) {
        case 'table-format':
          result = wrapEmail(lang === 'en' ? `
            <p><strong>Subject: Azure Quota Increase Request - Formatted Table</strong></p>
            <p>Here is the formatted table as requested:</p>
            <br/>
            ${tableHtml}
          ` : `
            <p><strong>Assunto: Solicitação de Aumento de Cota Azure - Tabela Formatada</strong></p>
            <p>Segue a tabela formatada conforme solicitado:</p>
            <br/>
            ${tableHtml}
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
            <p>Best regards,<br/>Azure Support Team</p>
          `)
          break
        case 'pt-proofread':
          result = wrapEmail(`
            <p><strong>Assunto: Solicitação de Aumento de Cota Azure - Aprovada</strong></p>
            <p>Prezado Cliente,</p>
            <p>Informamos que sua solicitação de aumento de cota no Azure foi processada com sucesso. Abaixo estão os detalhes dos recursos aprovados:</p>
            <br/>
            ${generateTableHtml(translations.pt.statusValue)}
            <br/>
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
          `)
          break
        case 'case-title':
          result = wrapEmail(`
            <p><strong>Case Title: Subscription Quota Enablement - [Case #12345]</strong></p>
            <br/>
            ${tableHtml}
          `)
          break
        case 'case-notes':
          result = wrapEmail(`
            <p><strong>Internal Case Notes</strong></p>
            <p><strong>Status:</strong> Resolved</p>
            <br/>
            ${tableHtml}
          `)
          break
        case 'troubleshooting':
          result = wrapEmail(`
            <p><strong>Troubleshooting Report</strong></p>
            <br/>
            ${tableHtml}
          `)
          break
        default:
          result = wrapEmail(`
            <p>${lang === 'en' ? 'Dear Customer,' : 'Prezado(a),'}</p>
            <p>${lang === 'en' ? 'As requested, we have updated your quota.' : 'Conforme solicitado, atualizamos sua cota.'}</p>
            <br/>
            ${tableHtml}
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
      setCopyStatus(t.copied)
      setTimeout(() => setCopyStatus(''), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
      navigator.clipboard.writeText(outputRef.current?.innerText || '')
      setCopyStatus(t.copyFailed)
      setTimeout(() => setCopyStatus(''), 2000)
    }
  }

  return (
    <main id="main-content">
      <div className="language-selector">
        <button
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => setLang('en')}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          className={`lang-btn ${lang === 'pt' ? 'active' : ''}`}
          onClick={() => setLang('pt')}
          aria-label="Trocar para Português"
        >
          PT
        </button>
      </div>

      <h1 className="title">{t.title}</h1>

      <div className="container">
        <div className="input-group">
          <label className="label" htmlFor="email-draft">{t.pasteEmail}</label>
          <textarea
            id="email-draft"
            className="textarea"
            placeholder={t.placeholder}
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            aria-describedby="draft-hint"
          />
        </div>

        <div className="actions" role="group" aria-label="Action Buttons">
          <button className="btn" onClick={() => handleAction('table-format')} disabled={isLoading} title={t.tableFormat}>
            <span className="btn-icon">📊</span>
            {t.tableFormat}
          </button>
          <button className="btn" onClick={() => handleAction('en-proofread')} disabled={isLoading} title={t.enProofread}>
            <span className="btn-icon">📝</span>
            {t.enProofread}
          </button>
          <button className="btn" onClick={() => handleAction('pt-proofread')} disabled={isLoading} title={t.ptProofread}>
            <span className="btn-icon">🇧🇷</span>
            {t.ptProofread}
          </button>
          <button className="btn" onClick={() => handleAction('translator')} disabled={isLoading} title={t.translator}>
            <span className="btn-icon">🌐</span>
            {t.translator}
          </button>
          <button className="btn" onClick={() => handleAction('case-title')} disabled={isLoading} title={t.caseTitle}>
            <span className="btn-icon">🏷️</span>
            {t.caseTitle}
          </button>
          <button className="btn" onClick={() => handleAction('case-notes')} disabled={isLoading} title={t.caseNotes}>
            <span className="btn-icon">📋</span>
            {t.caseNotes}
          </button>
          <button className="btn" onClick={() => handleAction('troubleshooting')} disabled={isLoading} title={t.troubleshooting}>
            <span className="btn-icon">🔧</span>
            {t.troubleshooting}
          </button>
        </div>

        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label" htmlFor="preview-output">{t.preview}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {copyStatus && <span className="status-msg fade-in">{copyStatus}</span>}
              <button className="copy-btn" onClick={copyToClipboard} disabled={!outputHtml || isLoading}>
                {t.copyBtn}
              </button>
            </div>
          </div>
          <div
            id="preview-output"
            className={`output-preview ${isLoading ? 'loading' : ''}`}
            ref={outputRef}
            aria-live="polite"
            aria-label={t.preview}
            dangerouslySetInnerHTML={{ __html: outputHtml || (isLoading ? `<p>${t.loading}</p>` : generateTableHtml()) }}
          />
        </div>
      </div>
    </main>
  )
}

export default App
