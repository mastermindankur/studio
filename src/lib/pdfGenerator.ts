
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to ensure all images within a cloned element are loaded
const ensureImagesLoaded = (element: HTMLElement): Promise<void[]> => {
  const images = Array.from(element.getElementsByTagName('img'));
  return Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => {
              console.warn(`Could not load image for PDF: ${img.src}`);
              resolve(); // Resolve anyway to not block PDF generation
            };
          }
        })
    )
  );
};

export const generatePdf = async (elementId: string, filename: string): Promise<void> => {
  const sourceElement = document.getElementById(elementId);
  
  if (!sourceElement) {
    console.error(`PDF generation failed: Element with ID '${elementId}' not found.`);
    return;
  }

  // Create a clone of the element to render
  const clone = sourceElement.cloneNode(true) as HTMLElement;

  // Style the clone to be rendered off-screen but still in the DOM flow
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '-9999px'; // Position it far off the left side
  clone.style.width = '800px'; // A fixed width helps with consistent rendering
  clone.style.height = 'auto';
  clone.style.zIndex = '-1'; // Ensure it's behind everything
  clone.style.display = 'block'; // Ensure it's not hidden

  document.body.appendChild(clone);

  try {
    // Wait for images in the clone to load
    await ensureImagesLoaded(clone);

    const canvas = await html2canvas(clone, {
      scale: 2, // Use a higher scale for better resolution
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png', 1.0); // High quality PNG

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4', // a4 size: 595.28 x 841.89 pt
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate the aspect ratio to fit the content to the PDF width
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;

    let heightLeft = imgHeight;
    let position = 0;

    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add more pages if the content is longer than one page
    while (heightLeft > 0) {
      position -= pdfHeight; // Move the position up for the next page
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);

  } catch (error) {
    console.error("Error during PDF generation:", error);
  } finally {
    // IMPORTANT: Clean up by removing the cloned element from the DOM
    document.body.removeChild(clone);
  }
};
