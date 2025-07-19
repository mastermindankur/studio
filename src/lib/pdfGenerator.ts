
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to ensure all images within an element are loaded
const ensureImagesLoaded = async (element: HTMLElement): Promise<void> => {
  const images = Array.from(element.getElementsByTagName('img'));
  const promises = images.map(img => {
    return new Promise<void>((resolve) => {
      if (img.complete && img.naturalHeight !== 0) {
        // If image is already loaded and rendered
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => {
          // An errored image won't block PDF generation, it'll just be missing.
          console.warn(`Could not load image: ${img.src}`);
          resolve();
        };
      }
    });
  });
  await Promise.all(promises);
};


export const generatePdf = async (elementId: string, filename: string = 'iWills-in_Will.pdf'): Promise<void> => {
  const willElement = document.getElementById(elementId);
  
  if (!willElement) {
    console.error(`Will document element with ID '${elementId}' not found`);
    return;
  }
  
  const originalStyle = {
      visibility: willElement.style.visibility,
      position: willElement.style.position,
      left: willElement.style.left,
      top: willElement.style.top,
      zIndex: willElement.style.zIndex,
      width: willElement.style.width,
  };

  willElement.style.visibility = 'visible';
  willElement.style.position = 'absolute';
  willElement.style.left = '0px';
  willElement.style.top = '0px';
  willElement.style.zIndex = '1000'; // Render on top to ensure it's "visible" to the browser
  willElement.style.width = '800px'; // A fixed width often helps canvas rendering

  try {
    await ensureImagesLoaded(willElement);

    const canvas = await html2canvas(willElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    Object.assign(willElement.style, originalStyle);

    const imgData = canvas.toDataURL('image/png');
    
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
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
    Object.assign(willElement.style, originalStyle);
  }
};
