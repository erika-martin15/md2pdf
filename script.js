document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdownInput');
    const pdfTitleInput = document.getElementById('pdfTitle');
    const previewContent = document.getElementById('previewContent');
    const downloadBtn = document.getElementById('downloadBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const mdUploadInput = document.getElementById('mdUpload');
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

    // Cargar contenido inicial si está vacío
    if (markdownInput.value.trim() === '') {
        markdownInput.value = sampleMarkdown;
    }

    const updatePreview = () => {
        // Parsear el markdown.
        const rawValue = markdownInput.value;
        previewContent.innerHTML = marked.parse(rawValue);
    };

    // Render inicial.
    updatePreview();

    // Preview en tiempo real.
    markdownInput.addEventListener('input', updatePreview);

    // Botón de limpiar.
    clearBtn.addEventListener('click', () => {
        if (confirm('¿Quieres borrar todo? 🥺')) {
            markdownInput.value = '';
            updatePreview();
        }
    });

    // Botón de subir (dispara el input oculto)
    uploadBtn.addEventListener('click', () => {
        mdUploadInput.click();
    });

    // Leer archivo .md
    mdUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.md')) {
            alert('Por favor, selecciona un archivo .md 🥺');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            markdownInput.value = content;

            // Actualizar título basándose en el nombre del archivo
            const fileNameNoExt = file.name.replace(/\.[^/.]+$/, "");
            pdfTitleInput.value = fileNameNoExt.charAt(0).toUpperCase() + fileNameNoExt.slice(1);

            updatePreview();
        };
        reader.readAsText(file);
    });

    // Exportar PDF.
    downloadBtn.addEventListener('click', () => {
        const title = pdfTitleInput.value || 'Mi Documento';
        const filename = title.toLowerCase().replace(/\s+/g, '-') + '.pdf';

        // Preparar el elemento a exportar.
        previewContent.classList.add('pdf-export-body');

        const opt = {
            margin: [15, 15, 15, 15],
            filename: filename,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                backgroundColor: '#ffffff'
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Feedback visual mientras se exporta.
        downloadBtn.disabled = true;
        const originalContent = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<span>Creando PDF...</span>';

        // Exportar.
        html2pdf().set(opt).from(previewContent).toPdf().get('pdf').then((pdf) => {
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
