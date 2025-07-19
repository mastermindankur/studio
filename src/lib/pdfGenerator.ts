
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WillFormData } from '@/context/WillFormContext';

const RENDER_ELEMENT_ID = "will-document-render";

const ensureImagesLoaded = (element: HTMLElement): Promise<void> => {
    const images = Array.from(element.getElementsByTagName('img'));
    const promises = images.map(img => {
        if (img.complete) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Could not load image: ${img.src}`));
        });
    });
    return Promise.all(promises).then(() => {});
};

export const generatePdf = async (formData: WillFormData, filename: string = 'iWills-in_Will.pdf', elementId: string = RENDER_ELEMENT_ID): Promise<void> => {
  const willElement = document.getElementById(elementId);
  
  if (!willElement) {
    console.error("Will document element not found");
    return;
  }
  
  // Temporarily make the element visible for capturing
  const originalStyle = {
      display: willElement.style.display,
      position: willElement.style.position,
      left: willElement.style.left,
      top: willElement.style.top,
      width: willElement.style.width,
  }
  willElement.style.display = 'block';
  willElement.style.position = 'absolute';
  willElement.style.left = '-9999px';
  willElement.style.top = '0';
  willElement.style.width = '800px';

  try {
    await ensureImagesLoaded(willElement);

    const canvas = await html2canvas(willElement, {
      scale: 2, 
      useCORS: true, 
      logging: false, 
    });
    
    // Restore original styles
    willElement.style.display = originalStyle.display;
    willElement.style.position = originalStyle.position;
    willElement.style.left = originalStyle.left;
    willElement.style.top = originalStyle.top;
    willElement.style.width = originalStyle.width;

    const imgData = canvas.toDataURL('image/jpeg', 0.9); // Use JPEG for better compatibility
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    
    let imgWidth = pdfWidth - 40; // with some margin
    let imgHeight = imgWidth / ratio;
    
    let heightLeft = imgHeight;
    let position = 20;

    pdf.addImage(imgData, 'JPEG', 20, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 40);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight; // This should be position -= pdfHeight - 40; but jspdf handles it internally
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 20, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 40);
    }
    
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
    // Ensure element is hidden even if an error occurs
    willElement.style.display = originalStyle.display;
  }
};
