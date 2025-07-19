
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WillFormData } from '@/context/WillFormContext';

export const generatePdf = async (formData: WillFormData, filename: string = 'iWills-in_Will.pdf', elementId: string): Promise<void> => {
  const willElement = document.getElementById(elementId);
  
  if (!willElement) {
    console.error(`Will document element with ID '${elementId}' not found`);
    return;
  }
  
  // A simple method to prepare the element for rendering.
  const originalStyle = {
      display: willElement.style.display,
      position: willElement.style.position,
      left: willElement.style.left,
      top: willElement.style.top,
      zIndex: willElement.style.zIndex,
  }

  willElement.style.display = 'block';
  willElement.style.position = 'absolute';
  willElement.style.left = '0px';
  willElement.style.top = '0px';
  willElement.style.zIndex = '1000'; // Bring to front to ensure it's rendered
  willElement.style.backgroundColor = 'white'; // Ensure a solid background

  try {
    const canvas = await html2canvas(willElement, {
      scale: 2, // Use a higher scale for better quality
      useCORS: true,
      logging: true, // Enable logging to see what html2canvas is doing
    });
    
    // Restore original styles immediately after capture
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
    
    // Calculate the aspect ratio
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;

    // We will only add one page for now.
    if (imgHeight > pdfHeight) {
        console.warn("Content exceeds single page, but multi-page logic is not yet implemented. Content will be clipped.");
    }
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
    // Restore original styles even if an error occurs
    Object.assign(willElement.style, originalStyle);
  }
};
