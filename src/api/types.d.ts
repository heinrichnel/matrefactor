
declare module 'cors' {
  import { RequestHandler } from 'express';

  function cors(options?: cors.CorsOptions): RequestHandler;

  namespace cors {
    interface CorsOptions {
      origin?: boolean | string | RegExp | (string | RegExp)[] |
        ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void);
      methods?: string | string[];
      allowedHeaders?: string | string[];
      exposedHeaders?: string | string[];
      credentials?: boolean;
      maxAge?: number;
      preflightContinue?: boolean;
      optionsSuccessStatus?: number;
    }
  }

  export = cors;
}

// Define CSV record types for typed access
interface CSVRecordObject {
  [key: string]: string | number | null | undefined;
  location?: string;
  tyreId?: string;
  description?: string;
  pattern?: string;
  quantity?: string | number;
  status?: string;
  axlePosition?: string;
  size?: string;
  model?: string;
  brand?: string;
  vehicleId?: string;
  registrationNumber?: string;
  price?: string | number;
  holdingBay?: string;
  expiryDate?: string;
  dateAdded?: string;
  mileage?: string;
}

type CSVRecordArray = (string | number | null | undefined)[];
type CSVRecord = CSVRecordObject | CSVRecordArray;

// Augment Firebase namespace
declare namespace firebase {
  export interface FirebaseService {
    importInventoryItems(items: any[]): Promise<{ success: boolean; count: number }>;
    getAllInventoryItems(): Promise<any[]>;
    getInventoryItemById(id: string): Promise<any>;
    updateInventoryItem(id: string, data: any): Promise<any>;
    deleteInventoryItem(id: string): Promise<any>;
  }
}
