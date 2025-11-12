// Utility to load and parse PPTX file
// Since direct PPTX parsing in browser is complex, we'll use a simpler approach
// where slides are pre-converted to images or we use a library

export interface SlideData {
  id: number;
  image: string;
  title: string;
  description: string;
}

// For now, we'll use a placeholder approach
// In production, you would:
// 1. Convert PPTX to images server-side, or
// 2. Use a library like pptxjs to parse PPTX client-side, or
// 3. Create a backend endpoint that converts PPTX to images

export const loadPitchDeckSlides = async (): Promise<SlideData[]> => {
  // This is a placeholder - in production, you would:
  // 1. Fetch slide data from backend API that converts PPTX to images
  // 2. Or use a library to parse PPTX directly
  
  // For now, return empty array - slides will be provided via props
  return [];
};

