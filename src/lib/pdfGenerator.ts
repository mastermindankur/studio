
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WillFormData } from '@/context/WillFormContext';

const ensureImagesLoaded = (element: HTMLElement): Promise<void> => {
    const images = Array.from(element.getElementsByTagName('img'));
    const promises = images.map(img => {
        if (img.complete && img.naturalHeight !== 0) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Could not load image: ${img.src}`));
        });
    });
    return Promise.all(promises).then(() => {});
};

export const generatePdf = async (formData: WillFormData, filename: string = 'iWills-in_Will.pdf', elementId: string): Promise<void> => {
  const willElement = document.getElementById(elementId);
  
  if (!willElement) {
    console.error(`Will document element with ID '${elementId}' not found`);
    return;
  }
  
  // Temporarily make the element visible for capturing, but invisible to the user.
  const originalStyle = {
      display: willElement.style.display,
      position: willElement.style.position,
      left: willElement.style.left,
      top: willElement.style.top,
      zIndex: willElement.style.zIndex,
      opacity: willElement.style.opacity,
      pointerEvents: willElement.style.pointerEvents,
      width: willElement.style.width,
  }
  willElement.style.display = 'block';
  willElement.style.position = 'absolute';
  willElement.style.left = '0';
  willElement.style.top = '0';
  willElement.style.zIndex = '-1';
  willElement.style.opacity = '0';
  willElement.style.pointerEvents = 'none';
  willElement.style.width = '800px';

  try {
    await ensureImagesLoaded(willElement);

    const canvas = await html2canvas(willElement, {
      scale: 2, 
      useCORS: true, 
      logging: false, 
      width: willElement.scrollWidth,
      height: willElement.scrollHeight,
      windowWidth: willElement.scrollWidth,
      windowHeight: willElement.scrollHeight
    });
    
    // Restore original styles
    Object.assign(willElement.style, originalStyle);

    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth > 0 ? canvasWidth / canvasHeight : 1;
    
    let imgWidth = pdfWidth;
    let imgHeight = imgWidth / ratio;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
    // Ensure element styles are restored even if an error occurs
    Object.assign(willElement.style, originalStyle);
  }
};
