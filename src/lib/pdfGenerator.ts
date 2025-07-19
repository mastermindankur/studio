
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WillFormData } from '@/context/WillFormContext';

export const generatePdf = async (formData: WillFormData, filename: string = 'iWills-in_Will.pdf'): Promise<void> => {
  const willElement = document.getElementById('will-document');
  
  if (!willElement) {
    console.error("Will document element not found");
    return;
  }
  
  // Temporarily make the element visible for capturing
  willElement.style.display = 'block';
  willElement.style.position = 'absolute';
  willElement.style.left = '-9999px';
  willElement.style.top = '0';
  willElement.style.width = '800px';

  try {
    const canvas = await html2canvas(willElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true, 
      logging: false, 
    });
    
    // Hide the element again after capture
    willElement.style.display = 'none';

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
    
    let imgWidth = pdfWidth - 40; // with some margin
    let imgHeight = imgWidth / ratio;
    
    let heightLeft = imgHeight;
    let position = 20;

    pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 40);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 40);
    }
    
    pdf.save(filename);

  } catch (error) {
    console.error("Error generating PDF:", error);
    // Ensure element is hidden even if an error occurs
    willElement.style.display = 'none';
  }
};
