document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdownInput');
    const pdfTitleInput = document.getElementById('pdfTitle');
    const previewContent = document.getElementById('previewContent');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Contenido predeterminado.
    const sampleMarkdown = `# Notas

¡Hola! Esta es tu nueva herramienta favorita para crear PDFs.

## Cosas que puedes hacer:

- **Escribir** tus pensamientos
- **Organizar** tus tareas
- **Crear** documentos

> "Todo lo que necesitas es amor y un poco de purpurina."

### Listado Girly:

1. Brillo
2. Color rosa
3. ¡Mucha magia!

---

### Ejemplo de código con estilo:
\`\`\`javascript
function esMagia() {
  return true; // TODO
}
\`\`\`
`;

    if (markdownInput.value === '') {
        markdownInput.value = sampleMarkdown;
    }

    const updatePreview = () => {
        // Parsear el markdown.
        const rawValue = markdownInput.value;
        previewContent.innerHTML = marked.parse(rawValue);
    };

    // Render inicial.
    updatePreview();

    // Preview.
    markdownInput.addEventListener('input', updatePreview);

    // Botón de limpiar.
    clearBtn.addEventListener('click', () => {
        if (confirm('¿Quieres borrar todo? 🥺')) {
            markdownInput.value = '';
            updatePreview();
        }
    });

    // Exportar PDF.
    downloadBtn.addEventListener('click', () => {
        const title = pdfTitleInput.value || 'Mi Documento';
        const filename = title.toLowerCase().replace(/\s+/g, '-') + '.pdf';

        // Preparar el elemento a exportar.
        previewContent.classList.add('pdf-export-body');

        const opt = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 3,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Feedback visual mientras se exporta.
        downloadBtn.disabled = true;
        const originalContent = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<span>Creando PDF...</span>';

        // Exportar.
        html2pdf().set(opt).from(previewContent).toPdf().get('pdf').then((pdf) => {
            // En caso de éxito.
            previewContent.classList.remove('pdf-export-body');
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalContent;
        }).save().catch(err => {
            console.error('Error al exportar:', err);
            alert('¡Oh no! Hubo un error al exportar. 🥺');
            previewContent.classList.remove('pdf-export-body');
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalContent;
        });
    });
});
