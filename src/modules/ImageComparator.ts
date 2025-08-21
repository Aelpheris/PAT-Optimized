

interface ImageComparisonOptions {
  // Tolerance for individual pixel comparison (0-255)
  pixelTolerance?: number;
  // Percentage of pixels that must match within tolerance (0-1)
  pixelMatchThreshold?: number;
  // Tolerance for average color comparison (0-255)
  averageTolerance?: number;
  // Use average comparison instead of pixel-by-pixel
  useAverageComparison?: boolean;
}

interface ComparisonResult {
  areSimilar: boolean;
  pixelMatchPercentage?: number;
  averageDifference?: {
    r: number;
    g: number;
    b: number;
    a: number;
    total: number;
  };
}

export class ImageComparator {

  private defaultOptions: ImageComparisonOptions = {
    pixelTolerance: 10,
    pixelMatchThreshold: 0.95,
    averageTolerance: 15,
    useAverageComparison: false
  };

    /**
   * Compare two canvas elements or ImageData objects
   */
  compareImages(
    image1: HTMLCanvasElement | ImageData,
    image2: HTMLCanvasElement | ImageData,
    options: ImageComparisonOptions = {}
  ): ComparisonResult {
    const opts = { ...this.defaultOptions, ...options };
    
    const imageData1 = this.getImageData(image1);
    const imageData2 = this.getImageData(image2);

    // Check dimensions match
    if (imageData1.width !== imageData2.width || imageData1.height !== imageData2.height) {
      return { areSimilar: false };
    }

    if (opts.useAverageComparison) {
      return this.compareByAverage(imageData1, imageData2, opts.averageTolerance!);
    } else {
      return this.compareByPixels(imageData1, imageData2, opts);
    }
  }

    /**
   * Extract ImageData from canvas or return as-is if already ImageData
   */
  private getImageData(source: HTMLCanvasElement | ImageData): ImageData {
    if (source instanceof ImageData) {
      return source;
    }
    
    const ctx = source.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2d context from canvas');
    }
    
    return ctx.getImageData(0, 0, source.width, source.height);
  }

    /**
   * Compare images pixel by pixel with tolerance
   */
  private compareByPixels(
    imageData1: ImageData,
    imageData2: ImageData,
    options: ImageComparisonOptions
  ): ComparisonResult {
    const data1 = imageData1.data;
    const data2 = imageData2.data;
    const totalPixels = imageData1.width * imageData2.height;
    let matchingPixels = 0;

    for (let i = 0; i < data1.length; i += 4) {
      const r1 = data1[i];
      const g1 = data1[i + 1];
      const b1 = data1[i + 2];
      const a1 = data1[i + 3];

      const r2 = data2[i];
      const g2 = data2[i + 1];
      const b2 = data2[i + 2];
      const a2 = data2[i + 3];

      // Calculate color distance using Euclidean distance
      const distance = Math.sqrt(
        Math.pow(r1 - r2, 2) +
        Math.pow(g1 - g2, 2) +
        Math.pow(b1 - b2, 2) +
        Math.pow(a1 - a2, 2)
      );

      if (distance <= options.pixelTolerance!) {
        matchingPixels++;
      }
    }

    const matchPercentage = matchingPixels / totalPixels;
    const areSimilar = matchPercentage >= options.pixelMatchThreshold!;

    return {
      areSimilar,
      pixelMatchPercentage: matchPercentage
    };
  }

  /**
   * Compare images by their average color values
   */
  private compareByAverage(
    imageData1: ImageData,
    imageData2: ImageData,
    tolerance: number
  ): ComparisonResult {
    const avg1 = this.calculateAverageColor(imageData1);
    const avg2 = this.calculateAverageColor(imageData2);

    const rDiff = Math.abs(avg1.r - avg2.r);
    const gDiff = Math.abs(avg1.g - avg2.g);
    const bDiff = Math.abs(avg1.b - avg2.b);
    const aDiff = Math.abs(avg1.a - avg2.a);

    const totalDifference = (rDiff + gDiff + bDiff + aDiff) / 4;
    const areSimilar = totalDifference <= tolerance;

    return {
      areSimilar,
      averageDifference: {
        r: rDiff,
        g: gDiff,
        b: bDiff,
        a: aDiff,
        total: totalDifference
      }
    };
  }

  /**
   * Calculate average RGBA values for an image
   */
  private calculateAverageColor(imageData: ImageData): { r: number; g: number; b: number; a: number } {
    const data = imageData.data;
    let r = 0, g = 0, b = 0, a = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      a += data[i + 3];
    }

    return {
      r: r / pixelCount,
      g: g / pixelCount,
      b: b / pixelCount,
      a: a / pixelCount
    };
  }
}