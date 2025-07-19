
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


export const generatePdf = async (elementId: string, filename: string): Promise<void> => {
  const willElement = document.getElementById(elementId);
  
  if (!willElement) {
    console.error(`Will document element with ID '${elementId}' not found`);
    return;
  }
  
  const originalStyle = {
      display: willElement.style.display,
  };

  // Temporarily make the element visible for rendering
  willElement.style.display = 'block';

  try {
    await ensureImagesLoaded(willElement);

    const canvas = await html2canvas(willElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      width: willElement.scrollWidth,
      height: willElement.scrollHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
    
    // Restore original style
    willElement.style.display = originalStyle.display;

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
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
    // Restore original style even if an error occurs
    willElement.style.display = originalStyle.display;
  }
};
