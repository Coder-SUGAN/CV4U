import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export const downloadCvAsPdf = async (elementId: string, fileName: string): Promise<void> => {
    // The element to capture
    const element = document.getElementById(elementId) as HTMLElement;
    if (!element) {
        console.error(`Element with id '${elementId}' not found.`);
        alert("Error: Could not find CV element to download.");
        return;
    }

    // Use html2canvas to draw the element to a canvas
    const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // A4 page dimensions in mm
    const a4Width = 210;
    const a4Height = 297;
    
    // Create a new PDF instance
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate the image dimensions to fit the PDF page width
    const ratio = canvasHeight / canvasWidth;
    const imgWidth = a4Width;
    const imgHeight = imgWidth * ratio;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= a4Height;
    
    // Add more pages if the content is taller than a single A4 page
    while (heightLeft > 0) {
        position -= a4Height;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= a4Height;
    }
    
    // Save the PDF
    pdf.save(`${fileName}.pdf`);
};


export const downloadCvAsDocx = async (elementId: string, fileName: string): Promise<void> => {
    const sourceElement = document.getElementById(elementId) as HTMLElement;
    if (!sourceElement) {
        console.error(`Element with id '${elementId}' not found.`);
        alert("Error: Could not find CV element to download.");
        return;
    }
    
    // To get accurate computed styles, we temporarily override the transform property
    // that scales down the preview. Inline styles have higher specificity than classes.
    const originalTransform = sourceElement.style.transform;
    sourceElement.style.transform = 'scale(1)';

    try {
        const clonedElement = sourceElement.cloneNode(true) as HTMLElement;
        
        // Inline styles for better formatting in DOCX
        const allSourceElements = [sourceElement, ...Array.from(sourceElement.querySelectorAll('*'))];
        const allClonedElements = [clonedElement, ...Array.from(clonedElement.querySelectorAll('*')) as HTMLElement[]];
        
        // A curated list of CSS properties that are generally well-supported in DOCX.
        // We explicitly avoid layout properties like 'display', 'flex-direction', etc.
        const stylePropsToCopy = [
            'color', 'background-color', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-align', 'text-decoration', 'line-height',
            'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
            'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
            'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
            'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
            'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
            'width', 'height', 'border-radius', 'list-style-type', 'object-fit', 'vertical-align'
        ];
        
        allClonedElements.forEach((el, index) => {
            const sourceEl = allSourceElements[index];
            if (sourceEl) {
                const computedStyle = window.getComputedStyle(sourceEl);
                let styleString = '';
                for (const prop of stylePropsToCopy) {
                    const value = computedStyle.getPropertyValue(prop);
                    if (value) {
                         styleString += `${prop}:${value};`;
                    }
                }
                el.setAttribute('style', styleString);
                 // We don't remove classes so we can identify layout containers later
            }
        });

        // --- Layout Transformation to Tables ---
        // Convert Flexbox and Grid layouts to tables for DOCX compatibility.
        const convertToTableLayout = (container: HTMLElement, colWidths: string[]) => {
            const table = document.createElement('table');
            // Copy background styles from container to table
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.backgroundColor = container.style.backgroundColor;

            const tbody = document.createElement('tbody');
            const tr = document.createElement('tr');
            
            const children = Array.from(container.children);

            children.forEach((child, i) => {
                const td = document.createElement('td');
                td.style.width = colWidths[i] || 'auto';
                td.style.verticalAlign = 'top';
                // Move the child element itself into the td to preserve its structure and inlined styles
                td.appendChild(child);
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
            table.appendChild(tbody);
            // Replace original container with the new table
            container.parentNode?.replaceChild(table, container);
        };

        // Find multi-column containers by their structure and classes in the original templates
        // and convert them to tables in the clone.
        const twoColumnFlex = clonedElement.querySelector('.flex > aside + main, .flex > main + aside');
        if (twoColumnFlex) {
            const container = twoColumnFlex.parentElement;
            const sourceContainer = sourceElement.querySelector('.flex > aside + main, .flex > main + aside')?.parentElement;
            if (container && sourceContainer && container.children.length === 2) {
                const totalWidth = sourceContainer.clientWidth;
                const col1Width = `${(sourceContainer.children[0].clientWidth / totalWidth) * 100}%`;
                const col2Width = `${(sourceContainer.children[1].clientWidth / totalWidth) * 100}%`;
                convertToTableLayout(container, [col1Width, col2Width]);
            }
        }
        
        const creativeGrid = clonedElement.querySelector('main.grid.grid-cols-3');
        if (creativeGrid) {
            convertToTableLayout(creativeGrid as HTMLElement, ['33.33%', '66.67%']);
        }
        
        const htmlContent = clonedElement.outerHTML;

        // Check for window.htmlToDocx or window.HTMLToDOCX global
        const globalHtmlToDocx = (window as any).htmlToDocx || (window as any).HTMLToDOCX;

        if (globalHtmlToDocx && typeof globalHtmlToDocx.asBlob === 'function') {
            const fileBuffer = await globalHtmlToDocx.asBlob(htmlContent, {
                orientation: 'portrait',
                margins: { top: 720, right: 720, bottom: 720, left: 720 }
            });
            saveAs(fileBuffer, `${fileName}.docx`);
        } else {
            // High-compatibility MS Word document export with MSO metadata & XML header
            const docHeader = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${fileName}</title>
<!--[if gte mso 9]>
<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForCustomXSL/>
 </w:WordDocument>
</xml>
<![endif]-->
<style>
@page Section1 {
  size: 21.0cm 29.7cm;
  margin: 1.5cm 1.5cm 1.5cm 1.5cm;
  mso-page-orientation: portrait;
}
div.Section1 { page: Section1; }
body {
  font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
  font-size: 10.5pt;
  line-height: 1.25;
}
table { border-collapse: collapse; width: 100%; }
td, th { vertical-align: top; }
</style>
</head>
<body>
<div class="Section1">
`;
            const docFooter = `</div></body></html>`;
            const fullDocHtml = docHeader + htmlContent + docFooter;
            const blob = new Blob(['\ufeff' + fullDocHtml], {
                type: 'application/msword;charset=utf-8'
            });
            saveAs(blob, `${fileName}.doc`);
        }

    } catch (error) {
        console.error("Error generating DOCX:", error);
        alert("Sorry, there was an error creating the Word document.");
    } finally {
        // Restore original transform state
        sourceElement.style.transform = originalTransform;
    }
};

