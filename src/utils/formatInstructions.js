/**
 * Smart instruction formatter that handles various formats
 * - Removes "Step X:" prefixes
 * - Splits by numbers (1., 2., etc.)
 * - Splits by periods with capital letters
 * - Handles newlines and paragraphs
 * - Creates clean bullet points
 */

export const formatInstructions = (instructions) => {
  if (!instructions || instructions.trim() === '') {
    return ['No instructions available.'];
  }

  let cleanText = instructions
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // ============================================
  // STEP 1: Remove "Step X:" prefixes
  // ============================================
  cleanText = cleanText.replace(/Step\s*\d+\s*[:.\-]\s*/gi, '');
  cleanText = cleanText.replace(/STEP\s*\d+\s*[:.\-]\s*/gi, '');
  cleanText = cleanText.replace(/Directions?\s*[:.]?\s*/gi, '');
  cleanText = cleanText.replace(/Instructions?\s*[:.]?\s*/gi, '');
  cleanText = cleanText.replace(/Method\s*[:.]?\s*/gi, '');

  // ============================================
  // STEP 2: Split into steps
  // ============================================
  let steps = [];

  // Try to split by numbered patterns (1., 2., 3. or 1) 2) 3))
  if (cleanText.match(/\d+\./) || cleanText.match(/\d+\)/)) {
    steps = cleanText.split(/\d+[\.\)]\s*/).filter(s => s.trim());
  }
  // Try to split by newlines
  else if (cleanText.includes('\n')) {
    steps = cleanText.split('\n').filter(s => s.trim());
  }
  // If no numbers or newlines, split by periods with capital letters
  else {
    // Split by period followed by space and capital letter
    const parts = cleanText.split(/\.\s+(?=[A-Z])/);
    if (parts.length > 1) {
      steps = parts.map(p => p.trim());
    } else {
      // If still one chunk, try splitting by periods
      const periodParts = cleanText.split('. ').filter(s => s.trim());
      if (periodParts.length > 1) {
        steps = periodParts.map(p => p.trim());
      } else {
        // Final fallback - just use the whole text
        steps = [cleanText];
      }
    }
  }

  // ============================================
  // STEP 3: Clean up each step
  // ============================================
  const cleanedSteps = steps
    .filter(step => step.length > 0)
    .map(step => {
      let cleaned = step.trim();
      // Remove leading numbers if they slipped through
      cleaned = cleaned.replace(/^\d+[\.\)]\s*/, '');
      // Capitalize first letter
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      // Add period if missing and not ending with punctuation
      if (!cleaned.match(/[.!?]$/)) {
        cleaned += '.';
      }
      return cleaned;
    });

  // ============================================
  // STEP 4: Combine very short steps with the next one
  // ============================================
  if (cleanedSteps.length > 1) {
    const combined = [];
    let buffer = '';
    
    cleanedSteps.forEach(step => {
      // If step is very short (under 20 chars), combine it with the next
      if (step.length < 20 && buffer) {
        buffer = buffer + ' ' + step;
      } else if (step.length < 20) {
        buffer = step;
      } else {
        if (buffer) {
          combined.push(buffer);
          buffer = '';
        }
        combined.push(step);
      }
    });
    
    if (buffer) {
      combined.push(buffer);
    }
    
    return combined;
  }

  return cleanedSteps;
};

/**
 * Helper to check if a step looks like a "Step X:" label
 */
export const isStepLabel = (text) => {
  return /^Step\s*\d+\s*[:.\-]\s*/i.test(text);
};

/**
 * Helper to clean a single step
 */
export const cleanStep = (step) => {
  let cleaned = step.trim();
  cleaned = cleaned.replace(/Step\s*\d+\s*[:.\-]\s*/gi, '');
  cleaned = cleaned.replace(/STEP\s*\d+\s*[:.\-]\s*/gi, '');
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return cleaned;
};