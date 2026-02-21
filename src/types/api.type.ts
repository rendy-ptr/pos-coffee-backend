export type ApiRes<T> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | {
      success: false;
      message: string;
      errorCode?: string;
      error?: string;
      errors?: string[];
      data: null;
    };
