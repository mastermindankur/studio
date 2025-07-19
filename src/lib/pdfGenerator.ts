

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WillFormData } from '@/context/WillFormContext';

const ensureImagesLoaded = (element: HTMLElement): Promise<void[]> => {
    const images = Array.from(element.getElementsByTagName('img'));
    const promises = images.map(img => {
        if (img.complete && img.naturalHeight !== 0) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = (err) => reject(new Error(`Could not load image: ${img.src}. Error: ${err}`));
        });
    });
    return Promise.all(promises);
};

export const generatePdf = async (formData: WillFormData, filename: string = 'iWills-in_Will.pdf', elementId: string): Promise<void> => {
  const willElement = document.getElementById(elementId);
  
  if (!willElement) {
    console.error(`Will document element with ID '${elementId}' not found`);
    return;
  }
  
  const originalStyle = {
      display: willElement.style.display,
      position: willElement.style.position,
      left: willElement.style.left,
      top: willElement.style.top,
      zIndex: willElement.style.zIndex,
      visibility: willElement.style.visibility,
      width: willElement.style.width,
  }

  // Make the element renderable but not visible to the user
  willElement.style.display = 'block';
  willElement.style.position = 'absolute';
  willElement.style.top = '0px';
  willElement.style.left = '0px';
  willElement.style.zIndex = '-1';
  willElement.style.visibility = 'hidden'; // Use visibility instead of opacity
  willElement.style.width = '800px';

  try {
    // Wait for all images to load before capturing
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

    const imgData = canvas.toDataURL('image/png', 1.0);
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
    
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
    // Restore original styles even if an error occurs
    Object.assign(willElement.style, originalStyle);
  }
};
